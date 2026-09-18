import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = await getSiteSettings();
  const settings = {
    id: current?.id || "site-001",
    logo: body.logo || current?.logo || "",
    updatedAt: new Date().toISOString().split("T")[0],
  };
  await saveSiteSettings(settings);
  return NextResponse.json({ success: true, settings });
}