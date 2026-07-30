-- Marlow & Finch enquiry portal — Postgres schema (Supabase).
-- The intake automation (Question 1) writes rows here; the portal reads and
-- updates them.

create table if not exists public.enquiries (
  id            bigint generated always as identity primary key,
  enquiry_type  text,                                  -- vacancy | admin_request | other
  job_title     text,
  location      text,
  contract_type text,
  summary       text,
  source        text,                                  -- inbox | webform
  raw_text      text,                                  -- original enquiry, kept for reference
  received_at   timestamptz default now(),
  -- status is plain text (not an enum) so the team can add workflow stages
  -- without a migration. The app constrains it to a known list on write.
  status        text not null default 'New',
  assigned_to   text default 'Unassigned'
);

-- The two things consultants filter on, indexed so filtered views stay fast
-- as the table grows.
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_assigned_to_idx on public.enquiries (assigned_to);