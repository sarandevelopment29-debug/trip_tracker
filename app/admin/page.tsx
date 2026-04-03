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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (deletingId) return;
    setDeletingId(tripId);
    try {
      await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-3">
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
          <h1 className="text-2xl font-bold text-black sm:text-3xl">Admin</h1>
          <p className="text-sm text-black sm:text-base">
            Manage and clean up trips from one place.
          </p>
        </header>

        <section className="rounded-3xl bg-orange-50 p-4 sm:p-6">
          {loading ? (
            <p className="text-sm text-black sm:text-base">Loading trips...</p>
          ) : trips.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-black sm:text-base">
              No trips available.
            </div>
          ) : (
            <ul className="space-y-3">
              {trips.map((trip) => (
                <li
                  key={trip.id}
                  className="rounded-2xl bg-white p-3 sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black sm:text-base">
                        {trip.name}
                      </p>
                      <p className="text-xs text-black sm:text-sm">
                        Quote per person: Rs {Number(trip.quotePerPerson || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/trip/${trip.id}`}
                        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full bg-transparent text-orange-500 transition hover:text-orange-600"
                        aria-label={`Open ${trip.name}`}
                        title="Open"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M14 3h7v7" />
                          <path d="M10 14 21 3" />
                          <path d="M21 14v7h-7" />
                          <path d="M3 10V3h7" />
                          <path d="m3 3 7 7" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        disabled={Boolean(deletingId)}
                        onClick={() => setConfirmDeleteId(trip.id)}
                        className="inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full bg-transparent text-orange-500 transition hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${trip.name}`}
                        title="Delete"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
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
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl">
            <p className="text-2xl font-semibold text-black">Confirm delete</p>
            <p className="mt-2 text-sm text-black">Are you sure you want to delete this trip?</p>
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
                onClick={() => handleDeleteTrip(confirmDeleteId)}
                disabled={Boolean(deletingId)}
                className="rounded-full bg-orange-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
