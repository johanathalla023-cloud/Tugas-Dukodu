import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/db";
import { randomUUID } from "crypto";

function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return initials || "?";
}

export async function GET() {
  return NextResponse.json({ success: true, testimonials: await getTestimonials() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const initials = body.initials || makeInitials(body.name || "");
  const testimonial = {
    id: body.id || randomUUID(),
    text: body.text,
    name: body.name,
    title: body.title || "",
    initials,
    urutan: Number(body.urutan) || 0,
    status: body.status || "active",
  };
  await addTestimonial(testimonial);
  return NextResponse.json({ success: true, testimonial });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateTestimonial(body.id, {
    ...body,
    initials: body.initials || makeInitials(body.name || ""),
    urutan: Number(body.urutan) || 0,
  });
  if (!updated) return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, testimonial: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  await deleteTestimonial(id);
  return NextResponse.json({ success: true });
}