import { createClient } from "@supabase/supabase-js";

// Trade-off: this is an INTERNAL tool behind a shared link, so we talk to
// Supabase with the service-role key from server-only code (Server Components
// and Server Actions) instead of the anon key + Row Level Security in the
// browser. It means one place to reason about access and no RLS policies to
// maintain, at the cost of the DB being wide open to anything running server-side.
// The service-role key must never be exposed to the client — note there is no
// NEXT_PUBLIC_ prefix, so Next.js keeps it out of the browser bundle.
const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env.local and fill them in."
  );
}

export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});