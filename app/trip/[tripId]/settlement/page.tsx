"use client";

import { useCallback, useEffect, useState, use } from "react";
import { calculateTripSummary, Member, Expense } from "@/lib/calculations";
import { notFound } from "next/navigation";
import Link from "next/link";
import SummaryView from "@/components/SummaryView";
import TripPageTabs from "@/components/TripPageTabs";

export default function TripSettlementPage({
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
        Loading settlement...
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
          <p className="text-sm text-black sm:text-base">Review final balances for your group.</p>

          <TripPageTabs tripId={tripId} />
        </header>

        <SummaryView summary={summary} />
      </div>
    </main>
  );
}
