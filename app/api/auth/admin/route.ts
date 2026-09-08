import { NextResponse } from "next/server";
import { getAdminByUsername } from "@/lib/db";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const admin = await getAdminByUsername(username);

  if (!admin || admin.password !== password) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    admin: { id: admin.id, username: admin.username, nama: admin.nama, role: admin.role },
  });
}
