"use client";

import { useCallback, useEffect, useState, use } from "react";
import { calculateTripSummary, Member, Expense } from "@/lib/calculations";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import TripPageTabs from "@/components/TripPageTabs";

export default function TripHomePage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;

  const [trip, setTrip] = useState<{
    id: string;
    name: string;
    totalDays: number;
    quotePerPerson: number;
  } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState(false);
  const [isUpdatingQuote, setIsUpdatingQuote] = useState(false);

  const handleUpdateQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUpdatingQuote) return;
    setIsUpdatingQuote(true);
    const formData = new FormData(e.currentTarget);
    const newQuote = Number(formData.get("quote"));

    try {
      await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotePerPerson: newQuote }),
      });

      setEditingQuote(false);
      fetchAllData();
    } finally {
      setIsUpdatingQuote(false);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [tripRes, membersRes, expensesRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`),
        fetch(`/api/members?tripId=${tripId}`),
        fetch(`/api/expenses?tripId=${tripId}`),
      ]);

      if (!tripRes.ok) return notFound();

      setTrip(await tripRes.json());
      setMembers(await membersRes.json());
      setExpenses(await expensesRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 text-center text-sm font-medium text-black sm:text-base">
        Loading trip dashboard...
      </div>
    );
  }

  if (!trip) return notFound();

  const quotePerPerson = Number(trip.quotePerPerson || 0);
  const summary = calculateTripSummary(members, expenses, quotePerPerson);

  return (
    <main className="min-h-full bg-white px-4 py-6 text-black sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl">{trip.name}</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-200"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Link>
          </div>
          <p className="text-sm text-black sm:text-base">
            Manage your trip expenses with your group in one place.
          </p>

          <TripPageTabs tripId={tripId} />
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div
            className="rounded-3xl bg-orange-100 p-3 text-center sm:p-4"
            onClick={() => !editingQuote && setEditingQuote(true)}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-black">
              Quote Per Person
            </p>
            {editingQuote ? (
              <form onSubmit={handleUpdateQuote} className="mt-2 flex gap-2">
                <input
                  autoFocus
                  required
                  type="number"
                  name="quote"
                  defaultValue={quotePerPerson}
                  min="0"
                  className="w-full rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={isUpdatingQuote}
                  className="rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
              </form>
            ) : (
              <p className="mt-1 text-lg font-semibold text-black sm:text-xl">
                Rs {quotePerPerson.toFixed(2)}
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-orange-50 p-3 text-center sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black">Upfront</p>
            <p className="mt-1 text-lg font-semibold text-black sm:text-xl">
              Rs {summary.totalUpfront.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-3 text-center sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black">Expenses</p>
            <p className="mt-1 text-lg font-semibold text-black sm:text-xl">
              Rs {summary.totalExpense.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-orange-200 p-3 text-center sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black">Available</p>
            <p className="mt-1 text-lg font-semibold text-black sm:text-xl">
              Rs {summary.availableBalance.toFixed(2)}
            </p>
          </div>
        </section>

        <ExpenseForm tripId={tripId} members={members} onRefresh={fetchAllData} />
        <ExpenseList tripId={tripId} expenses={expenses} members={members} onRefresh={fetchAllData} />
      </div>
    </main>
  );
}
