import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, getCustomerByPhone, addCustomer, getCustomers, addBill, getPackages } from "@/lib/db";
import { randomUUID } from "crypto";

function nextNoPelanggan(customers: { noPelanggan: string }[]): string {
  let max = 0;
  for (const c of customers) {
    const m = /^DKD-(\d+)$/.exec(c.noPelanggan || "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return "DKD-" + String(max + 1).padStart(5, "0");
}

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function bulanSekarang(date: Date): string {
  return `${BULAN_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, password } = body;

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  if (await getCustomerByEmail(email)) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  }

  const customers = await getCustomers();
  const existingWithPhone = customers.find(
    (c) => c.noWhatsApp === phone || c.noWhatsApp === phone.replace(/^0/, "+62") || c.noWhatsApp === "62" + phone.replace(/^0/, "")
  );
  if (existingWithPhone) {
    return NextResponse.json({ error: "Nomor WhatsApp sudah terdaftar" }, { status: 400 });
  }

  const customer = {
    id: randomUUID(),
    namaLengkap: name,
    email,
    noWhatsApp: phone,
    password,
    alamat: body.alamat || "",
    provinsi: body.provinsi || "",
    kabupaten: body.kabupaten || "",
    kecamatan: body.kecamatan || "",
    kelurahan: body.kelurahan || "",
    lat: body.lat ? Number(body.lat) : 0,
    lng: body.lng ? Number(body.lng) : 0,
    paketId: body.paketId || "",
    status: "pending" as "active" | "suspended" | "pending" | "inactive",
    tanggalDaftar: new Date().toISOString().split("T")[0],
    tanggalPasang: "",
    noPelanggan: nextNoPelanggan(customers),
    fotoKTP: body.fotoKTP || "",
    alamatInstalasi: body.alamatInstalasi || "",
    alamatPenagihan: body.alamatPenagihan || "",
  };

  await addCustomer(customer);

  const pakej = body.paketId ? await getPackages().then((ps) => ps.find((p) => p.id === body.paketId) || null) : null;
  const now = new Date();
  const bill = {
    id: randomUUID(),
    noPelanggan: customer.noPelanggan,
    customerName: customer.namaLengkap,
    bulan: bulanSekarang(now),
    tagihan: pakej?.harga ?? 0,
    status: "unpaid" as const,
    tanggalTerbit: now.toISOString().split("T")[0],
    tanggalJatuhTempo: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0],
  };
  if (bill.tagihan > 0) {
    await addBill(bill);
  }

  const safeCustomer = { ...customer, password: undefined };
  return NextResponse.json({ success: true, customer: safeCustomer, bill: bill.tagihan > 0 ? bill : undefined });
}

export async function GET() {
  const customers = (await getCustomers()).map(({ password, ...rest }) => rest);
  return NextResponse.json({ success: true, customers });
}