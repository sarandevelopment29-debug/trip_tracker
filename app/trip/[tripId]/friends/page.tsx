"use client";

import { useCallback, useEffect, useState, use } from "react";
import { Member } from "@/lib/calculations";
import { notFound } from "next/navigation";
import Link from "next/link";
import MemberList from "@/components/MemberList";
import TripPageTabs from "@/components/TripPageTabs";

export default function TripFriendsPage({
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
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [tripRes, membersRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`),
        fetch(`/api/members?tripId=${tripId}`),
      ]);

      if (!tripRes.ok) return notFound();

      setTrip(await tripRes.json());
      setMembers(await membersRes.json());
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
        Loading friends...
      </div>
    );
  }

  if (!trip) return notFound();

  const quotePerPerson = Number(trip.quotePerPerson || 0);

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
              {trip.name} | Friends
            </h1>
            <p className="text-sm text-slate-600 sm:text-base">
              Manage members and upfront contributions.
            </p>
          </div>

          <TripPageTabs tripId={tripId} />
        </header>

        <MemberList
          tripId={tripId}
          members={members}
          quotePerPerson={quotePerPerson}
          onRefresh={fetchAllData}
        />
      </div>
    </main>
  );
}
