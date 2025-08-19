"""create first tables

Revision ID: a3b38266a4dc
Revises: 
Create Date: 2024-11-06 23:22:24.524010

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a3b38266a4dc"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS session(
        id bigint generated always as identity,
        created_at timestamp with time zone not null default now(), 
        updated_at timestamp with time zone not null default now(),
        name varchar,
        tags varchar,
        user_owner varchar not null,
        session_id uuid not null unique,
        PRIMARY KEY (session_id) 
    ) ;
    
    CREATE INDEX IF NOT EXISTS idx_session_user_owner ON session(user_owner);
    CREATE INDEX IF NOT EXISTS idx_session_session_id ON session(session_id);
    CREATE INDEX IF NOT EXISTS idx_session_created_at ON session(created_at);
    
    CREATE TYPE request_status_type AS ENUM ('New',  'InProgress', 'Error', 'Done');
    
    CREATE TABLE IF NOT EXISTS request(
        id bigint generated always as identity,
        session_id uuid not null,
        request_id uuid not null unique,
        task_id varchar not null unique,
        sequence_number bigint not null,
        created_at timestamp with time zone not null default now(),
        updated_at timestamp with time zone not null default now(),
        request text,
        response text,
        status request_status_type not null,
        err varchar,
        PRIMARY KEY (request_id),
        CONSTRAINT session_fk_constraint FOREIGN KEY (session_id) REFERENCES session(session_id),
        CONSTRAINT request_unique_number_constraint UNIQUE (sequence_number, session_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_request_created_at ON request(created_at);
    CREATE INDEX IF NOT EXISTS idx_request_session_id ON request(session_id);
    CREATE INDEX IF NOT EXISTS idx_request_task_id ON request(task_id);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_request_created_at;
    DROP INDEX IF EXISTS index_request_session_id;
    DROP INDEX IF EXISTS index_request_task_id;
    
    DROP INDEX IF EXISTS idx_session_user_owner;
    DROP INDEX IF EXISTS idx_session_session_id;
    DROP INDEX IF EXISTS idx_session_created_at;
    
    DROP TABLE IF EXISTS request;
    DROP TABLE IF EXISTS session;
    
    DROP TYPE IF EXISTS request_status_type;
    DROP EXTENSION IF EXISTS "uuid-ossp";
    """
    )
