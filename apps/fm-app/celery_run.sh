#!/usr/bin/env sh
celery -A fm_app.workers.worker worker --loglevel=INFO
