import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, addCustomer, getCustomers } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, password } = body;

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  if (getCustomerByEmail(email)) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
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
    noPelanggan: "DKD-" + String(getCustomers().length + 1).padStart(5, "0"),
    fotoKTP: body.fotoKTP || "",
  };

  addCustomer(customer);
  const safeCustomer = { ...customer, password: undefined };
  return NextResponse.json({ success: true, customer: safeCustomer });
}

export async function GET() {
  const customers = getCustomers().map(({ password, ...rest }) => rest);
  return NextResponse.json({ success: true, customers });
}
