#!/usr/bin/env bash
watchmedo auto-restart --directory=./fm_app/workers/ --pattern="*.py" \
-- celery -A fm_app.workers.worker worker --loglevel=INFO # 2>&1 | \
# awk '{if($0 ~ /^\{.*\}$/) print $0}' | \
# tee logs/celery.log
