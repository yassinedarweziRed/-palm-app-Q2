"use client";

import { useTransition } from "react";
import { updateStatus } from "./actions";
import { STATUSES } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  Contacted: "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-neutral-200 text-neutral-600 border-neutral-300",
};

// A plain <select> that fires the Server Action on change. useTransition gives
// us a cheap "saving…" state (dimmed + disabled) without a form or client state
// library — the list re-renders itself once revalidatePath runs on the server.
export function StatusSelect({
  id,
  value,
}: {
  id: number;
  value: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => updateStatus(id, next));
      }}
      className={`rounded-full border px-3 py-1 text-sm font-medium outline-none transition ${
        STATUS_STYLES[value] ?? "bg-neutral-100 text-neutral-700"
      } ${isPending ? "opacity-50" : "cursor-pointer"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}