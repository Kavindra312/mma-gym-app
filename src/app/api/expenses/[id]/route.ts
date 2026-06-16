import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { expenseInputSchema, toCents } from "@/lib/validation";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * PUT /api/expenses/:id
 * Replace an expense. 200 on success, 400 invalid body, 404 if not found.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

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
  const [updated] = await db
    .update(expenses)
    .set({ description, amountCents: toCents(amount), category, date })
    .where(eq(expenses.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

/**
 * DELETE /api/expenses/:id
 * Remove an expense. 204 on success, 404 if not found.
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const [deleted] = await db.delete(expenses).where(eq(expenses.id, id)).returning();

  if (!deleted) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
