-- pg_cron evaluates schedules in GMT and cron.timezone is postmaster-scoped, so
-- a fixed UTC hour drifts an hour every DST changeover: 05:00 UTC is midnight
-- in EST but 01:00 in EDT. Run every hour instead and act only on the one that
-- is local midnight -- correct year-round, with no DST bookkeeping.

-- Single source of truth for the board owner's wall clock.
create or replace function private.board_now()
returns timestamp
language sql
stable
set search_path = ''
as $$ select now() at time zone 'America/New_York' $$;

revoke all on function private.board_now() from public, anon, authenticated;

create or replace function private.promote_due_tasks()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  local_today date := private.board_now()::date;
  promoted integer;
begin
  update public.tasks
     set status = 'urgent'::public.task_status
   where status = 'planned'::public.task_status
     and due_date is not null
     -- <= rather than = today/tomorrow: a planned task whose date has already
     -- passed is not less urgent for having been missed.
     and due_date <= local_today + 1;

  get diagnostics promoted = row_count;
  return promoted;
end;
$$;

revoke all on function private.promote_due_tasks() from public, anon, authenticated;

-- The hour gate lives in the schedule, not the function, so the function stays
-- pure and callable on demand for testing.
select cron.schedule(
  'promote-due-tasks',
  '0 * * * *',
  $job$select private.promote_due_tasks() where extract(hour from private.board_now()) = 0$job$
);
