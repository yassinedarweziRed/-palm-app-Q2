// Mirrors the `enquiries` table in Supabase (see schema.sql).
// Kept as a hand-written type rather than generated Supabase types: the schema
// is small and stable, so a codegen step would be more moving parts than it's worth.
export type Enquiry = {
  id: number;
  enquiry_type: string | null;
  job_title: string | null;
  location: string | null;
  contract_type: string | null;
  summary: string | null;
  source: string | null;
  raw_text: string | null;
  received_at: string | null;
  status: string;
  assigned_to: string;
};

// Status is a free-text column in Postgres (not an enum) so the team can add
// stages without a migration. We keep the canonical list here in one place so
// the UI stays consistent, while the DB stays flexible.
export const STATUSES = ["New", "In Progress", "Contacted", "Closed"] as const;
export type Status = (typeof STATUSES)[number];

// Consultants are a static list for this first version. In a real build this
// would come from a `consultants` table (or auth users); hard-coding it keeps
// the portal usable on day one without an admin screen to manage people.
export const CONSULTANTS = [
  "Unassigned",
  "Priya",
  "Tom R",
  "James",
  "Sarah",
] as const;