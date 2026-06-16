import type { ExpenseFormValues } from "./types";

/** A failed API call, carrying the HTTP status and a human-readable message. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** SWR fetcher: GET a URL and parse JSON, throwing ApiError on non-2xx. */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? "Request failed");
  }
  return res.json();
}

/** Convert form values into the JSON payload the API expects. */
function toPayload(values: ExpenseFormValues) {
  return {
    description: values.description,
    amount: values.amount,
    category: values.category,
    date: values.date,
  };
}

export async function createExpense(values: ExpenseFormValues) {
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toPayload(values)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? "Could not create expense");
  }
  return res.json();
}

export async function updateExpense(id: number, values: ExpenseFormValues) {
  const res = await fetch(`/api/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toPayload(values)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? "Could not update expense");
  }
  return res.json();
}

export async function deleteExpense(id: number) {
  const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? "Could not delete expense");
  }
}
