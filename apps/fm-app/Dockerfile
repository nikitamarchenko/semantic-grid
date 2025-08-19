FROM python:3.12-slim-bookworm

# install gcc for zstd
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl gcc g++ build-essential ca-certificates clang \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Download the latest installer
ADD https://astral.sh/uv/0.6.16/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

# Change the working directory to the `app` directory
WORKDIR /app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

# Copy the project into the image
ADD . /app

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Activate venv for later steps
ENV PATH="/app/.venv/bin:$PATH"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8080
# CMD ["./run.sh"]
