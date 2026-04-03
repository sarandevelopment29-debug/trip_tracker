"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Expense", segment: "" },
  { label: "Friends", segment: "/friends" },
  { label: "Setlements", segment: "/settlement" },
];

export default function TripPageTabs({ tripId }: { tripId: string }) {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-3 gap-2 sm:gap-3">
      {tabs.map((tab) => {
        const href = `/trip/${tripId}${tab.segment}`;
        const isActive = pathname === href;

        return (
          <Link
            key={tab.label}
            href={href}
            className={`flex min-h-[48px] items-center justify-center rounded-full px-2 py-2.5 text-center text-sm font-semibold leading-tight transition sm:px-3 sm:py-2.5 ${
              isActive
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-orange-50 text-black hover:bg-orange-100"
            }`}
          >
            <span className="block max-w-full whitespace-normal break-words">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
