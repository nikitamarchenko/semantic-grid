"""Add Context column to Session table

Revision ID: e7cf6ece9116
Revises: e0d7196b3f12
Create Date: 2025-05-27 13:31:02.294809

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e7cf6ece9116"
down_revision: Union[str, None] = "e0d7196b3f12"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE session ADD COLUMN context jsonb;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE session DROP COLUMN context jsonb;
        """
    )
