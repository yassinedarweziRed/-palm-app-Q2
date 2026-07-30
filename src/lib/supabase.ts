import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Trade-off: this is an INTERNAL tool behind a shared link, so we talk to
// Supabase with the service-role key from server-only code (Server Components
// and Server Actions) instead of the anon key + Row Level Security in the
// browser. It means one place to reason about access and no RLS policies to
// maintain, at the cost of the DB being wide open to anything running server-side.
// The service-role key must never be exposed to the client — note there is no
// NEXT_PUBLIC_ prefix, so Next.js keeps it out of the browser bundle.

// The client is created lazily on first use, not at import time. This matters
// because `next build` evaluates modules to collect page config, and we don't
// want the build to fail just because runtime secrets aren't present in the
// build environment — the check belongs at request time.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local (locally) or in your Vercel project settings."
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}

// Proxy so callers keep using `supabase.from(...)` unchanged, while the real
// client (and the env check) is only built on the first property access.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});