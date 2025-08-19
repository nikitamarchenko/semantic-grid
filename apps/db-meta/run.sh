#!/usr/bin/env sh
# uvicorn dbmeta_app:app --host 0.0.0.0 --port 8080 --workers "${WORKERS:-4}" --root-path "$ROOT_PATH"
uv run dbmeta_app/main.py