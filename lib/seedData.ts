import type { Package, CoverageArea, Content, AdminUser, Feature, Testimonial, Faq } from "./types";

export const SEED_PACKAGES: Package[] = [
  { id: "pkg-001", nama: "Paket Hemat", kecepatan: "30 Mbps", harga: 175000, deskripsi: "Cocok untuk browsing & streaming ringan", fitur: ["Unlimited quota", "WiFi router", "Free instalasi", "Support 24/7"], status: "active", popular: false },
  { id: "pkg-002", nama: "Paket Utama", kecepatan: "50 Mbps", harga: 199000, deskripsi: "Ideal untuk keluarga & work from home", fitur: ["Unlimited quota", "WiFi router dual-band", "Free instalasi", "Support 24/7", "Gratis IP Public"], status: "active", popular: true },
  { id: "pkg-003", nama: "Paket Premium", kecepatan: "100 Mbps", harga: 599000, deskripsi: "Untuk gamer & content creator", fitur: ["Unlimited quota", "WiFi router AX", "Free instalasi", "Support prioritas", "IP Public dedicated", "SLA 99.9%"], status: "active", popular: false },
];

export const SEED_AREAS: CoverageArea[] = [
  { id: "area-001", nama: "Dukodu Residence", lokasi: "Mampang Prapatan, Jakarta Selatan", lat: -6.2483, lng: 106.8256, radius: 1.6, kecepatanMax: 100, status: "active", tanggalDibuat: "2024-06-01" },
  { id: "area-002", nama: "Dukodu Park", lokasi: "Tebet, Jakarta Selatan", lat: -6.2264, lng: 106.8522, radius: 1.4, kecepatanMax: 50, status: "active", tanggalDibuat: "2024-08-15" },
  { id: "area-003", nama: "Dukodu Hills", lokasi: "Kebayoran Baru, Jakarta Selatan", lat: -6.2396, lng: 106.8063, radius: 1.7, kecepatanMax: 100, status: "active", tanggalDibuat: "2025-01-10" },
  { id: "area-004", nama: "Kota Dukodu", lokasi: "Setiabudi/Kuningan, Jakarta Selatan", lat: -6.2109, lng: 106.8295, radius: 2.2, kecepatanMax: 100, status: "active", tanggalDibuat: "2025-03-20" },
];

export const SEED_CONTENTS: Content[] = [
  { id: "cnt-001", judul: "Promo Spesial September: Gratis 1 Bulan!", slug: "promo-september-2026", konten: "Dalam rangka HUT Kemerdekaan, Dukodu memberikan promo spesial untuk pelanggan baru. Daftar sekarang dan dapatkan bonus gratis 1 bulan berlangganan untuk semua paket!", kategori: "promo", status: "published", tanggalDibuat: "2026-09-01", tanggalDiupdate: "2026-09-01" },
  { id: "cnt-002", judul: "Pemeliharaan Jaringan 15 September", slug: "maintenance-15-sept", konten: "Akan dilakukan pemeliharaan jaringan pada tanggal 15 September 2026 pukul 02:00 - 06:00 WIB. Layanan mungkin terganggu sementara selama proses pemeliharaan.", kategori: "pengumuman", status: "published", tanggalDibuat: "2026-09-05", tanggalDiupdate: "2026-09-05" },
  { id: "cnt-003", judul: "Dukodu Expansion ke Depok", slug: "expansion-depok", konten: "Kabar gembira! Dukodu akan segera memperluas jaringan fiber ke area Depok. Pantau terus coverage map kami untuk info lebih lanjut.", kategori: "berita", status: "draft", tanggalDibuat: "2026-09-08", tanggalDiupdate: "2026-09-08" },
];

export const SEED_ADMINS: AdminUser[] = [
  { id: "adm-001", username: "admin", password: "admin123", nama: "Admin", role: "superadmin" },
  { id: "adm-002", username: "support", password: "support123", nama: "Tim Support", role: "support" },
];

