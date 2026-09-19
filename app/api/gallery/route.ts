import { NextRequest, NextResponse } from "next/server";
import { getGalleryPhotos, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ success: true, photos: await getGalleryPhotos() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const photos = await getGalleryPhotos();
  const photo = {
    id: body.id || randomUUID(),
    src: body.src,
    alt: body.alt || "",
    icon: body.icon || "fa-image",
    label: body.label || "",
    urutan: Number(body.urutan) || photos.length + 1, .
    status: body.status || "active",
  };
  await addGalleryPhoto(photo);
  return NextResponse.json({ success: true, photo });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateGalleryPhoto(body.id, {
    ...body,
    urutan: Number(body.urutan) || 0,
  });
  if (!updated) return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true, photo: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  await deleteGalleryPhoto(id);
  return NextResponse.json({ success: true });
}