import { savePackages, saveCustomers, saveBills, saveTickets, saveCoverageAreas, saveContents, saveAdminUsers } from "./db";
import * as seedData from "./seedData";

async function seedAll() {
  const { SEED_PACKAGES, SEED_AREAS, SEED_CONTENTS, SEED_ADMINS } = seedData;

  await savePackages(SEED_PACKAGES);
  await saveCustomers([]);
  await saveBills([]);
  await saveTickets([]);
  await saveCoverageAreas(SEED_AREAS);
  await saveContents(SEED_CONTENTS);
  await saveAdminUsers(SEED_ADMINS);

  console.log("✓ Seed data initialized:");
  console.log(`  - ${SEED_PACKAGES.length} packages`);
  console.log(`  - 0 customers (kosong — pelanggan daftar mandiri)`);
  console.log(`  - 0 bills`);
  console.log(`  - 0 tickets`);
  console.log(`  - ${SEED_AREAS.length} coverage areas`);
  console.log(`  - ${SEED_CONTENTS.length} content items`);
  console.log(`  - ${SEED_ADMINS.length} admin users`);
}

seedAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Gagal men-seed data:", err);
    process.exit(1);
  });