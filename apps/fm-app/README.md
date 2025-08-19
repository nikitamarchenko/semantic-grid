# Flow Manager

A centerpiece for ApeGPT framework, Flow Manager orchestrates the request, processing and response workflow.

Flow Manager consists of the following components:

- API server, which provides a RESTful interface for submitting user requests and sending responses;
- Workflow orchestrator based on Celery, which manages the execution of tasks in the workflow;
- Operational Database, which stores the state of the workflow and the results of tasks;

## DB scripts

- Run dev db

```shell
docker compose up -d
```

- Stop DB

 ```shell
docker compose down
```

- Stop DB and DELETE

 ```shell
docker compose down -v
```

- Run migrations

```shell
alembic upgrade head
```

## Alembic upgrade schema

```shell
alembic revision -m "Description"
```

## Python scripts

UV package manager is used to manage dependencies.
https://docs.astral.sh/uv/

### Install UV

- Linux / MacOS

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- Windows

```shell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Save dependencies

```shell
uv lock
```

### Load dependencies

```shell
uv sync --locked
```

## Lint and format code

```
uv run ruff check . --fix
```

## Docker

### Build image

```shell
docker buildx build --platform linux/amd64 -t $REPO"fm_app:"$VERSION .
````

### Push image to repo

```shell
docker push $REPO"fm_app:"$VERSION
```

### Apply deployment to k8s (cloud)

```shell
kubectl apply -k k8s/overlays/cloud -n prod
```

### Apply deployment to k8s (local)

```shell
kubectl apply -k k8s/overlays/local -n prod
```

### Local run in minikube

```shell
kubectl -n postgres port-forward svc/postgres 15432:5432
kubectl -n prod port-forward svc/flow-manager-rq 31672:5672
sudo minikube tunnel
```
