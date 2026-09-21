-- Tododo: board of tasks bucketed by status.

create type public.task_status as enum ('urgent', 'planned', 'ongoing', 'completed');

create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (length(trim(title)) > 0),
  notes       text,
  status      public.task_status not null default 'planned',
  tags        text[] not null default '{}',
  due_date    date,
  -- Sparse ordering within a column: moves write a midpoint, never a re-index.
  position    double precision not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index tasks_status_position_idx on public.tasks (status, position);

create function public.set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Internal single-tenant board: no auth, anon key has full access to tasks only.
alter table public.tasks enable row level security;

create policy tasks_anon_all on public.tasks
  for all to anon
  using (true)
  with check (true);

-- Stream row changes to connected clients so every open board stays in sync.
alter publication supabase_realtime add table public.tasks;
