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
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "Unknown";

  const handleDelete = async (expenseId: string) => {
    if (deletingId) return;
    setDeletingId(expenseId);
    try {
      await fetch(`/api/expenses/${expenseId}`, { method: "DELETE" });
      setConfirmDeleteId(null);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    expenseId: string,
  ) => {
    e.preventDefault();
    if (savingId) return;
    setSavingId(expenseId);
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const amount = Number(formData.get("amount"));
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const paidBy = formData.get("paidBy") as string;

    try {
      await fetch(`/api/expenses/${expenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, category, date, paidBy }),
      });

      setEditingId(null);
      onRefresh();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-orange-50 p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-black sm:text-xl">Expenses</h2>

      {expenses.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-black sm:text-base">
          No expenses logged yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="relative rounded-2xl bg-white p-3 sm:p-4"
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
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500 sm:col-span-2"
                  />
                  <input
                    required
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    defaultValue={Number(expense.amount)}
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
                  />
                  <select
                    required
                    name="category"
                    defaultValue={expense.category}
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
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
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
                  />
                  <select
                    required
                    name="paidBy"
                    defaultValue={expense.paidBy}
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
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
                      disabled={savingId === expense.id}
                      className="rounded-full border border-orange-500 bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={savingId === expense.id}
                      onClick={() => setEditingId(null)}
                      className="rounded-full border border-orange-300 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pr-24">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-black sm:text-base">
                      {expense.title}
                    </h3>
                    <p className="mt-1 text-xs text-black sm:text-sm">
                      {new Date(expense.date).toLocaleDateString()} | Paid by {getMemberName(expense.paidBy)}
                    </p>
                    <span className="mt-2 inline-block text-sm font-semibold text-black sm:text-base">
                      Rs {Number(expense.amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={Boolean(deletingId) || Boolean(savingId)}
                      onClick={() => setEditingId(expense.id)}
                      aria-label="Edit expense"
                      title="Edit"
                      className="inline-flex h-10 w-10 min-h-10 min-w-10 aspect-square items-center justify-center rounded-full bg-transparent p-0 text-orange-500 transition hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(deletingId) || Boolean(savingId)}
                      onClick={() => setConfirmDeleteId(expense.id)}
                      aria-label="Delete expense"
                      title="Delete"
                      className="inline-flex h-10 w-10 min-h-10 min-w-10 aspect-square items-center justify-center rounded-full bg-transparent p-0 text-orange-500 transition hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>

                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl">
            <p className="text-2xl font-semibold text-black">Confirm delete</p>
            <p className="mt-2 text-sm text-black">Are you sure you want to delete this expense?</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                disabled={Boolean(deletingId)}
                className="rounded-full bg-orange-100 px-5 py-2.5 text-base font-semibold text-black transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={Boolean(deletingId)}
                className="rounded-full bg-orange-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
