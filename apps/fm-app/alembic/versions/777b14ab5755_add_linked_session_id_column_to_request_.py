"""Add linked_session_id column to Request table

Revision ID: 777b14ab5755
Revises: 93ba5726f5d3
Create Date: 2025-07-21 14:19:42.072135

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "777b14ab5755"
down_revision: Union[str, None] = "93ba5726f5d3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("request", sa.Column("linked_session_id", sa.UUID, nullable=True))


def downgrade() -> None:
    op.drop_column("request", "linked_session_id")
