# ========= base runtime =========
FROM python:3.12-slim-bookworm AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENV=/app/.venv

# tools needed for building some deps + uv
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl gcc g++ build-essential ca-certificates clang \
 && rm -rf /var/lib/apt/lists/*

# Install uv (Python package manager)
ADD https://astral.sh/uv/0.6.16/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh
ENV PATH="/root/.cargo/bin:/root/.local/bin:/usr/local/bin:${PATH}"

WORKDIR /app

# ========= copy app & packs =========
# Copy only fm-app source first for better layer caching
COPY apps/fm-app/ /app/

# Bake system packs into image (Option A)
# Adjust the right-hand paths if your code expects a different layout.
COPY packages/ /app/packages/

# We DO NOT copy client-configs here; they’ll be mounted at runtime (Option B)

# ========= install deps =========
# If you’re using uv with pyproject.toml in fm-app, this will create .venv
# Use cache to speed up layer rebuilds
RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen
ENV PATH="/app/.venv/bin:${PATH}"

# ========= runtime env =========
# Where fm-app should look for packs; override in k8s if needed
ENV PACKS_RESOURCES_DIR=/app/packages

# Expose the service port (adjust if different)
EXPOSE 8080

# Start command (swap for your launcher)
# Example: FastAPI with uvicorn; or your existing run script
# CMD ["uv", "run", "fastapi", "run", "fm_app/main.py", "--host", "0.0.0.0", "--port", "8080"]