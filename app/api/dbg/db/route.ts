import { NextResponse } from "next/server";
import { Pool } from "pg";
import { ensureDatabaseReady } from "@/lib/db";
import { query as appQuery } from "@/lib/pg";

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

async function runChecks(connString: string) {
  let info: Record<string, unknown> = { url: firstBits(connString) };
  try {
    info.host = new URL(connString).hostname || null;
  } catch {
    info.host = null;
  }
  let pool: Pool | null = null;
  const start = Date.now();
  try {
    pool = new Pool({
      connectionString: connString,
      connectionTimeoutMillis: 8000,
      max: 1,
      ssl: { rejectUnauthorized: false },
    });
    const client = await pool.connect();
    try {
      info.plain = await client.query("SELECT 1 AS ok").then((r) => r.rows[0]?.ok === 1);
      try {
        const r = await client.query("SELECT $1::int AS ok", [1]);
        info.param = r.rows[0]?.ok === 1;
      } catch (e) {
        info.param = false;
        info.paramError = (e as { message?: string }).message?.slice(0, 200) ?? "param fail";
      }
      try {
        const r = await client.query("SELECT 1 AS a; SELECT 2 AS b");
        info.multiStmt = r.rows.length > 0;
      } catch (e) {
        info.multiStmt = false;
        info.multiError = (e as { message?: string }).message?.slice(0, 200) ?? "multi fail";
      }
    } finally {
      client.release();
    }
    info.ok = true;
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    info.ok = false;
    info.errorCode = e?.code ?? null;
    info.error = String(e?.message ?? err).slice(0, 300);
  } finally {
    info.ms = Date.now() - start;
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
      DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
      POSTGRES_URL: !!postgresUrl,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      POSTGRES_POOL_URL: !!process.env.POSTGRES_POOL_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      usedByApp: databaseUrl ? "DATABASE_URL" : postgresUrl ? "POSTGRES_URL" : "none (mode JSON)",
    },
    probes: {
      ...(postgresUrl ? { POSTGRES_URL: await runChecks(postgresUrl) } : {}),
      ...(databaseUrl ? { DATABASE_URL: await runChecks(databaseUrl) } : {}),
    },
    appInit: await (async () => {
      const out: Record<string, unknown> = { started: true };
      try {
        await ensureDatabaseReady();
        out.status = "ok";
        try {
          const tables = await appQuery<{ table_name: string }>(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
          );
          out.tables = tables.map((t) => t.table_name);
          const pkg = await appQuery<{ c: number }>(`SELECT COUNT(*)::int AS c FROM "packages"`);
          out.packageRows = pkg[0]?.c ?? -1;
        } catch (e) {
          out.listError = `${(e as { message?: string }).message ?? e}`.slice(0, 300);
        }
      } catch (e) {
        out.status = "error";
        out.errorCode = (e as { code?: string }).code ?? null;
        out.message = `${(e as { message?: string }).message ?? e}`.slice(0, 500);
      }
      return out;
    })(),
  });
}