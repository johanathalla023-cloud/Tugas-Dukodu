import { NextRequest, NextResponse } from "next/server";
import { getFaqs, addFaq, updateFaq, deleteFaq } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ success: true, faqs: await getFaqs() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const faq = {
    id: body.id || randomUUID(),
    question: body.question,
    answer: body.answer || "",
    urutan: Number(body.urutan) || 0,
    status: body.status || "active",
  };
  await addFaq(faq);
  return NextResponse.json({ success: true, faq });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateFaq(body.id, {
    ...body,
    urutan: Number(body.urutan) || 0,
  });
  if (!updated) return NextResponse.json({ error: "FAQ tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, faq: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  await deleteFaq(id);
  return NextResponse.json({ success: true });
}