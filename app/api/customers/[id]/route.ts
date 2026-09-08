import { NextRequest, NextResponse } from "next/server";
import { getPackageById, getBillsByCustomer, getTicketsByCustomer, updateCustomer, getCustomerByNo, getCustomerById } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const customer = await getCustomerById(params.id);
  if (!customer) return NextResponse.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });

  const pkg = await getPackageById(customer.paketId);
  const bills = await getBillsByCustomer(customer.noPelanggan);
  const tickets = await getTicketsByCustomer(customer.noPelanggan);
  return NextResponse.json({
    success: true,
    customer: { ...customer, password: undefined },
    paket: pkg || null,
    bills,
    tickets,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateCustomer(params.id, body);
  if (!updated) return NextResponse.json({ error: "Pelanggan tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, customer: { ...updated, password: undefined } });
}