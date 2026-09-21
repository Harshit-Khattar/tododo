-- The scratch lane: a plain checklist that deliberately shares nothing with the
-- board. Notes have no status, never move between lanes, and are not touched by
-- the nightly sweep.

create type public.note_color as enum
  ('default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple');

create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  done        boolean not null default false,
  bold        boolean not null default false,
  color       public.note_color not null default 'default',
  position    double precision not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index notes_position_idx on public.notes (position);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

alter table public.notes enable row level security;

create policy notes_anon_all on public.notes
  for all to anon
  using (true)
  with check (true);

alter publication supabase_realtime add table public.notes;
