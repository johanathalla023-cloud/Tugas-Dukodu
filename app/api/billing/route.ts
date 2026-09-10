import { NextRequest, NextResponse } from "next/server";
import { getBillsByCustomer, getCustomerByPhone, updateBill, getBillById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const noPelanggan = searchParams.get("noPelanggan");
  const phone = searchParams.get("phone");

  if (noPelanggan) {
    return NextResponse.json({ success: true, bills: await getBillsByCustomer(noPelanggan) });
  }
  if (phone) {
    const customer = await getCustomerByPhone(phone);
    if (!customer) {
      return NextResponse.json({ error: "Nomor WhatsApp tidak terdaftar" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      customer: { namaLengkap: customer.namaLengkap, noPelanggan: customer.noPelanggan, noWhatsApp: customer.noWhatsApp },
      bills: await getBillsByCustomer(customer.noPelanggan),
    });
  }
  return NextResponse.json({ error: "Parameter phone diperlukan" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bill = await getBillById(body.billId);
  if (!bill) return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });

  const updated = await updateBill(body.billId, {
    status: "paid",
    tanggalBayar: new Date().toISOString().split("T")[0],
    metodeBayar: body.metodeBayar || "Transfer Bank",
    jumlahBayar: bill.tagihan,
  });
  return NextResponse.json({ success: true, bill: updated });
}
