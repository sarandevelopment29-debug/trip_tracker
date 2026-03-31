"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripCard from "@/components/TripCard";

type Trip = {
  id: string;
  name: string;
  totalDays: number;
  quotePerPerson: number;
};

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/trips");
      if (res.ok) setTrips(await res.json());
    };
    void load();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const totalDays = Number(formData.get("totalDays"));
    const quotePerPerson = Number(formData.get("quotePerPerson"));

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, totalDays, quotePerPerson }),
    });

    if (res.ok) {
      const newTrip = await res.json();
      router.push(`/trip/${newTrip.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
        <header className="space-y-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trip Planner
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Plan, split and settle with your group
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:mx-0 sm:text-base">
            Create a trip, add friends, track expenses, and view settlement in one place.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Your Trips</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} colorSeed={index} />
            ))}
            {trips.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                <p className="text-sm font-medium sm:text-base">
                  No trips yet. Create your first trip to get started.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {!showCreateForm ? (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto sm:text-base"
            >
              Create Trip
            </button>
          ) : (
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_140px_180px_auto_auto] lg:items-end"
            >
              <label className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Trip Name
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Summer in Tokyo"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Days
                </span>
                <input
                  required
                  type="number"
                  name="totalDays"
                  placeholder="5"
                  min="1"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Quote Per Person
                </span>
                <input
                  required
                  type="number"
                  name="quotePerPerson"
                  placeholder="3000"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 sm:text-base"
                />
              </label>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:text-base"
              >
                Save Trip
              </button>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:text-base"
              >
                Cancel
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
