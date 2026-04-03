"use client";

import { useState } from "react";
import { Member } from "@/lib/calculations";

export default function MemberList({
  tripId,
  members,
  quotePerPerson,
  onRefresh,
}: {
  tripId: string;
  members: Member[];
  quotePerPerson: number;
  onRefresh: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAdding) return;
    setIsAdding(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    try {
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, name }),
      });

      form.reset();
      setShowAddForm(false);
      onRefresh();
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, memberId: string) => {
    e.preventDefault();
    if (savingId) return;
    setSavingId(memberId);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const amount = Number(formData.get("amount"));

    try {
      await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount }),
      });

      setEditingId(null);
      onRefresh();
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (deletingId) return;
    setDeletingId(memberId);
    try {
      await fetch(`/api/members/${memberId}`, { method: "DELETE" });
      setConfirmDeleteId(null);
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-orange-50 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black sm:text-xl">Friends</h2>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Add Friend
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-5 flex flex-col gap-2 sm:flex-row">
          <input
            required
            type="text"
            name="name"
            placeholder="Friend name"
            className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            Save
          </button>
          <button
            type="button"
            disabled={isAdding}
            onClick={() => setShowAddForm(false)}
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            Cancel
          </button>
        </form>
      )}

      {members.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-black sm:text-base">
          No friends added yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => {
            const upfront = Number(member.upfrontPaid || 0);
            const pending = Math.max(quotePerPerson - upfront, 0);
            const showPending = pending > 0;

            return (
              <li key={member.id} className="relative rounded-2xl bg-white p-4 sm:p-5">
                {editingId === member.id ? (
                  <form
                    onSubmit={(e) => handleEdit(e, member.id)}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    <input
                      required
                      type="text"
                      name="name"
                      defaultValue={member.name}
                      className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500 sm:col-span-2"
                    />
                    <input
                      required
                      type="number"
                      name="amount"
                      defaultValue={upfront}
                      min="0"
                      step="0.01"
                      className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={savingId === member.id}
                        className="rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={savingId === member.id}
                        onClick={() => setEditingId(null)}
                        className="rounded-full bg-orange-100 px-3 py-2 text-xs font-semibold text-black transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-black">{member.name}</p>
                        <p className="text-xs font-medium text-black">
                          {upfront > 0 ? "Contributed" : "Awaiting upfront"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={Boolean(savingId) || Boolean(deletingId)}
                          onClick={() => setEditingId(member.id)}
                          className="inline-flex h-10 w-10 min-h-10 min-w-10 aspect-square items-center justify-center rounded-full bg-transparent p-0 text-orange-500 transition hover:text-orange-600"
                          aria-label={`Edit ${member.name}`}
                          title="Edit"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          disabled={Boolean(savingId) || Boolean(deletingId)}
                          onClick={() => setConfirmDeleteId(member.id)}
                          className="inline-flex h-10 w-10 min-h-10 min-w-10 aspect-square items-center justify-center rounded-full bg-transparent p-0 text-orange-500 transition hover:text-orange-600"
                          aria-label={`Delete ${member.name}`}
                          title="Delete friend"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className={`mt-3 grid w-full gap-2 ${showPending ? "grid-cols-2" : "grid-cols-1"}`}>
                      <div className="w-full rounded-2xl bg-orange-50 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-black">Upfront</p>
                        <p className="mt-0.5 text-sm font-semibold text-black">Rs {upfront.toFixed(2)}</p>
                      </div>
                      {showPending && (
                        <div className="w-full rounded-2xl bg-orange-100 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-black">Pending</p>
                          <p className="mt-0.5 text-sm font-semibold text-black">Rs {pending.toFixed(2)}</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl">
            <p className="text-2xl font-semibold text-black">Confirm delete</p>
            <p className="mt-2 text-sm text-black">Are you sure you want to delete this friend?</p>
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
