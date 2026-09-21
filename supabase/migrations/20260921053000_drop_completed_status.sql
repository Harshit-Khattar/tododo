-- Completed is gone: finished work gets deleted rather than parked in a lane.
-- Postgres cannot drop a value from an enum in place, so the type is rebuilt.
-- Verified empty before writing this; the USING cast would fail loudly rather
-- than silently drop rows if any remained.

alter type public.task_status rename to task_status_deprecated;

create type public.task_status as enum ('urgent', 'planned', 'ongoing');

alter table public.tasks
  alter column status drop default,
  alter column status type public.task_status using status::text::public.task_status,
  alter column status set default 'planned';

drop type public.task_status_deprecated;
