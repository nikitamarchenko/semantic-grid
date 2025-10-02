
FROM python:3.13-bookworm AS builder

ARG PROJECT_DIR=apps/db-meta
# Copy uv from uv image
COPY --from=ghcr.io/astral-sh/uv:0.8.22 /uv /uvx /bin/

# UV settings https://docs.astral.sh/uv/reference/settings/#link-mode
# UV_LINK_MODE=copy Copy packages from the wheel into the site-packages directory
# UV_COMPILE_BYTECODE If set, uv will compile Python source files to bytecode after installation.
# UV_PYTHON_DOWNLOADS Whether uv should allow Python downloads.
# UV_NO_DEV If set, uv will exclude development dependencies.
ENV UV_LINK_MODE=copy \
 UV_COMPILE_BYTECODE=0 \
 UV_PYTHON_DOWNLOADS=1 \
 UV_MANAGED_PYTHON=1 \
 UV_NO_DEV=1 \
 UV_PYTHON_INSTALL_DIR=/usr/lib/uv-python


# Change the working directory to the `app` directory
WORKDIR /app

# Install dependencies with uv cache
RUN --mount=type=cache,target=/root/.cache/uv \
 --mount=type=bind,source=${PROJECT_DIR}/uv.lock,target=uv.lock \
 --mount=type=bind,source=${PROJECT_DIR}/pyproject.toml,target=pyproject.toml \
 uv sync --frozen --no-install-project

# Copy the project into the image
COPY ${PROJECT_DIR}/pyproject.toml ${PROJECT_DIR}/uv.lock /app/
COPY ${PROJECT_DIR}/dbmeta_app /app/dbmeta_app

# Sync the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

FROM gcr.io/distroless/python3-debian12:nonroot

# Copy uv managed python
COPY --from=builder --chown=root:root /usr/lib/uv-python /usr/lib/uv-python

COPY --from=builder --chown=nonroot:nonroot /app /app

ENV PACKS_RESOURCES_DIR=/app/packages
COPY --chown=nonroot:nonroot ${PROJECT_DIR}/packages/resources/ /app/packages/resources/
COPY --chown=nonroot:nonroot ${PROJECT_DIR}/packages/client-configs/ /app/packages/client-configs/

EXPOSE 8080

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

USER nonroot

ENTRYPOINT ["db-meta"]
