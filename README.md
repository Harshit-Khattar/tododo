# Tododo

Notion-style task board — four columns (Urgent, Planned, Ongoing, Completed) with tags,
due dates, and drag-and-drop. Vite + React + shadcn/ui on a Supabase (Postgres) backend.

## Setup

```bash
npm install
cp .env.example .env   # fill in your project URL + publishable key
npm run dev
```

## Database

Apply `supabase/migrations/` to your project:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

The migration creates a `task_status` enum, the `tasks` table, an `updated_at` trigger, and
an RLS policy granting the `anon` role full access — this is a single-tenant internal board
with no sign-in. Add auth before exposing it publicly.

The browser uses the **publishable** key (`sb_publishable_...`), which resolves to the `anon`
Postgres role. The legacy `anon` JWT still works but is deprecated by Supabase end of 2026.

The migration also adds `tasks` to the `supabase_realtime` publication, so open boards update
live. Drop that statement if you don't want the websocket — the app works without it, it just
won't reflect changes made elsewhere until a refetch.

## Scripts

| Command             | Purpose                        |
| ------------------- | ------------------------------ |
| `npm run dev`       | Dev server                     |
| `npm run build`     | Typecheck + production bundle  |
| `npm run typecheck` | Types only                     |
| `npm run lint`      | ESLint                         |

## Deploying

Static build — `npm run build` outputs `dist/`. Set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` in the host's environment (Vercel / Render / Netlify).

## Notes

Ordering uses a sparse `position` (double precision): a move writes the midpoint between its
new neighbours, so reordering is a single-row update and never re-indexes a column.
