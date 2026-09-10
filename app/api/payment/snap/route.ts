import { NextRequest, NextResponse } from "next/server";
import { getBillById, getCustomerByNo } from "@/lib/db";
import { getSnap, midtransIsConfigured } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  if (!midtransIsConfigured()) {
    return NextResponse.json(
      { error: "Midtrans belum dikonfigurasi. Isi Server Key & Client Key pada file .env.local." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { billId, customerName, noPelanggan } = body;

  if (!billId) {
    return NextResponse.json({ error: "Tagihan wajib dipilih" }, { status: 400 });
  }

  const bill = await getBillById(billId);
  if (!bill) {
    return NextResponse.json({ error: "Tagihan tidak ditemukan" }, { status: 404 });
  }
  if (bill.status === "paid") {
    return NextResponse.json({ error: "Tagihan ini sudah lunas" }, { status: 400 });
  }

  const customer = await getCustomerByNo(noPelanggan || bill.noPelanggan).catch(() => null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const orderId = `DKD-${bill.id}`;

  try {
    const snap = getSnap();
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: bill.tagihan,
      },
      item_details: [
        {
          id: bill.id,
          price: bill.tagihan,
          quantity: 1,
          name: `Internet Dukodu - ${bill.bulan}`,
          category: "Internet",
        },
      ],
      customer_details: {
        first_name: customerName || bill.customerName || "Pelanggan Dukodu",
        phone: customer?.noWhatsApp || "",
        email: customer?.email || "",
      },
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${appUrl}/cek-tagihan?status=finish&order_id=${encodeURIComponent(orderId)}`,
        error: `${appUrl}/cek-tagihan?status=error`,
        pending: `${appUrl}/cek-tagihan?status=pending`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({
      success: true,
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      bill,
    });
  } catch (err: any) {
    console.error("Midtrans snap error:", err?.ApiResponse || err);
    return NextResponse.json(
      {
        error: "Gagal membuat transaksi pembayaran. Coba lagi.",
        detail: String(err?.ApiResponse?.error_messages?.[0] || ""),
      },
      { status: 500 }
    );
  }
}