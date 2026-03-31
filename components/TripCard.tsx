import Link from "next/link";

type TripCardData = {
  id: string;
  name: string;
  totalDays: number;
};

const cardColors = [
  "bg-sky-100 border-sky-300",
  "bg-emerald-100 border-emerald-300",
  "bg-amber-100 border-amber-300",
  "bg-violet-100 border-violet-300",
  "bg-rose-100 border-rose-300",
];

export default function TripCard({
  trip,
  onDelete,
  colorSeed,
}: {
  trip: TripCardData;
  onDelete?: (e: React.MouseEvent) => void;
  colorSeed?: number;
}) {
  const generatedSeed =
    typeof colorSeed === "number"
      ? colorSeed
      : trip.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const colorIndex = generatedSeed % cardColors.length;

  return (
    <div
      className={`group relative h-full rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${cardColors[colorIndex]}`}
    >
      <Link href={`/trip/${trip.id}`} className="block h-full pr-10">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 sm:text-xl">
          {trip.name}
        </h3>
        <p className="mt-2 text-sm text-slate-700">{trip.totalDays} day trip</p>
      </Link>

      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute right-3 top-3 rounded-lg border border-slate-900 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}
