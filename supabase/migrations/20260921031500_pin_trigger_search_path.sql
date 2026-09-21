-- Pin the trigger function's search_path so it cannot resolve names through a
-- caller-controlled path. now() lives in pg_catalog, which stays implicit.
alter function public.set_updated_at() set search_path = '';
