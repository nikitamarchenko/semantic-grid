"""Add parent column to session table

Revision ID: 91e125b36fe1
Revises: fcafb13134ea
Create Date: 2025-06-13 09:31:50.368060

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "91e125b36fe1"
down_revision: Union[str, None] = "fcafb13134ea"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("session", sa.Column("parent", sa.UUID, nullable=True))


def downgrade() -> None:
    op.drop_column("session", "parent")
