"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { STATUSES, CONSULTANTS, type Status } from "@/lib/types";

// Server Actions take only an id plus the single value being changed, never a
// whole row from the client. We validate the value against our known list before
// it touches the DB — the action is a public POST endpoint, so its input is
// treated as untrusted even though there's no login in this version.

export async function updateStatus(id: number, status: string) {
  if (!STATUSES.includes(status as Status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // revalidatePath re-renders the list in the same request, so the consultant
  // sees the new status immediately without a manual refresh.
  revalidatePath("/");
}

export async function updateAssignee(id: number, assigned_to: string) {
  if (!CONSULTANTS.includes(assigned_to as (typeof CONSULTANTS)[number])) {
    throw new Error(`Invalid consultant: ${assigned_to}`);
  }

  const { error } = await supabase
    .from("enquiries")
    .update({ assigned_to })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}