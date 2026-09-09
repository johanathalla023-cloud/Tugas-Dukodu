import { savePackages, saveCustomers, saveBills, saveTickets, saveCoverageAreas, saveContents, saveAdminUsers, saveFeatures, saveTestimonials, saveFaqs } from "./db";
import * as seedData from "./seedData";

async function seedAll() {
  const { SEED_PACKAGES, SEED_AREAS, SEED_CONTENTS, SEED_ADMINS, SEED_FEATURES, SEED_TESTIMONIALS, SEED_FAQS } = seedData;

  await savePackages(SEED_PACKAGES);
  await saveCustomers([]);
  await saveBills([]);
  await saveTickets([]);
  await saveCoverageAreas(SEED_AREAS);
  await saveContents(SEED_CONTENTS);
  await saveAdminUsers(SEED_ADMINS);
  await saveFeatures(SEED_FEATURES);
  await saveTestimonials(SEED_TESTIMONIALS);
  await saveFaqs(SEED_FAQS);

  console.log("✓ Seed data initialized:");
  console.log(`  - ${SEED_PACKAGES.length} packages`);
  console.log(`  - 0 customers (kosong — pelanggan daftar mandiri)`);
  console.log(`  - 0 bills`);
  console.log(`  - 0 tickets`);
  console.log(`  - ${SEED_AREAS.length} coverage areas`);
  console.log(`  - ${SEED_CONTENTS.length} content items`);
  console.log(`  - ${SEED_ADMINS.length} admin users`);
  console.log(`  - ${SEED_FEATURES.length} features`);
  console.log(`  - ${SEED_TESTIMONIALS.length} testimonials`);
  console.log(`  - ${SEED_FAQS.length} faqs`);
}

seedAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Gagal men-seed data:", err);
    process.exit(1);
  });