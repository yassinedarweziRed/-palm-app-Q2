import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { type Enquiry } from "@/lib/types";
import { Filters } from "./Filters";
import { StatusSelect } from "./StatusSelect";
import { AssigneeSelect } from "./AssigneeSelect";

// searchParams is a promise in this Next.js version — must be awaited.
type SearchParams = Promise<{ status?: string; assignee?: string }>;

async function getEnquiries(status: string, assignee: string) {
  // Filtering happens in Postgres, not in JS: we only pull the rows that match,
  // which keeps the payload small and the list correct as the table grows.
  let query = supabase
    .from("enquiries")
    .select("*")
    .order("received_at", { ascending: false });

  if (status !== "All") query = query.eq("status", status);
  if (assignee !== "All") query = query.eq("assigned_to", assignee);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Enquiry[];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status = "All", assignee = "All" } = await searchParams;
  const enquiries = await getEnquiries(status, assignee);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[#183028]">
          Marlow &amp; Finch — Enquiries
        </h1>
        <p className="mt-1 text-neutral-500">
          Incoming enquiries from the intake automation. Filter, assign, and move
          them along.
        </p>
      </header>

      <div className="mb-6">
        <Suspense fallback={<div className="h-16" />}>
          <Filters status={status} assignee={assignee} />
        </Suspense>
      </div>

      <p className="mb-3 text-sm text-neutral-500">
        {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
      </p>

      {enquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
          No enquiries match these filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-[#faf6ec] text-xs uppercase tracking-wide text-[#183028]">
              <tr>
                <th className="px-4 py-3">Enquiry</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {enquiries.map((e) => (
                <tr key={e.id} className="align-top hover:bg-neutral-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-neutral-900">
                      {e.job_title || e.enquiry_type || "Enquiry"}
                    </div>
                    <div className="mt-1 max-w-md text-neutral-500">
                      {e.summary}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-neutral-600">
                    <div>{e.location || "—"}</div>
                    <div className="text-xs text-neutral-400">
                      {[e.contract_type, e.enquiry_type]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-neutral-600">
                    {e.source || "—"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-neutral-600">
                    {formatDate(e.received_at)}
                  </td>
                  <td className="px-4 py-4">
                    <AssigneeSelect id={e.id} value={e.assigned_to} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusSelect id={e.id} value={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}