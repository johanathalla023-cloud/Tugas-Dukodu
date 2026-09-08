import { NextRequest, NextResponse } from "next/server";
import { getContents, addContent, updateContent, deleteContent } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ success: true, contents: getContents() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const content = {
    id: randomUUID(),
    judul: body.judul,
    slug: body.slug || body.judul?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    konten: body.konten,
    kategori: body.kategori || "berita",
    status: body.status || "draft",
    tanggalDibuat: now.split("T")[0],
    tanggalDiupdate: now.split("T")[0],
  };
  addContent(content);
  return NextResponse.json({ success: true, content });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = updateContent(body.id, {
    ...body,
    tanggalDiupdate: new Date().toISOString().split("T")[0],
  });
  if (!updated) return NextResponse.json({ error: "Konten tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, content: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  deleteContent(id);
  return NextResponse.json({ success: true });
}