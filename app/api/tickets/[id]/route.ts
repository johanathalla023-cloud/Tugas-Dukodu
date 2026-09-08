import { NextRequest, NextResponse } from "next/server";
import { updateTicket, getTicketById } from "@/lib/db";
import { randomUUID } from "crypto";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  const updatesWithReply = { ...updates };
  if (body.reply) {
    const ticket = getTicketById(id);
    const reply = {
      id: randomUUID(),
      sender: body.sender || "admin",
      senderName: body.senderName || "Admin Dukodu",
      message: body.reply,
      timestamp: new Date().toISOString(),
    };
    updatesWithReply.replies = [...(ticket?.replies || []), reply];
    updatesWithReply.tanggalDiupdate = new Date().toISOString();
  }
  delete updatesWithReply.reply;
  delete updatesWithReply.sender;
  delete updatesWithReply.senderName;

  const updated = updateTicket(id, updatesWithReply);
  if (!updated) return NextResponse.json({ error: "Ticket tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, ticket: updated });
}
