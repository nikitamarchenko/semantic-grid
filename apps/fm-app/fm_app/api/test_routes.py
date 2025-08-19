import asyncio

import httpx
import pytest


@pytest.mark.asyncio
async def test_get_unknown_resource():
    url = "http://127.0.0.1:8080/api/v1/get_ref"
    headers = {"Content-Type": "application/json"}
    data = {"user_request": "hello world"}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, headers=headers)

        assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_unauthorized():
    url = "http://127.0.0.1:8080/api/v1/session"
    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

        assert response.status_code == 403


asyncio.run(test_get_unknown_resource())
asyncio.run(test_get_unauthorized())
