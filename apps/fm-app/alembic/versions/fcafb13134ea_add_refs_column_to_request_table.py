"""Add refs column to request table

Revision ID: fcafb13134ea
Revises: 2612f8ff58cf
Create Date: 2025-06-07 20:57:12.920314

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fcafb13134ea"
down_revision: Union[str, None] = "2612f8ff58cf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "request", sa.Column("refs", sa.dialects.postgresql.JSONB, nullable=True)
    )


def downgrade() -> None:
    op.drop_column("request", "refs")
