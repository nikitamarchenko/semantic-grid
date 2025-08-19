"""Additional Request columns

Revision ID: e0d7196b3f12
Revises: e875a2bfeeb0
Create Date: 2025-03-26 09:55:03.012741

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e0d7196b3f12"
down_revision: Union[str, None] = "e875a2bfeeb0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE request ADD COLUMN intent text;
        ALTER TABLE request ADD COLUMN assumptions text;
        ALTER TABLE request ADD COLUMN intro text;
        ALTER TABLE request ADD COLUMN outro text;
        ALTER TABLE request ADD COLUMN raw_data_labels jsonb;
        ALTER TABLE request ADD COLUMN raw_data_rows jsonb;
        ALTER TABLE request ADD COLUMN csv text;
        ALTER TABLE request ADD COLUMN chart text;
        ALTER TABLE request ADD COLUMN chart_url text;
    """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE request DROP COLUMN intent text;
        ALTER TABLE request DROP COLUMN assumptions text;
        ALTER TABLE request DROP COLUMN intro text;
        ALTER TABLE request DROP COLUMN outro text;
        ALTER TABLE request DROP COLUMN raw_data_labels jsonb;
        ALTER TABLE request DROP COLUMN raw_data_rows jsonb;
        ALTER TABLE request DROP COLUMN csv text;
        ALTER TABLE request DROP COLUMN chart text;
        ALTER TABLE request DROP COLUMN chart_url text;
    """
    )
