import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

/**
 * SQLite connection + Drizzle client.
 *
 * The instance is cached on `globalThis` so Next.js dev hot-reloads reuse a
 * single connection instead of opening a new file handle on every change.
 *
 * To move to Postgres later, swap this file for the `drizzle-orm/postgres-js`
 * (or `node-postgres`) driver — the schema and queries stay the same.
 */
const DB_FILE = process.env.DATABASE_URL ?? "expenses.db";

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
};

const sqlite = globalForDb.sqlite ?? new Database(DB_FILE);
sqlite.pragma("journal_mode = WAL");

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
