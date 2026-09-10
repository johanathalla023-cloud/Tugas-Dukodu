export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS customers (
  "id" TEXT PRIMARY KEY,
  "namaLengkap" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "noWhatsApp" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "alamat" TEXT NOT NULL DEFAULT '',
  "provinsi" TEXT NOT NULL DEFAULT '',
  "kabupaten" TEXT NOT NULL DEFAULT '',
  "kecamatan" TEXT NOT NULL DEFAULT '',
  "kelurahan" TEXT NOT NULL DEFAULT '',
  "lat" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lng" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "paketId" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "tanggalDaftar" TEXT NOT NULL,
  "tanggalPasang" TEXT NOT NULL DEFAULT '',
  "noPelanggan" TEXT NOT NULL UNIQUE,
  "fotoKTP" TEXT,
  "alamatInstalasi" TEXT,
  "alamatPenagihan" TEXT
);

CREATE TABLE IF NOT EXISTS packages (
  "id" TEXT PRIMARY KEY,
  "nama" TEXT NOT NULL,
  "kecepatan" TEXT NOT NULL,
  "harga" INTEGER NOT NULL,
  "deskripsi" TEXT NOT NULL,
  "fitur" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "status" TEXT NOT NULL DEFAULT 'active',
  "popular" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tickets (
  "id" TEXT PRIMARY KEY,
  "noPelanggan" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "kategori" TEXT NOT NULL,
  "deskripsi" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "prioritas" TEXT NOT NULL DEFAULT 'low',
  "tanggalDibuat" TEXT NOT NULL,
  "tanggalDiupdate" TEXT NOT NULL,
  "replies" JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS bills (
  "id" TEXT PRIMARY KEY,
  "noPelanggan" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "bulan" TEXT NOT NULL,
  "tagihan" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'unpaid',
  "tanggalTerbit" TEXT NOT NULL,
  "tanggalJatuhTempo" TEXT NOT NULL,
  "tanggalBayar" TEXT,
  "metodeBayar" TEXT,
  "jumlahBayar" INTEGER
);
ALTER TABLE bills ADD COLUMN IF NOT EXISTS "paymentRef" TEXT;

CREATE TABLE IF NOT EXISTS coverage_areas (
  "id" TEXT PRIMARY KEY,
  "nama" TEXT NOT NULL,
  "lokasi" TEXT NOT NULL,
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "radius" DOUBLE PRECISION NOT NULL,
  "kecepatanMax" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "tanggalDibuat" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contents (
  "id" TEXT PRIMARY KEY,
  "judul" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "konten" TEXT NOT NULL,
  "kategori" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "tanggalDibuat" TEXT NOT NULL,
  "tanggalDiupdate" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  "id" TEXT PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "nama" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'support'
);

CREATE TABLE IF NOT EXISTS features (
  "id" TEXT PRIMARY KEY,
  "icon" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  "urutan" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS testimonials (
  "id" TEXT PRIMARY KEY,
  "text" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "initials" TEXT NOT NULL,
  "urutan" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS faqs (
  "id" TEXT PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "urutan" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers ("email");
CREATE INDEX IF NOT EXISTS idx_customers_nopelanggan ON customers ("noPelanggan");
CREATE INDEX IF NOT EXISTS idx_bills_nopelanggan ON bills ("noPelanggan");
CREATE INDEX IF NOT EXISTS idx_tickets_nopelanggan ON tickets ("noPelanggan");
`;