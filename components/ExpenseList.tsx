"use client";

import { useState } from "react";
import { Expense, Member } from "@/lib/calculations";

export default function ExpenseList({
  expenses,
  members,
  onRefresh,
}: {
  tripId: string;
  expenses: Expense[];
  members: Member[];
  onRefresh: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "Unknown";

  const handleDelete = async (expenseId: string) => {
    await fetch(`/api/expenses/${expenseId}`, { method: "DELETE" });
    onRefresh();
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    expenseId: string,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const paidBy = formData.get("paidBy") as string;

    await fetch(`/api/expenses/${expenseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category, date, paidBy }),
    });

    setEditingId(null);
    onRefresh();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">Expenses</h2>

      {expenses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 sm:text-base">
          No expenses logged yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
            >
              {editingId === expense.id ? (
                <form
                  onSubmit={(e) => handleEdit(e, expense.id)}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  <input
                    required
                    name="title"
                    defaultValue={expense.title}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 sm:col-span-2"
                  />
                  <input
                    required
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    defaultValue={Number(expense.amount)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                  <select
                    required
                    name="category"
                    defaultValue={expense.category}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Activities">Activities</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    required
                    type="date"
                    name="date"
                    defaultValue={expense.date?.slice(0, 10)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                  <select
                    required
                    name="paidBy"
                    defaultValue={expense.paidBy}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                      {expense.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      {new Date(expense.date).toLocaleDateString()} | Paid by {getMemberName(expense.paidBy)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">
                      Rs {Number(expense.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setEditingId(expense.id)}
                      className="rounded-lg border border-slate-900 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="rounded-lg border border-slate-900 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
