import { NextRequest, NextResponse } from "next/server";
import { getFeatures, addFeature, updateFeature, deleteFeature } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ success: true, features: await getFeatures() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const feature = {
    id: body.id || randomUUID(),
    icon: body.icon || "fas fa-star",
    title: body.title,
    desc: body.desc || "",
    urutan: Number(body.urutan) || 0,
    status: body.status || "active",
  };
  await addFeature(feature);
  return NextResponse.json({ success: true, feature });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateFeature(body.id, {
    ...body,
    urutan: Number(body.urutan) || 0,
  });
  if (!updated) return NextResponse.json({ error: "Keunggulan tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, feature: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  await deleteFeature(id);
  return NextResponse.json({ success: true });
}