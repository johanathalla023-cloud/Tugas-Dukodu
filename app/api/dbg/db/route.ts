import { NextResponse } from "next/server";
import { Pool } from "pg";

function firstBits(url: string): string {
  try {
    const u = new URL(url);
    u.username = "***";
    u.password = "***";
    return u.href;
  } catch {
    const scheme = url.match(/^[a-z][a-z0-9+.-]*:\/\//)?.[0] ?? "";
    return `${scheme}***`;
  }
}

async function probe(connString: string) {
  let info: Record<string, unknown> = { url: firstBits(connString) };
  try {
    info.host = new URL(connString).hostname || null;
  } catch {
    info.host = null;
  }
  let pool: Pool | null = null;
  try {
    pool = new Pool({
      connectionString: connString,
      connectionTimeoutMillis: 8000,
      max: 1,
      ssl: { rejectUnauthorized: false },
    });
    const client = await pool.connect();
    try {
      const r = await client.query("SELECT 1 AS ok");
      info.ok = r.rows[0]?.ok === 1;
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    info.ok = false;
    info.errorCode = e?.code ?? null;
    info.error = String(e?.message ?? err).slice(0, 300);
  } finally {
    if (pool) await pool.end().catch(() => {});
  }
  return info;
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const postgresUrl = process.env.POSTGRES_URL;
  return NextResponse.json({
    env: {
      DATABASE_URL: !!databaseUrl,
      POSTGRES_URL: !!postgresUrl,
      POSTGRES_HOST: !!process.env.POSTGRES_HOST,
      POSTGRES_USER: !!process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
      POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,
      usedByApp: databaseUrl ? "DATABASE_URL" : postgresUrl ? "POSTGRES_URL" : "none (mode JSON)",
    },
    probes: {
      ...(postgresUrl ? { POSTGRES_URL: await probe(postgresUrl) } : {}),
      ...(databaseUrl ? { DATABASE_URL: await probe(databaseUrl) } : {}),
    },
  });
}