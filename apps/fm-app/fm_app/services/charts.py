from typing import Optional

import httpx


def generate_chart_code(code: str, flow_step_num: int, logger) -> Optional[str]:
    logger.info(
        "Chart code",
        flow_stage="chart_url",
        flow_step_num=flow_step_num,
        ai_response=code,
    )

    response = httpx.post(
        f"{'http://fm-app-svc:8080/api/v1'}/chart",
        headers={"Authorization": "Bearer " + "aaabbbccc"},
        json={"code": code},
        timeout=30,
    )
    if response.status_code == 200:
        chart_url = response.json().get("chart_url")
        logger.info(
            "Chart URL",
            flow_stage="chart_url",
            flow_step_num=flow_step_num,
            ai_response=chart_url,
        )
        return chart_url

    else:
        logger.error(
            "Chart generation failed",
            flow_stage="chart_generation_failed",
            flow_step_num=flow_step_num,
            ai_response=response.text,
        )
        return None


def generate_chart_html(
    rows, labels, chart_type, flow_step_num, logger
) -> Optional[str]:
    response = httpx.post(
        f"{'http://fm-app-svc:8080/api/v1'}/chart/html",
        headers={"Authorization": "Bearer " + "aaabbbccc"},
        json={"rows": rows, "labels": labels, "chart_type": chart_type},
        timeout=30,
    )
    if response.status_code == 200:
        chart_url = response.json().get("chart_url")
        logger.info(
            "Chart URL",
            flow_stage="chart_url",
            flow_step_num=flow_step_num,
            ai_response=chart_url,
        )
        return chart_url

    else:
        logger.error(
            "Chart generation failed",
            flow_stage="chart_generation_failed",
            flow_step_num=flow_step_num,
            ai_response=response.text,
        )
        return None
