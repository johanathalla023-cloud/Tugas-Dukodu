import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Dukodu CMS API is running", timestamp: new Date().toISOString() });
}
