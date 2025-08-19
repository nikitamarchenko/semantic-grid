"""add Refs column to Session table

Revision ID: a7fc3f59da32
Revises: 91e125b36fe1
Create Date: 2025-06-25 11:10:20.108265

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a7fc3f59da32"
down_revision: Union[str, None] = "91e125b36fe1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "session", sa.Column("refs", sa.dialects.postgresql.JSONB, nullable=True)
    )


def downgrade() -> None:
    op.drop_column("session", "refs")
