"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripCard from "@/components/TripCard";

type Trip = {
  id: string;
  name: string;
  totalDays: number;
  quotePerPerson: number;
  friendsCount: number;
  totalUpfront: number;
  totalExpenses: number;
};

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isSavingTripEdit, setIsSavingTripEdit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/trips");
      if (!res.ok) return;
      const baseTrips = (await res.json()) as Array<{
        id: string;
        name: string;
        totalDays: number;
        quotePerPerson: number;
      }>;

      const tripsWithStats = await Promise.all(
        baseTrips.map(async (trip) => {
          const [membersRes, expensesRes] = await Promise.all([
            fetch(`/api/members?tripId=${trip.id}`),
            fetch(`/api/expenses?tripId=${trip.id}`),
          ]);

          const members = membersRes.ok
            ? ((await membersRes.json()) as Array<{ upfrontPaid?: number }>)
            : [];
          const expenses = expensesRes.ok
            ? ((await expensesRes.json()) as Array<{ amount?: number }>)
            : [];

          const totalUpfront = members.reduce((sum, m) => sum + Number(m.upfrontPaid || 0), 0);
          const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

          return {
            ...trip,
            friendsCount: members.length,
            totalUpfront,
            totalExpenses,
          };
        }),
      );

      setTrips(tripsWithStats);
    };
    void load();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCreatingTrip) return;
    setIsCreatingTrip(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const totalDays = 1;
    const quotePerPerson = Number(formData.get("quotePerPerson"));

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, totalDays, quotePerPerson }),
      });

      if (res.ok) {
        const newTrip = await res.json();
        router.push(`/trip/${newTrip.id}`);
      }
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const handleEditTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrip || isSavingTripEdit) return;
    setIsSavingTripEdit(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const quotePerPerson = Number(formData.get("quotePerPerson"));

    try {
      const res = await fetch(`/api/trips/${editingTrip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quotePerPerson }),
      });

      if (res.ok) {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === editingTrip.id ? { ...trip, name, quotePerPerson } : trip,
          ),
        );
        setEditingTrip(null);
      }
    } finally {
      setIsSavingTripEdit(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-black sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Trip Tracker
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
            Plan, split, and settle with your group
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-black sm:text-base">
            Create a trip, add friends, track expenses, and view settlements in one place.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-black sm:text-2xl">Your Trips</h2>
            {!showCreateForm && (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:text-base"
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
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Create Trip
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                colorSeed={index}
                onEdit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditingTrip(trip);
                }}
              />
            ))}
            {trips.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-orange-300 bg-orange-50 p-8 text-center text-black">
                <p className="text-sm font-medium sm:text-base">
                  No trips yet. Create your first trip to get started.
                </p>
              </div>
            )}
          </div>
          {showCreateForm && (
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 gap-3 rounded-3xl border border-orange-200 bg-orange-50 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_180px_auto_auto] lg:items-end"
            >
              <label className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Trip Name
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Summer in Tokyo"
                  className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Quote Per Person
                </span>
                <input
                  required
                  type="number"
                  name="quotePerPerson"
                  placeholder="3000"
                  min="0"
                  className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-orange-500 sm:text-base"
                />
              </label>

              <button
                type="submit"
                disabled={isCreatingTrip}
                className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                Save Trip
              </button>

              <button
                type="button"
                disabled={isCreatingTrip}
                onClick={() => setShowCreateForm(false)}
                className="rounded-full border border-orange-300 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                Cancel
              </button>
            </form>
          )}
        </section>
      </div>

      {editingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <h3 className="text-2xl font-semibold text-black">Edit Trip</h3>
            <form onSubmit={handleEditTrip} className="mt-4 space-y-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Trip Name
                </span>
                <input
                  required
                  name="name"
                  defaultValue={editingTrip.name}
                  className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-orange-500 sm:text-base"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Quote Per Person
                </span>
                <input
                  required
                  type="number"
                  name="quotePerPerson"
                  min="0"
                  defaultValue={editingTrip.quotePerPerson}
                  className="w-full rounded-2xl border border-orange-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-orange-500 sm:text-base"
                />
              </label>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  disabled={isSavingTripEdit}
                  onClick={() => setEditingTrip(null)}
                  className="rounded-full bg-orange-100 px-5 py-2.5 text-base font-semibold text-black transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTripEdit}
                  className="rounded-full bg-orange-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
