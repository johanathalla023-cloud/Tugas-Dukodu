import { Pool } from "pg";

let pool: Pool | null = null;

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export function isUsingDatabase(): boolean {
  return !!getDatabaseUrl();
}

function getPool(): Pool {
  const url = getDatabaseUrl();
  if (!url) throw new Error("DATABASE_URL belum diatur (mode Postgres memerlukan koneksi database)");
  if (!pool) {
    const host = new URL(url).hostname.toLowerCase();
    const localHost = host === "localhost" || host === "127.0.0.1" || host === "::1";
    const wantsSsl = process.env.DATABASE_SSL === "true" || /(^|&)sslmode=require/i.test(url) || !localHost;
    pool = new Pool({
      connectionString: url,
      max: 5,
      ...(wantsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
  }
  return pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}