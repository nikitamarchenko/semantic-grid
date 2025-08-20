import pathlib

from dbmeta_app.api.model import PromptItem, PromptItemType
from dbmeta_app.config import get_settings
from dbmeta_app.prompt_assembler.prompt_packs import assemble_effective_tree, load_yaml


def get_sql_dialect_item(profile: str) -> PromptItem:
    settings = get_settings()
    repo_root = pathlib.Path(__file__).parent.parent.parent.parent.parent.resolve()
    client = settings.client
    env = settings.env
    tree = assemble_effective_tree(repo_root, profile, client, env)

    instructions = load_yaml(tree, "resources/sql_dialect.yaml")["profiles"][profile]

    # Format into a human-readable LLM prompt
    llm_prompt = "\n\n### SQL dialect instructions:\n" + "\n".join(
        f"- {instruction}" for instruction in instructions
    )

    return PromptItem(
        text=llm_prompt,
        prompt_item_type=PromptItemType.instruction,
        score=100_000,
    )
