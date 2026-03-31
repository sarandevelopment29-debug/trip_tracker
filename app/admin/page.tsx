"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Trip = {
  id: string;
  name: string;
  totalDays: number;
  quotePerPerson: number;
};

export default function AdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/trips");
      if (res.ok) {
        setTrips(await res.json());
      }
      setLoading(false);
    };
    void load();
  }, []);

  const handleDeleteTrip = async (tripId: string) => {
    await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin</h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Delete trips from this page only.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <p className="text-sm text-slate-600 sm:text-base">Loading trips...</p>
          ) : trips.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 sm:text-base">
              No trips available.
            </div>
          ) : (
            <ul className="space-y-3">
              {trips.map((trip) => (
                <li
                  key={trip.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 sm:text-base">
                        {trip.name}
                      </p>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        {trip.totalDays} days | Quote per person: Rs {Number(trip.quotePerPerson || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/trip/${trip.id}`}
                        className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
