import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const customer = await getCustomerByEmail(email);

  if (!customer) {
    return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 401 });
  }
  if (customer.password !== password) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    customer: { ...customer, password: undefined },
  });
}
