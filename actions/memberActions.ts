"use server";

import { revalidatePath } from "next/cache";
import { addMember, updateContribution } from "@/lib/queries";

export async function addNewMember(tripId: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await addMember(tripId, name);
  revalidatePath(`/trip/${tripId}`);
}

export async function editContribution(tripId: string, memberId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  if (isNaN(amount) || amount < 0) return;
  await updateContribution(tripId, memberId, amount);
  revalidatePath(`/trip/${tripId}`);
}
