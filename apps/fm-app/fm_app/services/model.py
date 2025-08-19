from typing import Any, Dict

from pydantic import BaseModel, RootModel


class DbColumn(BaseModel):
    name: str
    type: str
    description: str | None = None
    example: str | None = None


class DbTable(BaseModel):
    columns: dict[str, DbColumn]
    description: str | None = None


class DbSchema(RootModel[Dict[str, DbTable]]):
    pass


class PreflightResult(BaseModel):
    explanation: list[dict[str, Any]] | None = None
    error: str | None = None


class QueryExample(BaseModel):
    request: str
    response: str
    score: float


class DbPipelineStep(BaseModel):
    stage: str
    db: str
    sql: str
