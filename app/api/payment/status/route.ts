import { NextRequest, NextResponse } from "next/server";
import { settleTransactionByOrderId, midtransIsConfigured } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  if (!midtransIsConfigured()) {
    return NextResponse.json(
      { error: "Midtrans belum dikonfigurasi. Isi Server Key & Client Key pada file .env.local." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const orderId: string = body?.order_id || "";

  if (!orderId) {
    return NextResponse.json({ error: "order_id diperlukan" }, { status: 400 });
  }

  const result = await settleTransactionByOrderId(orderId);
  if (result.status === "invalid" || result.status === "not_found") {
    return NextResponse.json({ error: result.error }, { status: result.status === "invalid" ? 400 : 404 });
  }

  return NextResponse.json({ success: true, ...result });
}