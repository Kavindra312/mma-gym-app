import { sql, sum } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";

/**
 * GET /api/expenses/summary
 * Totals grouped by category plus a grand total — the bit of logic that lifts
 * this above plain CRUD. Amounts are in integer cents.
 */
export async function GET() {
  const rows = await db
    .select({
      category: expenses.category,
      totalCents: sum(expenses.amountCents).mapWith(Number),
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(expenses)
    .groupBy(expenses.category);

  const byCategory = rows
    .map((row) => ({
      category: row.category,
      totalCents: row.totalCents ?? 0,
      count: row.count,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);

  const grandTotalCents = byCategory.reduce((sum, row) => sum + row.totalCents, 0);

  return NextResponse.json({ byCategory, grandTotalCents });
}
