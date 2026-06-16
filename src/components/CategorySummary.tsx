"use client";

import { formatCurrency } from "@/lib/format";
import type { Summary } from "@/lib/types";

interface CategorySummaryProps {
  summary?: Summary;
  isLoading: boolean;
}

export function CategorySummary({ summary, isLoading }: CategorySummaryProps) {
  if (isLoading) {
    return (
      <div className="h-28 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50" />
    );
  }

  const hasData = summary && summary.byCategory.length > 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total spent</h2>
        <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
          {formatCurrency(summary?.grandTotalCents ?? 0)}
        </p>
      </div>

      {hasData ? (
        <ul className="mt-4 space-y-2">
          {summary.byCategory.map((row) => {
            const pct =
              summary.grandTotalCents > 0
                ? Math.round((row.totalCents / summary.grandTotalCents) * 100)
                : 0;
            return (
              <li key={row.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {row.category}{" "}
                    <span className="text-zinc-400">({row.count})</span>
                  </span>
                  <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(row.totalCents)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Category totals will appear here once you add expenses.
        </p>
      )}
    </section>
  );
}
