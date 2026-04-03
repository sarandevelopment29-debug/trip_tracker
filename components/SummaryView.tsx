import { TripSummary } from "@/lib/calculations";

export default function SummaryView({ summary }: { summary: TripSummary }) {
  return (
    <div className="p-0">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-orange-50 p-3 text-center sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-black">Upfront</p>
          <p className="mt-1 text-lg font-semibold text-black sm:text-xl">
            Rs {summary.totalUpfront.toFixed(2)}
          </p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-3 text-center sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-black">Expense</p>
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
      </div>

      <div className="rounded-3xl bg-orange-50 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-black sm:text-xl">Setlements</h2>

        {summary.settlements.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-black sm:text-base">
            Add friends to view settlements.
          </div>
        ) : (
          <ul className="space-y-3">
            {summary.settlements.map((s) => (
              <li
                key={s.memberId}
                className="rounded-2xl bg-white p-3 sm:p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black sm:text-base">{s.name}</p>
                    <p className="text-xs text-black sm:text-sm">Paid: Rs {s.upfrontPaid.toFixed(2)}</p>
                  </div>

                  <div className="text-sm font-semibold sm:text-base">
                    {s.finalBalance > 0.01 ? (
                      <span className="text-black">Gets: Rs {s.finalBalance.toFixed(2)}</span>
                    ) : s.finalBalance < -0.01 ? (
                      <span className="text-black">Pays: Rs {Math.abs(s.finalBalance).toFixed(2)}</span>
                    ) : (
                      <span className="text-black">Settled</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
