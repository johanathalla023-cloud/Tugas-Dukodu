import { NextRequest, NextResponse } from "next/server";
import { getTickets, addTicket } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const noPelanggan = searchParams.get("noPelanggan");
  let tickets = getTickets();
  if (noPelanggan) {
    tickets = tickets.filter(t => t.noPelanggan === noPelanggan);
  }
  return NextResponse.json({ success: true, tickets });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const ticket = {
    id: randomUUID(),
    noPelanggan: body.noPelanggan,
    customerName: body.customerName,
    subject: body.subject,
    kategori: body.kategori || "lainnya",
    deskripsi: body.deskripsi,
    status: "open" as "open" | "in_progress" | "resolved" | "closed",
    prioritas: body.prioritas || "medium",
    tanggalDibuat: now.split("T")[0],
    tanggalDiupdate: now,
    replies: [],
  };
  addTicket(ticket);
  return NextResponse.json({ success: true, ticket });
}
