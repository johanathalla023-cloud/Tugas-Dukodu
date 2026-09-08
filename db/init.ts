import { isUsingDatabase, closePool } from "../lib/pg";
import { ensureDatabaseReady } from "../lib/db";

async function main() {
  if (!isUsingDatabase()) {
    console.log(
      "DATABASE_URL belum diatur — lewati inisialisasi (skema & seed akan dibuat otomatis saat runtime)."
    );
    return;
  }

  console.log("✓ Menyiapkan skema & seed (hanya jika kosong)...");
  await ensureDatabaseReady();
  console.log("✓ Skema & seed selesai.");
  await closePool();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(
      "Perhatian: db:setup gagal di build (akan dicoba ulang otomatis saat runtime):",
      err?.message ?? err
    );
    process.exit(0);
  });