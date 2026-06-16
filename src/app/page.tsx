"use client";

import { useState } from "react";
import useSWR from "swr";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CategorySummary } from "@/components/CategorySummary";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ApiError, createExpense, fetcher } from "@/lib/api";
import type { Category } from "@/lib/categories";
import type { Expense, ExpenseFormValues, Summary } from "@/lib/types";

export default function Home() {
  const [filter, setFilter] = useState<Category | "all">("all");

  const listKey =
    filter === "all" ? "/api/expenses" : `/api/expenses?category=${encodeURIComponent(filter)}`;

  const {
    data: expenses,
    error: listError,
    isLoading: listLoading,
    mutate: mutateList,
  } = useSWR<Expense[]>(listKey, fetcher);

  const { data: summary, isLoading: summaryLoading, mutate: mutateSummary } =
    useSWR<Summary>("/api/expenses/summary", fetcher);

  // Refresh both the list and the totals after any mutation.
  function refresh() {
    mutateList();
    mutateSummary();
  }

  async function handleCreate(values: ExpenseFormValues) {
    await createExpense(values);
    refresh();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Expense Tracker
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Log what you spend and see where your money goes.
        </p>
      </header>

      <div className="space-y-8">
        <CategorySummary summary={summary} isLoading={summaryLoading} />

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Add an expense
          </h2>
          <ExpenseForm submitLabel="Add expense" onSubmit={handleCreate} />
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Expenses</h2>
            <CategoryFilter value={filter} onChange={setFilter} />
          </div>
          <ExpenseList
            expenses={expenses ?? []}
            isLoading={listLoading}
            error={listError instanceof ApiError ? listError.message : undefined}
            filtered={filter !== "all"}
            onChanged={refresh}
          />
        </section>
      </div>
    </main>
  );
}
