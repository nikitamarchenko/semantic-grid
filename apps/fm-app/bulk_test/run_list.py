import argparse
import csv
import io
import os
import sys
import time
from datetime import datetime
from typing import Optional

import requests
import structlog
from dotenv import load_dotenv

# import pandas as pd

logger = structlog.get_logger()
load_dotenv()

APP_URL = os.getenv("APP_URL")
ATTEMPT_NUM = 100
ATTEMPT_TIME_OUT_SEC = 5


def get_auth_header():
    auth_url = os.getenv("AUTH_URL")
    body = {
        "client_id": os.getenv("CLIENT_ID"),
        "client_secret": os.getenv("CLIENT_SECRET"),
        "audience": os.getenv("AUDIENCE"),
        "grant_type": os.getenv("GRANT_TYPE"),
    }
    resp = requests.post(url=auth_url, json=body)
    return resp.json()


def create_session():
    datetime_now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    create_session = {"name": f"{datetime_now}-test", "tags": "testrun"}
    resp = requests.post(
        url=f"{APP_URL}session", json=create_session, headers=AUTH_HEADER
    )
    response = resp.json()
    session_id = response.get("session_id")
    return session_id


def run_query(
    request: str,
    flow: Optional[str] = "OpenAISimple",
    model: Optional[str] = None,
    db: Optional[str] = None,
):
    if not db:
        if "NWH" in flow:
            db = "NWH"
        elif "V2" in flow:
            db = "V2"
        else:
            db = ""
    if not model:
        if "OpenAI" in flow:
            model = "OpenAI"
        elif "Gemini" in flow:
            model = "Gemini"
        elif "Deepseek" in flow:
            model = "Deepseek"
        elif "Anthropic" in flow:
            model = "Anthropic"
        else:
            raise Exception("Unknown model")
    flow = flow.replace(model, "").replace(db, "")

    req = {
        "request": request,
        "flow": flow,
        "model": model,
        "db": db,
    }
    response = requests.post(
        url=f"{APP_URL}request/{SESSION_ID}", json=req, headers=AUTH_HEADER
    )
    seq_number = response.json().get("sequence_number")
    for _ in range(ATTEMPT_NUM):
        time.sleep(ATTEMPT_TIME_OUT_SEC)
        response = requests.get(
            url=f"{APP_URL}request/{SESSION_ID}/{seq_number}", headers=AUTH_HEADER
        ).json()
        if response.get("status"):
            if response.get("status") == "Error" or response.get("status") == "Done":
                return response
        else:
            raise Exception("Null response from the service")
    return None


def get_data(csv_file: str):
    reader = csv.DictReader(io.StringIO(csv_file))
    csv_data = list(reader)
    # print(csv_data)
    # csv_headers = csv_data[0] if len(csv_data) > 0 else []
    # csv_rows = csv_data[1:][0] if len(csv_data) > 1 else []
    # return csv_headers, csv_rows
    return csv_data


#  FlowType:
#   "OpenAISimple" |
#   "OpenAISimpleNWH" |
#   "OpenAISimpleV2" |
#   "GeminiSimple" |
#   "GeminiSimpleNWH" |
#   "GeminiSimpleV2" |
#   "DeepseekSimple" |
#   "DeepseekSimpleNWH" |
#   "DeepseekSimpleV2" |
#   "OpenAIMultisteps" |
#   "GeminiMultistep" |
#   "DeepseekMultistep";
#


def values_match(expected_val, actual_val):
    try:
        # Try numeric comparison on whole parts
        return int(float(expected_val)) == int(float(actual_val))
    except (ValueError, TypeError):
        # Fallback to exact match if not both are numeric
        return expected_val == actual_val


def main():
    logger.info("Starting service test")
    parser = argparse.ArgumentParser("python run_list.py")
    parser.add_argument("--src", type=str, default="master_list.csv")
    parser.add_argument("--out", type=str, default="/dev/null")
    parser.add_argument("--flow", type=str, default="OpenAISimple")
    args = parser.parse_args()

    file_name = args.src
    header = get_auth_header()
    header = header.get("access_token")
    global AUTH_HEADER
    AUTH_HEADER = {"authorization": f"Bearer {header}"}

    global SESSION_ID
    SESSION_ID = create_session()
    logger.info("Created test session %s" % SESSION_ID)

    start = 0
    failures = 0
    successes = 0

    with open(file_name, mode="r", encoding="utf-8") as f:
        start_time = time.time()
        lines = f.readlines()
        lines_num = len(lines)
        i = start + 1
        for line in lines[start:]:
            line = line.strip()
            if line == "":
                i += 1
                continue
            if line.startswith("# "):
                logger.info(
                    f"Section: {line[1:].strip()}",
                )
                i += 1
                continue
            elif line.startswith("#"):
                i += 1
                continue

            parts = line.split("|")
            expected = [""]
            if len(parts) == 0:
                break
            if len(parts) == 1:
                flow = args.flow
                query = parts[0].strip()
            else:
                flow = parts[0].strip()
                query = parts[1].strip()
                expected = parts[2].strip().split(",") if len(parts) > 2 else [""]

            if flow == "Skip":
                i += 1
                continue

            ts0 = time.time()
            res = run_query(query, flow=flow)
            ts1 = time.time()

            if res is None:
                logger.info(
                    f"Finished {i}/{lines_num} in {ts1-ts0:.2f}s with {flow} (Timeout)"
                )
                failures += 1
            elif res.get("status") == "Done":
                result = get_data(res.get("csv", ""))
                expected_result = (
                    result if len(result) < 2 else f"array of {len(result)}"
                )
                exists = any(
                    any(values_match(e, v) for v in d.values())
                    for e in expected
                    for d in result
                )
                maybe_expected = f", expected: {expected}" if expected[0] != "" else ""
                status = (
                    "OK" if exists else f"Failed {expected_result}: {maybe_expected}"
                )
                logger.info(
                    f"Finished {i}/{lines_num} in {ts1-ts0:.2f}s with {flow} ({status})"
                )
                if not exists:
                    failures += 1
                else:
                    successes += 1
            else:
                logger.info(
                    f"Finished {i}/{lines_num} in {ts1-ts0:.2f}s with {flow} (Error: {res.get('err')})"
                )
                failures += 1

            i += 1

    if failures > 0 and failures / (failures + successes) > 0.1:
        logger.error(
            f"Regression test ended with {failures} failed cases in {time.time()-start_time:.2f}s."
        )
        sys.exit(1)  # <-- important! Fail CI
    else:
        logger.info(f"All regression tests passed in {time.time()-start_time:.2f}s")
        sys.exit(0)


if __name__ == "__main__":
    main()
