"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { ExpenseFormValues } from "@/lib/types";

interface ExpenseFormProps {
  initialValues?: ExpenseFormValues;
  submitLabel: string;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  onCancel?: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const emptyValues: ExpenseFormValues = {
  description: "",
  amount: "",
  category: "Food",
  date: todayIso(),
};

/** Lightweight client-side mirror of the server's Zod rules for instant feedback. */
function validate(values: ExpenseFormValues): string | null {
  if (!values.description.trim()) return "Description is required";
  if (values.description.trim().length > 120) return "Description is too long";
  const amount = Number(values.amount);
  if (!values.amount || Number.isNaN(amount) || amount <= 0)
    return "Amount must be greater than 0";
  if (!values.date) return "Date is required";
  return null;
}

export function ExpenseForm({ initialValues, submitLabel, onSubmit, onCancel }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ ...values, description: values.description.trim() });
      if (!initialValues) setValues(emptyValues); // reset only when adding
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";
  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 " +
    "outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 " +
    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <input
          id="description"
          type="text"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="e.g. Groceries at the market"
          maxLength={120}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className={labelClass}>
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={values.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => update("date", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => update("category", e.target.value as ExpenseFormValues["category"])}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
