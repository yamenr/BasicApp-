import "server-only";
import { Pool, type PoolClient } from "pg";

const globalForDb = globalThis as unknown as { pool?: Pool; schemaReady?: Promise<void> };

const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

// Tables are created on first use, so a fresh database needs no migration step.
const SCHEMA = `
CREATE TABLE IF NOT EXISTS students (
  email       TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  class_name  TEXT NOT NULL DEFAULT '',
  google_name TEXT,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attempts (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  answer      TEXT NOT NULL,
  correct     BOOLEAN NOT NULL,
  points      INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attempts_email_idx ON attempts (email);

CREATE TABLE IF NOT EXISTS exercise_scores (
  email         TEXT NOT NULL,
  exercise_id   TEXT NOT NULL,
  attempts      INTEGER NOT NULL DEFAULT 0,
  solved        BOOLEAN NOT NULL DEFAULT false,
  revealed      BOOLEAN NOT NULL DEFAULT false,
  first_points  INTEGER NOT NULL DEFAULT 0,
  best_points   INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (email, exercise_id)
);
`;

function ensureSchema() {
  globalForDb.schemaReady ??= pool.query(SCHEMA).then(
    () => undefined,
    (err) => {
      globalForDb.schemaReady = undefined;
      throw err;
    },
  );
  return globalForDb.schemaReady;
}

export async function query<T extends object = Record<string, unknown>>(text: string, params: unknown[] = []) {
  await ensureSchema();
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>) {
  await ensureSchema();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
