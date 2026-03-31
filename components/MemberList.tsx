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

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId, name }),
    });

    form.reset();
    onRefresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, memberId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));

    await fetch(`/api/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    setEditingId(null);
    onRefresh();
  };

  const handleDelete = async (memberId: string) => {
    await fetch(`/api/members/${memberId}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">Friends</h2>

      <form onSubmit={handleAdd} className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input
          required
          type="text"
          name="name"
          placeholder="Friend name"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:text-base"
        >
          Add Friend
        </button>
      </form>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 sm:text-base">
          No friends added yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => {
            const upfront = Number(member.upfrontPaid || 0);
            const pending = Math.max(quotePerPerson - upfront, 0);

            return (
              <li
                key={member.id}
                className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
                  upfront > 0 ? "border-indigo-300 bg-indigo-100" : "border-amber-300 bg-amber-100"
                }`}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs font-medium text-slate-600">
                          {upfront > 0 ? "Contributed" : "Awaiting upfront"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-300 bg-white px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Upfront</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900">Rs {upfront.toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-300 bg-white px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pending</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900">Rs {pending.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {editingId === member.id ? (
                    <form onSubmit={(e) => handleEdit(e, member.id)} className="flex items-center gap-2">
                      <input
                        required
                        type="number"
                        name="amount"
                        defaultValue={upfront}
                        min="0"
                        step="0.01"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 sm:w-32"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                        aria-label={`Save upfront for ${member.name}`}
                        title="Save"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <path d="m20 6-11 11-5-5" />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 sm:flex-col">
                      <button
                        onClick={() => setEditingId(member.id)}
                        className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                        aria-label={`Edit upfront for ${member.name}`}
                        title="Edit upfront"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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
                        onClick={() => handleDelete(member.id)}
                        className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                        aria-label={`Delete ${member.name}`}
                        title="Delete friend"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
