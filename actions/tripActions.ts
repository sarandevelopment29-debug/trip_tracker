"use server";

import { revalidatePath } from "next/cache";
import { createTrip, deleteTrip } from "@/lib/queries";
import { redirect } from "next/navigation";

export async function createNewTrip(formData: FormData) {
  const name = formData.get("name") as string;
  const totalDays = Number(formData.get("totalDays"));
  
  if (!name || isNaN(totalDays) || totalDays <= 0) return;

  const tripId = await createTrip(name, totalDays);
  revalidatePath("/");
  redirect(`/trip/${tripId}`);
}

export async function removeTrip(tripId: string) {
  await deleteTrip(tripId);
  revalidatePath("/");
}
