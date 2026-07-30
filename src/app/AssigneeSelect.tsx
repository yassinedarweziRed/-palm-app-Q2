"use client";

import { useTransition } from "react";
import { updateAssignee } from "./actions";
import { CONSULTANTS } from "@/lib/types";

export function AssigneeSelect({
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
        startTransition(() => updateAssignee(id, next));
      }}
      className={`rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-800 outline-none transition ${
        isPending ? "opacity-50" : "cursor-pointer hover:border-neutral-400"
      }`}
    >
      {CONSULTANTS.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}