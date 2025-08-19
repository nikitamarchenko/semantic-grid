"""additional Request statuses

Revision ID: 93ba5726f5d3
Revises: a7fc3f59da32
Create Date: 2025-07-11 10:23:24.171215

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "93ba5726f5d3"
down_revision: Union[str, None] = "a7fc3f59da32"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'Cancelled';")
    op.execute("ALTER TYPE request_status_type ADD VALUE IF NOT EXISTS 'Scheduled';")


def downgrade() -> None:
    pass
