import "server-only";

import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export const postgresConfigured = Boolean(process.env.DATABASE_URL);

export function getPostgresPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}
