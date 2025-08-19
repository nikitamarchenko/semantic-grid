"""Rename context col to metadata

Revision ID: 2612f8ff58cf
Revises: e7cf6ece9116
Create Date: 2025-06-07 14:50:01.590177

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "2612f8ff58cf"
down_revision: Union[str, None] = "e7cf6ece9116"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("session", "context", new_column_name="metadata")


def downgrade() -> None:
    op.alter_column("session", "metadata", new_column_name="context")
