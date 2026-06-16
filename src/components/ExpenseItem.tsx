"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { updateExpense, deleteExpense } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Expense, ExpenseFormValues } from "@/lib/types";

interface ExpenseItemProps {
  expense: Expense;
  onChanged: () => void;
}

const categoryColors: Record<string, string> = {
  Food: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Transport: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Housing: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Utilities: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  Health: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export function ExpenseItem({ expense, onChanged }: ExpenseItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(values: ExpenseFormValues) {
    await updateExpense(expense.id, values);
    setEditing(false);
    onChanged();
  }

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteExpense(expense.id);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900 dark:bg-zinc-900">
        <ExpenseForm
          submitLabel="Save changes"
          initialValues={{
            description: expense.description,
            amount: (expense.amountCents / 100).toFixed(2),
            category: expense.category,
            date: expense.date,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
          {expense.description}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              categoryColors[expense.category] ?? categoryColors.Other
            }`}
          >
            {expense.category}
          </span>
          <span>{expense.date}</span>
        </div>
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {formatCurrency(expense.amountCents)}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-60 dark:text-red-400"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
