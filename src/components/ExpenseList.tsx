"use client";

import { ExpenseItem } from "@/components/ExpenseItem";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  error?: string;
  filtered: boolean;
  onChanged: () => void;
}

function Skeleton() {
  return (
    <ul className="space-y-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-[68px] animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50"
        />
      ))}
    </ul>
  );
}

export function ExpenseList({
  expenses,
  isLoading,
  error,
  filtered,
  onChanged,
}: ExpenseListProps) {
  if (isLoading) return <Skeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {filtered ? "No expenses in this category" : "No expenses yet"}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {filtered
            ? "Try a different filter, or add a new expense."
            : "Add your first expense using the form above."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onChanged={onChanged} />
      ))}
    </ul>
  );
}
