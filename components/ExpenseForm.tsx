"use client";

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
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6">
        <p className="text-sm text-slate-600 sm:text-base">
          Add at least one friend before logging expenses.
        </p>
      </div>
    );
  }

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const paidBy = formData.get("paidBy") as string;

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId, title, amount, category, date, paidBy }),
    });

    form.reset();
    onRefresh();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">Log Expense</h2>

      <form onSubmit={handleAddExpense} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</span>
          <input
            required
            type="text"
            name="title"
            placeholder="Dinner or stay"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</span>
          <input
            required
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
          <select
            required
            name="category"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Activities">Activities</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Paid By</span>
          <select
            required
            name="paidBy"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</span>
          <input
            required
            type="date"
            name="date"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
          />
        </label>

        <button
          type="submit"
          className="sm:col-span-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:text-base"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
