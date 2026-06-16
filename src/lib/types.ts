import type { Category } from "./categories";

/** Expense as returned by the API (amount in integer cents). */
export interface Expense {
  id: number;
  description: string;
  amountCents: number;
  category: Category;
  date: string;
  createdAt: number;
}

export interface CategoryTotal {
  category: Category;
  totalCents: number;
  count: number;
}

export interface Summary {
  byCategory: CategoryTotal[];
  grandTotalCents: number;
}

/** Shape of the form fields shared by create + edit. */
export interface ExpenseFormValues {
  description: string;
  amount: string;
  category: Category;
  date: string;
}
