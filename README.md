# Marlow & Finch — Enquiry Portal

A lightweight internal portal where consultants work the enquiries produced by the intake automation. They see incoming enquiries, filter to the ones that matter to them, assign an owner, and move each one along, without ever touching the automation.

**Live:** _add Vercel link here_

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase / Postgres
- Deployed on Vercel

## What it does

- Lists every enquiry, newest first.
- Filters by **status** and **assigned consultant** (filters live in the URL, so a filtered view is shareable and the back button works).
- Change an enquiry's **status** or **assigned consultant** from a dropdown on the row. The change saves and the list updates immediately.

## How it's wired

- The page is a Server Component that reads the filters from the URL and queries Postgres directly (filtering in the DB, not in the browser).
- Status/assignee changes go through **Server Actions** using the Supabase **service-role key**, which stays server-side only. It's an internal tool behind a shared link, so this was simpler than the anon key + Row Level Security: one place to reason about access, no policies to maintain.
- After a write, `revalidatePath('/')` re-renders the list in the same request so the consultant sees the change with no manual refresh.

Trade-offs are called out in comments in `src/lib/supabase.ts`, `src/lib/types.ts`, `src/app/actions.ts`, and `src/app/Filters.tsx`.

## Left out vs. kept

**Left out: authentication.** There's no login. It's an internal tool for a small, non-technical team behind a shared link, and adding auth first would have slowed the handoff without changing what consultants do day to day. Identity (who's "me") is a dropdown for now. Auth is the obvious next addition.

**Kept: the original message next to the AI summary.** Each row shows the LLM-generated summary with an "Original message" toggle holding the raw enquiry. The extraction step can misread or drop a detail, so consultants can always see exactly what the AI produced versus what the client actually said, and catch any mistake before acting on it. For a tool that turns messy inbound into records people trust, that safety check was non-negotiable.

## Run locally

```bash
npm install
# create .env.local with your Supabase URL + service-role key:
#   SUPABASE_URL=...
#   SUPABASE_SERVICE_ROLE_KEY=...
npm run dev
```

Set up the database in Supabase (SQL editor):

```
schema.sql   # creates the enquiries table
seed.sql     # inserts the three Question 1 records
```

## Deploy (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add env vars `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Vercel project settings.
3. Deploy, then drop the live URL at the top of this README.
