import { NextRequest, NextResponse } from "next/server";
import { addCoverageArea, updateCoverageArea, deleteCoverageArea, getCoverageAreaById } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.nama || !body.lokasi || body.lat == null || body.lng == null) {
    return NextResponse.json({ error: "Data area belum lengkap" }, { status: 400 });
  }

  if (body.id && getCoverageAreaById(body.id)) {
    const updated = updateCoverageArea(body.id, {
      nama: body.nama,
      lokasi: body.lokasi,
      lat: Number(body.lat),
      lng: Number(body.lng),
      radius: Number(body.radius),
      kecepatanMax: Number(body.kecepatanMax),
      status: body.status,
    });
    return NextResponse.json({ success: true, area: updated });
  }

  const area = {
    id: randomUUID(),
    nama: body.nama,
    lokasi: body.lokasi,
    lat: Number(body.lat),
    lng: Number(body.lng),
    radius: Number(body.radius || 1),
    kecepatanMax: Number(body.kecepatanMax || 50),
    status: body.status || "active",
    tanggalDibuat: new Date().toISOString().split("T")[0],
  };
  addCoverageArea(area);
  return NextResponse.json({ success: true, area });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  deleteCoverageArea(id);
  return NextResponse.json({ success: true });
}