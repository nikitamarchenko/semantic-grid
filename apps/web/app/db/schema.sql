-- 01_dashboards.sql
create table dashboards (
                            id            uuid primary key default gen_random_uuid(),
                            name          text not null,
                            slug          text not null unique,
                            description   text,
                            created_at    timestamptz not null default now(),
                            updated_at    timestamptz not null default now()
);

create table queries (
                         id            uuid primary key default gen_random_uuid(),
    -- reference to your “actual query object” in your query registry
                         query_uid     uuid not null unique,
                         description   text,
                         created_at    timestamptz not null default now(),
                         updated_at    timestamptz not null default now()
);

create type dashboard_item_type as enum ('chart','table','both');

create table dashboard_items (
                                 id            uuid primary key default gen_random_uuid(),
                                 name          text,
                                 description   text,
                                 dashboard_id  uuid not null references dashboards(id) on delete cascade,
                                 query_id      uuid not null references queries(id) on delete cascade,
                                 item_type     dashboard_item_type not null,
                                 chart_type    text, -- e.g. 'bar','line','pie'
                                 position      int not null default 0, -- for ordering on a dashboard grid
                                 created_at    timestamptz not null default now(),
                                 updated_at    timestamptz not null default now(),
                                 unique (dashboard_id, query_id) -- prevents dup attachments of same query
);

-- Keep updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
return new;
end$$;

create trigger trg_dashboards_updated
    before update on dashboards
    for each row execute procedure set_updated_at();

create trigger trg_queries_updated
    before update on queries
    for each row execute procedure set_updated_at();

create trigger trg_dashboard_items_updated
    before update on dashboard_items
    for each row execute procedure set_updated_at();