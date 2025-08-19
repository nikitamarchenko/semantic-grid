from enum import Enum

from pydantic import BaseModel


class PromptItemType(str, Enum):
    db_struct = "DBStruct"
    data_sample = "DataSample"
    query_example = "QueryExample"
    instruction = "Instruction"
    data_description = "DataDescription"


class GetPromptModel(BaseModel):
    user_request: str
    db: str | None = None


class TestSqlModel(BaseModel):
    sql: str
    db: str | None = None


class GetSchemaModel(BaseModel):
    db: str | None = None


class PromptItem(BaseModel):
    text: str
    prompt_item_type: PromptItemType
    score: int


class PromptsSetModel(BaseModel):
    prompt_items: list[PromptItem]
    source: str
