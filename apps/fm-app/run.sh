#!/usr/bin/env sh
alembic upgrade head
uvicorn fm_app:app --host 0.0.0.0 --port 8080 --workers 4 --root-path "$ROOT_PATH"
