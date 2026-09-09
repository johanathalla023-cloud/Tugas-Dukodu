export interface Customer {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsApp: string;
  password: string;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  lat: number;
  lng: number;
  paketId: string;
  status: "active" | "suspended" | "pending" | "inactive";
  tanggalDaftar: string;
  tanggalPasang: string;
  noPelanggan: string;
  fotoKTP?: string;
  alamatInstalasi?: string;
  alamatPenagihan?: string;
}

export interface Package {
  id: string;
  nama: string;
  kecepatan: string;
  harga: number;
  deskripsi: string;
  fitur: string[];
  status: "active" | "inactive";
  popular: boolean;
}

export interface Ticket {
  id: string;
  noPelanggan: string;
  customerName: string;
  subject: string;
  kategori: "gangguan" | "tagihan" | "pasang_baru" | "perubahan_paket" | "lainnya";
  deskripsi: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  prioritas: "low" | "medium" | "high" | "urgent";
  tanggalDibuat: string;
  tanggalDiupdate: string;
  replies: TicketReply[];
}

export interface TicketReply {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Bill {
  id: string;
  noPelanggan: string;
  customerName: string;
  bulan: string;
  tagihan: number;
  status: "unpaid" | "paid" | "overdue" | "partial";
  tanggalTerbit: string;
  tanggalJatuhTempo: string;
  tanggalBayar?: string;
  metodeBayar?: string;
  jumlahBayar?: number;
}

export interface CoverageArea {
  id: string;
  nama: string;
  lokasi: string;
  lat: number;
  lng: number;
  radius: number;
  kecepatanMax: number;
  status: "active" | "inactive";
  tanggalDibuat: string;
}

export interface Content {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  kategori: "berita" | "promo" | "pengumuman";
  status: "draft" | "published";
  tanggalDibuat: string;
  tanggalDiupdate: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  nama: string;
  role: "superadmin" | "admin" | "support";
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
  urutan: number;
  status: "active" | "inactive";
}

export interface Testimonial {
  id: string;
  text: string;
  name: string;
  title: string;
  initials: string;
  urutan: number;
  status: "active" | "inactive";
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  urutan: number;
  status: "active" | "inactive";
}
