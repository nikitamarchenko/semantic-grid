"""Add rating and revision fields to Response schema

Revision ID: 87c828ab9dee
Revises: a3b38266a4dc
Create Date: 2024-12-12 11:27:16.156120

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "87c828ab9dee"
down_revision: Union[str, None] = "a3b38266a4dc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE request ADD COLUMN rating int;
        ALTER TABLE request ADD COLUMN review text;
        ALTER TABLE request ADD COLUMN sql text;
    """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE request DROP COLUMN rating int;
        ALTER TABLE request DROP COLUMN review text;
        ALTER TABLE request DROP COLUMN sql text;
    """
    )
