"use client";

import { useState } from "react";
import { Member } from "@/lib/calculations";

export default function ExpenseForm({
  tripId,
  members,
  onRefresh,
}: {
  tripId: string;
  members: Member[];
  onRefresh: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (members.length === 0) {
    return (
      <div className="rounded-3xl bg-orange-50 p-5 text-center sm:p-6">
        <p className="text-sm text-black sm:text-base">
          Add at least one friend before logging expenses.
        </p>
      </div>
    );
  }

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const paidBy = formData.get("paidBy") as string;

    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, title, amount, category, date, paidBy }),
      });

      form.reset();
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-orange-50 p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-black sm:text-xl">Log Expense</h2>

      <form onSubmit={handleAddExpense} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-black">Title</span>
          <input
            required
            type="text"
            name="title"
            placeholder="Dinner or stay"
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-black">Amount</span>
          <input
            required
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-black">Category</span>
          <select
            required
            name="category"
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Activities">Activities</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-black">Paid By</span>
          <select
            required
            name="paidBy"
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-black">Date</span>
          <input
            required
            type="date"
            name="date"
            defaultValue={today}
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
