"use server";

import { revalidatePath } from "next/cache";
import { addExpense, deleteExpense } from "@/lib/queries";

export async function addNewExpense(tripId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));
  const category = formData.get("category") as string;
  const day = Number(formData.get("day"));
  const paidBy = formData.get("paidBy") as string;

  if (!title || isNaN(amount) || !category || isNaN(day) || !paidBy) return;

  await addExpense(tripId, { title, amount, category, day, paidBy });
  revalidatePath(`/trip/${tripId}`);
}

export async function removeExpense(tripId: string, expenseId: string) {
  await deleteExpense(tripId, expenseId);
  revalidatePath(`/trip/${tripId}`);
}
