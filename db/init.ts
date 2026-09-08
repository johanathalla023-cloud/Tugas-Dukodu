import fs from "fs";
import path from "path";
import { query, isUsingDatabase, closePool } from "../lib/pg";
import {
  getPackages, addPackage,
  getCoverageAreas, addCoverageArea,
  getContents, addContent,
  getAdminUsers, saveAdminUsers,
} from "../lib/db";
import { SEED_PACKAGES, SEED_AREAS, SEED_CONTENTS, SEED_ADMINS } from "../lib/seedData";

async function seedIfEmpty<T>(getAll: () => Promise<T[]>, add: (row: T) => Promise<unknown>, rows: T[], label: string) {
  const existing = await getAll();
  if (existing.length > 0) {
    console.log(`  - ${label}: ${existing.length} data (dibiarkan)`);
    return;
  }
  for (const row of rows) await add(row);
  console.log(`  - ${label}: di-seed ${rows.length} data`);
}

async function main() {
  if (!isUsingDatabase()) {
    console.error("DATABASE_URL belum diatur. Jalankan dengan env DATABASE_URL terlebih dahulu.");
    console.error("Contoh: $env:DATABASE_URL=\"postgres://...\" && npm run db:setup");
    process.exit(1);
  }

  console.log("✓ Menyiapkan skema tabel...");
  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf-8");
  await query(schema);

  console.log("✓ Men-seed data awal (hanya jika tabel kosong)...");
  await seedIfEmpty(getPackages, addPackage, SEED_PACKAGES, "packages");
  await seedIfEmpty(getCoverageAreas, addCoverageArea, SEED_AREAS, "coverage_areas");
  await seedIfEmpty(getContents, addContent, SEED_CONTENTS, "contents");

  const existingAdmins = await getAdminUsers();
  if (existingAdmins.length === 0) {
    await saveAdminUsers(SEED_ADMINS);
    console.log(`  - admins: di-seed ${SEED_ADMINS.length} data`);
  } else {
    console.log(`  - admins: ${existingAdmins.length} data (dibiarkan)`);
  }

  console.log("✓ Skema & seed selesai.");
  await closePool();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("db:setup gagal:", err);
    process.exit(1);
  });