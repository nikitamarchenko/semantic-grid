import datetime
import json
from typing import Type

import structlog
from agents import ModelSettings, RunConfig, Runner
from celery.utils.log import get_task_logger
from dotenv import load_dotenv
from fastmcp.client import Client
from fastmcp.client.logging import LogMessage
from fastmcp.exceptions import ClientError
from mcp.types import TextContent
from openai.types.responses import EasyInputMessageParam
from sqlalchemy.orm.session import Session

from fm_app.ai_models.model import AIModel
from fm_app.api.model import RequestStatus, StructuredResponse, WorkerRequest
from fm_app.config import get_settings
from fm_app.mcp_servers.db_meta import get_db_name
from fm_app.mcp_servers.db_ref import get_db_ref_prompt_items
from fm_app.workers.agent import init_agent

server_script = "fm_app/mcp_servers/solana_db.py"  # Path to a Python server file

load_dotenv(".env")
settings = get_settings()
logger = structlog.wrap_logger(get_task_logger(__name__))


def log_handler(params: LogMessage):
    logger.info(
        f"[MCP - {params.level.upper()}] {params.logger or 'default'}: {params.data}"
    )


db_client = Client(server_script, log_handler=log_handler)
print(db_client.transport)


async def mcp_flow(
    req: WorkerRequest, ai_model: Type[AIModel], db_wh: Session, db: Session
):
    structlog.contextvars.bind_contextvars(
        request_id=req.request_id, flow_name=ai_model.get_name() + "_mcp"
    )

    logger.info("Starting flow", flow_stage="start", flow_step_num=0, flow=req.flow)

    req.structured_response = StructuredResponse()
    ts = datetime.datetime.now()
    print("\n\nSTART:", req.request, "\n\n")

    dbref_prompts = get_db_ref_prompt_items(req, 0, settings, logger)
    db_name = get_db_name(req)

    ts1 = datetime.datetime.now()

    instructions = f"""
       {dbref_prompts}\n
       When calling MCP resources or functions that requre **db_name** param, 
               use db_name="{db_name}"\n
       {ai_model.get_specific_instructions()}\n
       """

    messages = [
        EasyInputMessageParam(role="system", content=instructions),
        EasyInputMessageParam(role="user", content=req.request),
    ]

    (server, agent) = await init_agent()
    print("\n\nDBREF:", ts1 - ts, bool(agent), messages, "\n\n")

    model_settings = ModelSettings(temperature=0, parallel_tool_calls=True)
    run_config = RunConfig(
        model=settings.openai_llm_name, model_settings=model_settings
    )

    async with server:
        sql_res = await Runner.run(
            starting_agent=agent, input=list(messages), run_config=run_config
        )
        ts2 = datetime.datetime.now()
        print("\n\nSQL:", ts2 - ts1, "\n\n")

        if (
            sql_res is None
            or sql_res.final_output is None
            or sql_res.final_output.sql is None
        ):
            req.status = RequestStatus.error
            req.err = "No SQL generated"
            return req

        req.structured_response.sql = sql_res.final_output.sql

        async with db_client:
            # print(f"DB client connected: {db_client.is_connected()}")

            try:
                result: list[TextContent] = await db_client.call_tool(
                    "fetch_data",
                    {
                        "request": req.structured_response.sql,
                        "db": req.db,
                        "settings": settings,
                    },
                )
                print(result)
                data = json.loads(result[0].text)
                ts3 = datetime.datetime.now()
                print(
                    "\n\nDATA:",
                    ts3 - ts2,
                    bool(data["csv"]),
                    bool(data["error"]),
                    "\n\n",
                )
                if "error" in data:
                    req.status = RequestStatus.error
                    req.err = data["error"]
                    return req

                req.structured_response.csv = data["csv"]

            except ClientError as e:
                print(f"Tool call failed: {e}")
                req.status = RequestStatus.error
                req.err = str(e)
                return req
            except ConnectionError as e:
                print(f"Connection failed: {e}")
                req.status = RequestStatus.error
                req.err = str(e)
                return req
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                req.status = RequestStatus.error
                req.err = str(e)
                return req

        return req

    return req