export const SEED_FEATURES: Feature[] = [
  { id: "feat-001", icon: "fas fa-bolt", title: "Kecepatan Tinggi", desc: "Fiber optik terkini dengan kecepatan konsisten hingga 100 Mbps untuk streaming, gaming, dan kerja online tanpa lag.", urutan: 1, status: "active" },
  { id: "feat-002", icon: "fas fa-server", title: "Infrastruktur Terpercaya", desc: "Jaringan modern dengan server tersebar strategis menjamin kualitas koneksi stabil dan aman di seluruh wilayah.", urutan: 2, status: "active" },
  { id: "feat-003", icon: "fas fa-headset", title: "Support 24/7", desc: "Tim profesional siap membantu kapan saja melalui chat, telepon, atau kunjungan langsung ke lokasi Anda.", urutan: 3, status: "active" },
  { id: "feat-004", icon: "fas fa-coins", title: "Harga Terjangkau", desc: "Paket fleksibel dengan harga kompetitif tanpa biaya tersembunyi, instalasi gratis, dan bonus perangkat.", urutan: 4, status: "active" },
  { id: "feat-005", icon: "fas fa-lock", title: "Keamanan Terjamin", desc: "Enkripsi tingkat enterprise dan firewall canggih melindungi data pribadi serta privasi online Anda setiap saat.", urutan: 5, status: "active" },
  { id: "feat-006", icon: "fas fa-truck-fast", title: "Instalasi Mudah", desc: "Proses aktivasi cepat hanya 1-2 hari kerja dengan teknisi berpengalaman dan panduan lengkap di awal penggunaan.", urutan: 6, status: "active" },
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  { id: "tsm-001", text: '"Koneksi internet Dukodu benar-benar mengubah hidup saya. Kecepatan stabil, support responsif, dan harga yang sangat terjangkau. Sangat merekomendasikan!"', name: "Budi Santoso", title: "Freelancer", initials: "BS", urutan: 1, status: "active" },
  { id: "tsm-002", text: '"Sebagai gamer, saya butuh kecepatan dan stabilitas. Dukodu memberikan keduanya dengan harga jauh lebih murah dari kompetitor. Puas!"', name: "Rini Wijaya", title: "Content Creator", initials: "RW", urutan: 2, status: "active" },
  { id: "tsm-003", text: '"Proses instalasi sangat cepat dan tim support mereka luar biasa membantu. Internet stabil untuk kebutuhan kantor rumahan saya."', name: "Ahmad Pratama", title: "Entrepreneur", initials: "AP", urutan: 3, status: "active" },
];

export const SEED_FAQS: Faq[] = [
  { id: "faq-001", question: "Berapa lama proses instalasi?", answer: "Proses instalasi biasanya memakan waktu 1-2 hari kerja sejak data Anda terverifikasi. Tim teknisi profesional kami akan mengurus semuanya dengan cepat dan efisien.", urutan: 1, status: "active" },
  { id: "faq-002", question: "Apakah ada biaya tersembunyi?", answer: "Tidak ada biaya tersembunyi sama sekali. Semua biaya sudah tercantum jelas, dan instalasi serta router sudah termasuk gratis di setiap paket.", urutan: 2, status: "active" },
  { id: "faq-003", question: "Bagaimana jika internet mati tiba-tiba?", answer: "Hubungi support 24/7 kami melalui chat, WhatsApp, atau telepon. Tim kami akan segera membantu diagnosa dan perbaikan dalam waktu singkat.", urutan: 3, status: "active" },
  { id: "faq-004", question: "Bisa ganti paket kapan saja?", answer: "Ya, Anda bisa upgrade atau downgrade paket kapan saja tanpa penalti. Perubahan akan berlaku bulan berikutnya dengan proses yang sangat mudah.", urutan: 4, status: "active" },
  { id: "faq-005", question: "Apa itu SLA (Service Level Agreement)?", answer: "SLA adalah jaminan layanan kami dengan uptime 99.9%. Jika terjadi downtime di luar maintenance, Anda akan mendapat kompensasi kredit otomatis.", urutan: 5, status: "active" },
  { id: "faq-006", question: "Bagaimana kontrak dan komitmen waktu?", answer: "Kami menawarkan kontrak fleksibel mulai dari 1 bulan hingga 12 bulan. Semakin lama komitmen, semakin besar diskon yang Anda dapatkan.", urutan: 6, status: "active" },
];