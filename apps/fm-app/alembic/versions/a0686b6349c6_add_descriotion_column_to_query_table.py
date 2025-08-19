"""Add Descriotion column to  Query table

Revision ID: a0686b6349c6
Revises: e806b209d0e9
Create Date: 2025-08-08 18:10:27.017463

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a0686b6349c6"
down_revision: Union[str, None] = "e806b209d0e9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("query", sa.Column("description", sa.String, nullable=True))


def downgrade() -> None:
    op.drop_column("query", "description")
