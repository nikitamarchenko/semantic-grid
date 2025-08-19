import json
import os

from pydantic import BaseModel


class Slot(BaseModel):
    name: str
    type: str
    required: bool
    example_value: str


class SlotSchema(BaseModel):
    intent_name: str
    description: str
    slots: list[Slot]


def get_slot_schemas(_request: str) -> list[SlotSchema]:
    schemas_path = os.path.join(os.path.dirname(__file__), "slot_schemas.json")
    with open(schemas_path, "r") as f:
        schemas = json.load(f)

    # Convert JSON schema to Python dict
    schemas = json.loads(schemas)
    # validate schemas
    validated_schemas = [SlotSchema(**schema) for schema in schemas]

    return validated_schemas


def get_slot_schemas_raw(_request: str) -> list[dict]:
    schemas_path = os.path.join(os.path.dirname(__file__), "slot_schemas.json")
    with open(schemas_path, "r") as f:
        schemas = json.load(f)

    return schemas
