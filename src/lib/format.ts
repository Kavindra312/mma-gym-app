/** Format integer cents as a localized currency string, e.g. 1250 -> "$12.50". */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
