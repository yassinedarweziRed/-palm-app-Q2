"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUSES, CONSULTANTS } from "@/lib/types";

// Filters live in the URL (?status=New&assignee=Priya) rather than React state.
// Trade-off: filtered views become shareable and bookmarkable, the back button
// works, and the server reads the same params to query Postgres — so there's a
// single source of truth and no client/server drift. The cost is a navigation
// per filter change, which is fine at this data size.
export function Filters({
  status,
  assignee,
}: {
  status: string;
  assignee: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "All") next.delete(key);
    else next.set(key, value);
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[#183028]">Status</span>
        <select
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none hover:border-neutral-400"
        >
          <option value="All">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[#183028]">Consultant</span>
        <select
          value={assignee}
          onChange={(e) => setParam("assignee", e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none hover:border-neutral-400"
        >
          <option value="All">All</option>
          {CONSULTANTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {(status !== "All" || assignee !== "All") && (
        <button
          onClick={() => router.push("/")}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}