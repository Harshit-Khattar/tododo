-- Nightly sweep: anything still merely planned but due today or tomorrow has
-- stopped being a plan, so it moves to Urgent. Ongoing and Completed are the
-- owner's explicit calls and are left alone.

create schema if not exists private;
revoke all on schema private from anon, authenticated;

create or replace function private.promote_due_tasks()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  -- The board owner's wall clock. The server runs in UTC, where "today" flips
  -- mid-evening local time and would sweep a day early.
  local_today date := (now() at time zone 'America/New_York')::date;
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

-- pg_cron evaluates schedules in GMT (cron.timezone), so 05:00 UTC is the only
-- hour that lands after local midnight in both EST (00:00) and EDT (01:00).
-- Scheduling by name is an upsert, so re-running this is safe.
select cron.schedule(
  'promote-due-tasks',
  '0 5 * * *',
  $job$select private.promote_due_tasks()$job$
);
