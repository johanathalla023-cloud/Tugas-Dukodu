import { savePackages, saveCustomers, saveBills, saveTickets, saveCoverageAreas, saveContents, saveAdminUsers } from "./db";
import type { Package, CoverageArea, Content, AdminUser } from "./types";

function seedAll() {
  const packages: Package[] = [
    { id: "pkg-001", nama: "Paket Hemat", kecepatan: "30 Mbps", harga: 175000, deskripsi: "Cocok untuk browsing & streaming ringan", fitur: ["Unlimited quota", "WiFi router", "Free instalasi", "Support 24/7"], status: "active", popular: false },
    { id: "pkg-002", nama: "Paket Utama", kecepatan: "50 Mbps", harga: 199000, deskripsi: "Ideal untuk keluarga & work from home", fitur: ["Unlimited quota", "WiFi router dual-band", "Free instalasi", "Support 24/7", "Gratis IP Public"], status: "active", popular: true },
    { id: "pkg-003", nama: "Paket Premium", kecepatan: "100 Mbps", harga: 599000, deskripsi: "Untuk gamer & content creator", fitur: ["Unlimited quota", "WiFi router AX", "Free instalasi", "Support prioritas", "IP Public dedicated", "SLA 99.9%"], status: "active", popular: false },
  ];

  const areas: CoverageArea[] = [
    { id: "area-001", nama: "Dukodu Residence", lokasi: "Mampang Prapatan, Jakarta Selatan", lat: -6.2483, lng: 106.8256, radius: 1.6, kecepatanMax: 100, status: "active", tanggalDibuat: "2024-06-01" },
    { id: "area-002", nama: "Dukodu Park", lokasi: "Tebet, Jakarta Selatan", lat: -6.2264, lng: 106.8522, radius: 1.4, kecepatanMax: 50, status: "active", tanggalDibuat: "2024-08-15" },
    { id: "area-003", nama: "Dukodu Hills", lokasi: "Kebayoran Baru, Jakarta Selatan", lat: -6.2396, lng: 106.8063, radius: 1.7, kecepatanMax: 100, status: "active", tanggalDibuat: "2025-01-10" },
    { id: "area-004", nama: "Kota Dukodu", lokasi: "Setiabudi/Kuningan, Jakarta Selatan", lat: -6.2109, lng: 106.8295, radius: 2.2, kecepatanMax: 100, status: "active", tanggalDibuat: "2025-03-20" },
  ];

  const contents: Content[] = [
    { id: "cnt-001", judul: "Promo Spesial September: Gratis 1 Bulan!", slug: "promo-september-2026", konten: "Dalam rangka HUT Kemerdekaan, Dukodu memberikan promo spesial untuk pelanggan baru. Daftar sekarang dan dapatkan bonus gratis 1 bulan berlangganan untuk semua paket!", kategori: "promo", status: "published", tanggalDibuat: "2026-09-01", tanggalDiupdate: "2026-09-01" },
    { id: "cnt-002", judul: "Pemeliharaan Jaringan 15 September", slug: "maintenance-15-sept", konten: "Akan dilakukan pemeliharaan jaringan pada tanggal 15 September 2026 pukul 02:00 - 06:00 WIB. Layanan mungkin terganggu sementara selama proses pemeliharaan.", kategori: "pengumuman", status: "published", tanggalDibuat: "2026-09-05", tanggalDiupdate: "2026-09-05" },
    { id: "cnt-003", judul: "Dukodu Expansion ke Depok", slug: "expansion-depok", konten: "Kabar gembira! Dukodu akan segera memperluas jaringan fiber ke area Depok. Pantau terus coverage map kami untuk info lebih lanjut.", kategori: "berita", status: "draft", tanggalDibuat: "2026-09-08", tanggalDiupdate: "2026-09-08" },
  ];

  const admins: AdminUser[] = [
    { id: "adm-001", username: "admin", password: "admin123", nama: "Admin", role: "superadmin" },
    { id: "adm-002", username: "support", password: "support123", nama: "Tim Support", role: "support" },
  ];

  savePackages(packages);
  saveCustomers([]);
  saveBills([]);
  saveTickets([]);
  saveCoverageAreas(areas);
  saveContents(contents);
  saveAdminUsers(admins);

  console.log("✓ Seed data initialized:");
  console.log(`  - ${packages.length} packages`);
  console.log(`  - 0 customers (kosong — pelanggan daftar mandiri)`);
  console.log(`  - 0 bills`);
  console.log(`  - 0 tickets`);
  console.log(`  - ${areas.length} coverage areas`);
  console.log(`  - ${contents.length} content items`);
  console.log(`  - ${admins.length} admin users`);
}

seedAll();