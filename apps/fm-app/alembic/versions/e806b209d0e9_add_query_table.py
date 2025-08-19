"""Add Query table

Revision ID: e806b209d0e9
Revises: 777b14ab5755
Create Date: 2025-07-30 14:02:23.115808

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e806b209d0e9"
down_revision: Union[str, None] = "777b14ab5755"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
            CREATE TABLE IF NOT EXISTS query(
                id bigint generated always as identity,
                query_id uuid not null,
                created_at timestamp with time zone not null default now(),
                updated_at timestamp with time zone not null default now(),
                request text, -- The original user request text
                intent text, -- The intent of the query, if identified by AI
                summary text, -- A summary of the query
                sql text not null,
                row_count bigint, -- Number of rows returned by the query
                columns jsonb,
                ai_generated boolean not null default true,
                ai_context jsonb,
                data_source text,
                db_dialect text, -- The database dialect used for the query
                explanation jsonb, -- Explanation of the query, if available
                err varchar,
                parent_id uuid,
                PRIMARY KEY (query_id),
                CONSTRAINT parent_fk_constraint FOREIGN KEY (parent_id) REFERENCES query(query_id)
            );
            CREATE INDEX IF NOT EXISTS idx_query_query_id ON query(query_id);
                
            ALTER TABLE request ADD COLUMN IF NOT EXISTS query_id uuid; -- Link to the query table
            ALTER TABLE request ADD COLUMN IF NOT EXISTS view jsonb; -- query view metadata
            ALTER TABLE request ADD CONSTRAINT request_query_fk_constraint FOREIGN KEY (query_id) REFERENCES query(query_id);
            CREATE INDEX IF NOT EXISTS idx_request_query_id ON request(query_id);
                
        """
    )


def downgrade() -> None:
    op.execute(
        """
            ALTER TABLE request DROP CONSTRAINT IF EXISTS request_query_fk_constraint;
            ALTER TABLE request DROP COLUMN IF EXISTS view;
            ALTER TABLE request DROP COLUMN IF EXISTS query_id;
            DROP INDEX IF EXISTS idx_request_query_id;

            DROP INDEX IF EXISTS idx_query_query_id;
            DROP TABLE IF EXISTS query;
        """
    )
