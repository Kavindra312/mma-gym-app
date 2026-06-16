import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { isCategory } from "@/lib/categories";
import { expenseInputSchema, toCents } from "@/lib/validation";

/**
 * GET /api/expenses
 * List all expenses, newest first. Optional `?category=` filter.
 */
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category");

  if (category && !isCategory(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(expenses)
    .where(category ? eq(expenses.category, category) : undefined)
    .orderBy(desc(expenses.date), desc(expenses.id));

  return NextResponse.json(rows);
}

/**
 * POST /api/expenses
 * Create an expense. 201 on success, 400 on validation error.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = expenseInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { description, amount, category, date } = parsed.data;
  const [created] = await db
    .insert(expenses)
    .values({ description, amountCents: toCents(amount), category, date })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
