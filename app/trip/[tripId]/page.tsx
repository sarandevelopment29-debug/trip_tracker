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

  const handleUpdateQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuote = Number(formData.get("quote"));

    await fetch(`/api/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotePerPerson: newQuote }),
    });

    setEditingQuote(false);
    fetchAllData();
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
      <div className="min-h-screen px-4 py-8 text-center text-sm font-medium text-slate-600 sm:text-base">
        Loading trip dashboard...
      </div>
    );
  }

  if (!trip) return notFound();

  const quotePerPerson = Number(trip.quotePerPerson || 0);
  const summary = calculateTripSummary(members, expenses, quotePerPerson);

  return (
    <main className="min-h-full bg-gradient-to-b from-slate-50 via-slate-50 to-white px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Back to all trips
          </Link>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {trip.name}
            </h1>
            <p className="text-sm text-slate-600 sm:text-base">{trip.totalDays} day trip</p>
          </div>

          <TripPageTabs tripId={tripId} />
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="rounded-xl border border-slate-900 bg-slate-900 p-3 shadow-sm sm:p-4"
            onClick={() => !editingQuote && setEditingQuote(true)}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
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
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  Save
                </button>
              </form>
            ) : (
              <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
                Rs {quotePerPerson.toFixed(2)}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-sky-900 bg-sky-900 p-3 shadow-sm sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Upfront</p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
              Rs {summary.totalUpfront.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-violet-900 bg-violet-900 p-3 shadow-sm sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">Expenses</p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
              Rs {summary.totalExpense.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-900 bg-slate-900 p-3 shadow-sm sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">Available</p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
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
