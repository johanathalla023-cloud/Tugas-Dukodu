import { NextRequest, NextResponse } from "next/server";
import { getBillsByCustomer, updateBill, getBillById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const noPelanggan = searchParams.get("noPelanggan");
  if (noPelanggan) {
    return NextResponse.json({ success: true, bills: getBillsByCustomer(noPelanggan) });
  }
  return NextResponse.json({ error: "Parameter noPelanggan diperlukan" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bill = getBillById(body.billId);
  if (!bill) return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });

  const updated = updateBill(body.billId, {
    status: "paid",
    tanggalBayar: new Date().toISOString().split("T")[0],
    metodeBayar: body.metodeBayar || "Transfer Bank",
    jumlahBayar: bill.tagihan,
  });
  return NextResponse.json({ success: true, bill: updated });
}
