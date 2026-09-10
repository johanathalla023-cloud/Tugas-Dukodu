import { CoreApi, Snap } from "midtrans-client";
import { updateBill, getBillById, getCustomerByNo } from "./db";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

// Mode: gunakan MIDTRANS_ENV sebagai prioritas; jika kosong, deteksi dari prefix kunci
// (SB-* = sandbox, Mid-* = produksi).
function resolveEnv(): "sandbox" | "production" {
  const env = (process.env.MIDTRANS_ENV || "").toLowerCase();
  if (env === "production" || env === "prod") return "production";
  if (env === "sandbox" || env === "staging" || env === "test") return "sandbox";
  const sb = SERVER_KEY.startsWith("SB-") && CLIENT_KEY.startsWith("SB-");
  return sb ? "sandbox" : "production";
}

const isSandbox = resolveEnv() === "sandbox";
const isProduction = !isSandbox;

function isKeyValid(key: string): boolean {
  return key.startsWith("SB-") || key.startsWith("Mid-");
}

export function midtransIsConfigured(): boolean {
  return (
    isKeyValid(SERVER_KEY) &&
    isKeyValid(CLIENT_KEY) &&
    !SERVER_KEY.includes("PLACEHOLDER") &&
    !CLIENT_KEY.includes("PLACEHOLDER")
  );
}

export function getSnap(): Snap {
  return new Snap({
    isProduction,
    serverKey: SERVER_KEY,
    clientKey: CLIENT_KEY,
  });
}

export function getCoreApi(): CoreApi {
  return new CoreApi({
    isProduction,
    serverKey: SERVER_KEY,
    clientKey: CLIENT_KEY,
  });
}

/**
 * Verifikasi status transaksi di Midtrans dan tandai tagihan lunas bila sudah
 * settle/capture. Mengembalikan detail tagihan + nomor WhatsApp pelanggan
 * sehingga halaman Cek Tagihan bisa memuat ulang data secara otomatis.
 */
export async function settleTransactionByOrderId(orderId: string) {
  if (!orderId.startsWith("DKD-")) {
    return { status: "invalid", error: "Order tidak dikenal" };
  }
  const billId = orderId.slice(4);
  const bill = await getBillById(billId);
  if (!bill) {
    return { status: "not_found", error: "Tagihan tidak ditemukan" };
  }

  try {
    const core = getCoreApi();
    const status = (await (core as any).transaction.status(orderId)) as any;
    const txnStatus: string = status?.transaction_status || "";
    const isSuccess = txnStatus === "capture" || txnStatus === "settlement";

    if (isSuccess) {
      const paymentType = status?.payment_type ? ` · ${status.payment_type}` : "";
      await updateBill(billId, {
        status: "paid",
        tanggalBayar: new Date().toISOString().split("T")[0],
        metodeBayar: `Midtrans${paymentType}`,
        jumlahBayar: typeof status?.gross_amount === "number" ? status.gross_amount : bill.tagihan,
        paymentRef: status?.transaction_id || "",
      });
    }

    const customer = await getCustomerByNo(bill.noPelanggan).catch(() => null);
    return {
      status: txnStatus,
      isSuccess,
      bill: { ...bill, status: isSuccess ? "paid" : bill.status },
      phone: customer?.noWhatsApp || "",
      transactionId: status?.transaction_id || "",
    };
  } catch (err: any) {
    console.error("Midtrans status error:", err?.ApiResponse || err);
    return { status: "error", error: "Gagal memverifikasi transaksi" };
  }
}