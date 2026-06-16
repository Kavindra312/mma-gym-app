/**
 * The fixed set of expense categories.
 *
 * Kept as a single source of truth so validation, the API, and the UI all
 * agree on what counts as a valid category.
 */
export const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
