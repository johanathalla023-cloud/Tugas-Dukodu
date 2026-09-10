import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getBillById, updateBill } from "@/lib/db";
import { getCoreApi, midtransIsConfigured } from "@/lib/midtrans";

function isValidSignature(bodyText: string, signatureKey: string, serverKey: string) {
  const hash = crypto
    .createHash("sha512")
    .update(bodyText + serverKey)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signatureKey || ""));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const body = JSON.parse(raw);
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    const signatureOk = isValidSignature(raw, body.signature_key, serverKey);
    const clientOk = midtransIsConfigured();

    let verified = false;
    if (signatureOk && clientOk) {
      verified = true;
    } else if (clientOk) {
      try {
        const core = getCoreApi() as any;
        const status = await core.transaction.status(body.order_id);
        if (status && status.transaction_status) verified = true;
      } catch {
        verified = false;
      }
    }

    if (!verified) {
      return NextResponse.json({ error: "Signature tidak valid" }, { status: 403 });
    }

    const orderId: string = body.order_id || "";
    const transactionStatus: string = body.transaction_status || "";
    const fraudStatus: string = body.fraud_status || "";
    const paymentType: string = body.payment_type || "";
    const transactionId: string = body.transaction_id || "";

    if (!orderId.startsWith("DKD-")) {
      return NextResponse.json({ error: "Order tidak dikenal" }, { status: 400 });
    }

    const billId = orderId.slice(4);
    const bill = await getBillById(billId);
    if (!bill) {
      return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
    }

    const isSuccess =
      transactionStatus === "capture" ||
      transactionStatus === "settlement";

    const isDenied =
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire" ||
      (transactionStatus === "capture" && fraudStatus === "deny");

    if (isSuccess) {
      await updateBill(billId, {
        status: "paid",
        tanggalBayar: new Date().toISOString().split("T")[0],
        metodeBayar: `Midtrans · ${paymentType}`,
        jumlahBayar: typeof body.gross_amount === "number" ? body.gross_amount : bill.tagihan,
        paymentRef: transactionId,
      });
    } else if (isDenied) {
      await updateBill(billId, {
        status: bill.status === "overdue" ? "overdue" : "unpaid",
      });
    }

    return NextResponse.json({
      success: true,
      status: transactionStatus,
      transaction_id: transactionId,
    });
  } catch (err) {
    console.error("Midtrans notification error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada notifikasi" }, { status: 500 });
  }
}