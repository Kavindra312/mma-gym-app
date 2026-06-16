import { z } from "zod";
import { CATEGORIES } from "./categories";

/**
 * Validation schema for creating/updating an expense.
 *
 * This is the single source of truth for what a valid expense payload looks
 * like — every write endpoint (POST, PUT) runs it, so the rules can never drift
 * between routes.
 */
export const expenseInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(120, "Description must be 120 characters or fewer"),
  // Amount arrives in dollars from the client; coerce so "12.50" works too.
  amount: z.coerce
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(1_000_000, "Amount is too large"),
  category: z.enum(CATEGORIES, {
    error: "Invalid category",
  }),
  // ISO calendar date, validated as a real date.
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Date is not a valid date"),
});

export type ExpenseInput = z.infer<typeof expenseInputSchema>;

/** Convert a validated dollar amount to integer cents for storage. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
