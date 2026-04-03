import Link from "next/link";

type TripCardData = {
  id: string;
  name: string;
  friendsCount: number;
  quotePerPerson: number;
};

const cardColors = [
  "bg-orange-50 border-orange-200",
  "bg-orange-100 border-orange-200",
  "bg-amber-50 border-amber-200",
  "bg-orange-50 border-amber-200",
  "bg-amber-100 border-amber-200",
];

export default function TripCard({
  trip,
  onEdit,
  colorSeed,
}: {
  trip: TripCardData;
  onEdit?: (e: React.MouseEvent) => void;
  colorSeed?: number;
}) {
  const generatedSeed =
    typeof colorSeed === "number"
      ? colorSeed
      : trip.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const colorIndex = generatedSeed % cardColors.length;

  return (
    <div
      className={`group relative h-full rounded-3xl border p-4 transition hover:border-orange-300 sm:p-5 ${cardColors[colorIndex]}`}
    >
      <Link href={`/trip/${trip.id}`} className="block h-full pr-10">
        <h3 className="line-clamp-2 text-lg font-semibold text-black sm:text-xl">
          {trip.name}
        </h3>
        <p className="mt-2 text-sm text-black">
          Friends: {trip.friendsCount} | Quote: Rs {trip.quotePerPerson.toFixed(2)}
        </p>
      </Link>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-3 top-3 inline-flex h-10 w-10 min-h-10 min-w-10 aspect-square items-center justify-center rounded-full bg-transparent p-0 text-orange-500 transition hover:text-orange-600"
          aria-label={`Edit ${trip.name}`}
          title="Edit trip"
        >
          <svg
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
      )}
    </div>
  );
}
