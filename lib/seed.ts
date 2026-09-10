import { savePackages, saveCustomers, saveBills, saveTickets, saveCoverageAreas, saveContents, saveAdminUsers, saveFeatures, saveTestimonials, saveFaqs } from "./db";
import * as seedData from "./seedData";

const MAIN_CUSTOMER = {
  id: "b782ee59-c709-4be2-8385-e9f80752aac3",
  namaLengkap: "Raffi Johan",
  email: "johanathalla023@gmail.com",
  noWhatsApp: "085162731023",
  password: "johan1234",
  alamat: "0901, Tugu, Cimanggis, Kota Depok, Jawa Barat",
  provinsi: "Jawa Barat",
  kabupaten: "Kota Depok",
  kecamatan: "Cimanggis",
  kelurahan: "Tugu",
  lat: -6.357857,
  lng: 106.832739,
  paketId: "pkg-003",
  status: "active" as const,
  tanggalDaftar: "2026-09-08",
  tanggalPasang: "2026-09-08",
  noPelanggan: "DKD-00001",
  fotoKTP: "Gambar WhatsApp 2025-02-21 pukul 13.36.56_2f7409b2.jpg",
};

const CUSTOMER_DEWI = {
  id: "p-0003",
  namaLengkap: "Dewi Lestari",
  email: "dewi.lestari@gmail.com",
  noWhatsApp: "081299887766",
  password: "dewi123",
  alamat: "Jl. Raya Bogor KM 30, Susukan, Ciracas, Jakarta Timur",
  provinsi: "DKI Jakarta",
  kabupaten: "Kota Jakarta Timur",
  kecamatan: "Ciracas",
  kelurahan: "Susukan",
  lat: -6.314742,
  lng: 106.863197,
  paketId: "pkg-001",
  status: "active" as const,
  tanggalDaftar: "2026-07-02",
  tanggalPasang: "2026-07-05",
  noPelanggan: "DKD-00003",
  fotoKTP: "",
};

const CUSTOMER_BUDI = {
  id: "p-0004",
  namaLengkap: "Budi Santoso",
  email: "budi.santoso@gmail.com",
  noWhatsApp: "081298765432",
  password: "budi123",
  alamat: "Jl. Flamboyan No. 8, Tugu, Cimanggis, Kota Depok, Jawa Barat",
  provinsi: "Jawa Barat",
  kabupaten: "Kota Depok",
  kecamatan: "Cimanggis",
  kelurahan: "Tugu",
  lat: -6.359012,
  lng: 106.830512,
  paketId: "pkg-002",
  status: "active" as const,
  tanggalDaftar: "2026-08-12",
  tanggalPasang: "2026-08-15",
  noPelanggan: "DKD-00004",
  fotoKTP: "",
};

const SEED_CUSTOMERS = [MAIN_CUSTOMER, CUSTOMER_DEWI, CUSTOMER_BUDI];

const MAIN_BILLS = [
  {
    id: "bill-001-juli",
    noPelanggan: "DKD-00001",
    customerName: "Raffi Johan",
    bulan: "Juli 2026",
    tagihan: 599000,
    status: "paid" as const,
    tanggalTerbit: "2026-07-01",
    tanggalJatuhTempo: "2026-07-31",
    tanggalBayar: "2026-07-05",
    metodeBayar: "Transfer Bank",
    jumlahBayar: 599000,
  },
  {
    id: "bill-001-agustus",
    noPelanggan: "DKD-00001",
    customerName: "Raffi Johan",
    bulan: "Agustus 2026",
    tagihan: 599000,
    status: "overdue" as const,
    tanggalTerbit: "2026-08-01",
    tanggalJatuhTempo: "2026-08-31",
  },
  {
    id: "bill-001-sept",
    noPelanggan: "DKD-00001",
    customerName: "Raffi Johan",
    bulan: "September 2026",
    tagihan: 599000,
    status: "unpaid" as const,
    tanggalTerbit: "2026-09-01",
    tanggalJatuhTempo: "2026-09-30",
  },
  {
    id: "bill-003-agustus",
    noPelanggan: "DKD-00003",
    customerName: "Dewi Lestari",
    bulan: "Agustus 2026",
    tagihan: 175000,
    status: "overdue" as const,
    tanggalTerbit: "2026-08-01",
    tanggalJatuhTempo: "2026-08-31",
  },
  {
    id: "bill-003-sept",
    noPelanggan: "DKD-00003",
    customerName: "Dewi Lestari",
    bulan: "September 2026",
    tagihan: 175000,
    status: "unpaid" as const,
    tanggalTerbit: "2026-09-01",
    tanggalJatuhTempo: "2026-09-30",
  },
  {
    id: "bill-004-agustus",
    noPelanggan: "DKD-00004",
    customerName: "Budi Santoso",
    bulan: "Agustus 2026",
    tagihan: 199000,
    status: "overdue" as const,
    tanggalTerbit: "2026-08-01",
    tanggalJatuhTempo: "2026-08-31",
  },
  {
    id: "bill-004-sept",
    noPelanggan: "DKD-00004",
    customerName: "Budi Santoso",
    bulan: "September 2026",
    tagihan: 199000,
    status: "unpaid" as const,
    tanggalTerbit: "2026-09-01",
    tanggalJatuhTempo: "2026-09-30",
  },
];

async function seedAll() {
  const { SEED_PACKAGES, SEED_AREAS, SEED_CONTENTS, SEED_ADMINS, SEED_FEATURES, SEED_TESTIMONIALS, SEED_FAQS } = seedData;

  await savePackages(SEED_PACKAGES);
  await saveCustomers(SEED_CUSTOMERS);
  await saveBills(MAIN_BILLS);
  await saveTickets([]);
  await saveCoverageAreas(SEED_AREAS);
  await saveContents(SEED_CONTENTS);
  await saveAdminUsers(SEED_ADMINS);
  await saveFeatures(SEED_FEATURES);
  await saveTestimonials(SEED_TESTIMONIALS);
  await saveFaqs(SEED_FAQS);

  console.log("✓ Seed data initialized:");
  console.log(`  - ${SEED_PACKAGES.length} packages`);
  console.log(`  - ${SEED_CUSTOMERS.length} customers (Raffi Johan 085162731023, Dewi 081299887766, Budi 081298765432)`);
  console.log(`  - ${MAIN_BILLS.length} bills (belum lunas: Agustus + September)`);
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