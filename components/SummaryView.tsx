import { TripSummary } from "@/lib/calculations";

export default function SummaryView({ summary }: { summary: TripSummary }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">Settlement</h2>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-sky-900 bg-sky-900 p-3 text-center sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">Total Upfront</p>
          <p className="mt-1 text-sm font-semibold text-white sm:text-base">
            Rs {summary.totalUpfront.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-violet-900 bg-violet-900 p-3 text-center sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">Total Expense</p>
          <p className="mt-1 text-sm font-semibold text-white sm:text-base">
            Rs {summary.totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-900 bg-slate-900 p-3 text-center sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">Available Balance</p>
          <p className="mt-1 text-sm font-semibold text-white sm:text-base">
            Rs {summary.availableBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {summary.settlements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 sm:text-base">
          Add friends to view settlements.
        </div>
      ) : (
        <ul className="space-y-3">
          {summary.settlements.map((s) => (
            <li
              key={s.memberId}
              className={`rounded-xl border p-3 sm:p-4 ${
                s.finalBalance > 0.01
                  ? "border-sky-300 bg-sky-100"
                  : s.finalBalance < -0.01
                    ? "border-rose-300 bg-rose-100"
                    : "border-slate-300 bg-slate-100"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">{s.name}</p>
                  <p className="text-xs text-slate-600 sm:text-sm">Paid: Rs {s.upfrontPaid.toFixed(2)}</p>
                </div>

                <div className="text-sm font-semibold sm:text-base">
                  {s.finalBalance > 0.01 ? (
                    <span className="text-sky-700">Gets: Rs {s.finalBalance.toFixed(2)}</span>
                  ) : s.finalBalance < -0.01 ? (
                    <span className="text-rose-700">Pays: Rs {Math.abs(s.finalBalance).toFixed(2)}</span>
                  ) : (
                    <span className="text-slate-700">Settled</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
