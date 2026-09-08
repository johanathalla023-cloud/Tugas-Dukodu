import { NextRequest, NextResponse } from "next/server";
import { getPackages, addPackage, updatePackage, deletePackage } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ success: true, packages: await getPackages() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pkg = {
    id: body.id || randomUUID(),
    nama: body.nama,
    kecepatan: body.kecepatan,
    harga: Number(body.harga),
    deskripsi: body.deskripsi || "",
    fitur: body.fitur || [],
    status: body.status || "active",
    popular: body.popular || false,
  };
  await addPackage(pkg);
  return NextResponse.json({ success: true, pkg });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updatePackage(body.id, { ...body, harga: Number(body.harga), popular: body.popular });
  if (!updated) return NextResponse.json({ error: "Package tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, pkg: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  await deletePackage(id);
  return NextResponse.json({ success: true });
}
