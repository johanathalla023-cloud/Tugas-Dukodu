import { NextRequest, NextResponse } from "next/server";
import { getCustomerByNo, addBill, getBills } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { noPelanggan, bulan, tagihan, tanggalTerbit, tanggalJatuhTempo } = body;

  if (!noPelanggan || !bulan || !tagihan) {
    return NextResponse.json({ error: "Data tagihan belum lengkap" }, { status: 400 });
  }

  const customer = getCustomerByNo(noPelanggan);
  if (!customer) {
    return NextResponse.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });
  }

  const bill = {
    id: randomUUID(),
    noPelanggan,
    customerName: customer.namaLengkap,
    bulan,
    tagihan: Number(tagihan),
    status: "unpaid" as const,
    tanggalTerbit: tanggalTerbit || new Date().toISOString().split("T")[0],
    tanggalJatuhTempo: tanggalJatuhTempo || new Date().toISOString().split("T")[0],
  };

  addBill(bill);
  return NextResponse.json({ success: true, bill });
}