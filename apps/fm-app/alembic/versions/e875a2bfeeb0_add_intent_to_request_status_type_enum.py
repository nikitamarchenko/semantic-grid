"""Add Intent to request_status_type enum

Revision ID: e875a2bfeeb0
Revises: 87c828ab9dee
Create Date: 2025-03-23 15:23:40.538441

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e875a2bfeeb0"
down_revision: Union[str, None] = "87c828ab9dee"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'Intent';")
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'SQL';")
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'DataFetch';")
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'Retry';")
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'Finalizing';")


def downgrade() -> None:
    pass
