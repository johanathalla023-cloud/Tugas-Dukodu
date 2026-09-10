"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import FooterDetail from "@/components/FooterDetail";
import { formatIDR } from "@/lib/auth";
import { midtransIsConfiguredClient, openSnapPayment } from "@/lib/snap";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Tagihan", href: "/cek-tagihan" },
  { label: "Cek Area", href: "/#cek-area" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "FAQ", href: "/#faq" },
];

interface Bill {
  id: string;
  noPelanggan: string;
  customerName: string;
  bulan: string;
  tagihan: number;
  status: "unpaid" | "paid" | "overdue" | "partial";
  tanggalTerbit: string;
  tanggalJatuhTempo: string;
  tanggalBayar?: string;
  metodeBayar?: string;
  jumlahBayar?: number;
  paymentRef?: string;
}

const BILL_STATUS: Record<string, { icon: string; cls: string; label: string }> = {
  unpaid: { icon: "fa-hourglass", cls: "gold", label: "Belum Dibayar" },
  paid: { icon: "fa-circle-check", cls: "green", label: "Lunas" },
  overdue: { icon: "fa-triangle-exclamation", cls: "red", label: "Terlambat" },
  partial: { icon: "fa-circle-half-stroke", cls: "blue", label: "Sebagian" },
};

const DEMO_METHODS = [
  { id: "Virtual Account BCA", icon: "fa-landmark", label: "Virtual Account", desc: "BCA, BNI, Mandiri, BRI" },
  { id: "Gopay", icon: "fa-wallet", label: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
  { id: "Kartu Kredit", icon: "fa-credit-card", label: "Kartu Kredit", desc: "Visa, Mastercard, JCB" },
  { id: "QRIS", icon: "fa-qrcode", label: "QRIS", desc: "Scan QR dari e-wallet / m-banking" },
];

export default function CekTagihanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<{ namaLengkap: string; noPelanggan: string; noWhatsApp: string } | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payTarget, setPayTarget] = useState<Bill | null>(null);
  const [demoMethod, setDemoMethod] = useState(DEMO_METHODS[0].id);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  const showToast = useCallback((type: "success" | "error" | "info", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 6000);
  }, []);

  const loadBills = useCallback(async (p: string) => {
    setError("");
    const res = await fetch(`/api/billing?phone=${encodeURIComponent(p)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan saat memeriksa tagihan.");
      setCustomer(null);
      setBills([]);
      return { ok: false as const };
    }
    setCustomer(data.customer || null);
    setBills(
      (data.bills || []).sort((a: Bill, b: Bill) => b.tanggalTerbit.localeCompare(a.tanggalTerbit))
    );
    return { ok: true as const };
  }, []);

  const verifyPayment = useCallback(async (orderId: string, billBulan: string) => {
    setVerifying(true);
    try {
      const res = await fetch("/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        if (data.phone) setPhone(data.phone);
        showToast("success", `Pembayaran ${billBulan} berhasil! Tagihan sudah lunas.`);
        const p = data.phone || phone;
        if (p) await loadBills(p);
        setChecked(true);
      } else if (res.ok) {
        showToast("info", "Pembayaran sedang menunggu. Cek kembali tagihan Anda sebentar lagi.");
        const p = data.phone || phone;
        if (p) await loadBills(p);
        setChecked(true);
      } else {
        setError(data.error || "Gagal memverifikasi pembayaran.");
      }
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat memverifikasi pembayaran.");
    } finally {
      setVerifying(false);
    }
  }, [loadBills, phone, showToast]);

  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("order_id") || "";
    if (status && orderId) {
      verifyPayment(orderId, "tagihan");
      router.replace("/cek-tagihan");
    }
  }, [searchParams, router, verifyPayment]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setChecked(false);
    setCustomer(null);
    setBills([]);
    try {
      await loadBills(phone.trim());
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  const handlePay = async (bill: Bill) => {
    if (!midtransIsConfiguredClient()) {
      setPayTarget(bill);
      return;
    }
    setPayingId(bill.id);
    setError("");
    try {
      const res = await fetch("/api/payment/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId: bill.id,
          customerName: bill.customerName,
          noPelanggan: bill.noPelanggan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat transaksi pembayaran.");
        return;
      }

      const opened = await openSnapPayment(data.snap_token, {
        onSuccess: async (result) => {
          const orderId = result?.order_id || data.order_id;
          let updated = false;
          if (orderId) {
            try {
              const vres = await fetch("/api/payment/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: orderId }),
              });
              const vdata = await vres.json();
              updated = vres.ok && vdata.isSuccess;
            } catch {}
          }
          if (!updated) {
            try {
              await fetch("/api/billing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  billId: bill.id,
                  metodeBayar: result?.payment_type || "Midtrans",
                }),
              });
            } catch {}
          }
          showToast("success", `Pembayaran ${bill.bulan} berhasil! Tagihan sudah lunas.`);
          loadBills(phone.trim());
        },
        onPending: (result) => {
          const orderId = result?.order_id || data.order_id;
          if (orderId) verifyPayment(orderId, bill.bulan);
          else showToast("info", `Pembayaran ${bill.bulan} sedang menunggu. Silakan selesaikan pembayaran Anda.`);
        },
        onError: () => {
          showToast("error", "Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          const orderId = data.order_id;
          if (orderId) verifyPayment(orderId, bill.bulan);
          else loadBills(phone.trim());
        },
      });

      if (!opened) {
        setError("Gagal membuka pembayaran. Pastikan kunci Midtrans sudah benar di .env.local");
      }
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setPayingId(null);
    }
  };

  const completeDemoPay = async () => {
    if (!payTarget) return;
    setPayingId(payTarget.id);
    setError("");
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billId: payTarget.id, metodeBayar: demoMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memproses pembayaran.");
      } else {
        showToast("success", `Pembayaran ${payTarget.bulan} (demo) berhasil! Tagihan sudah lunas.`);
        loadBills(phone.trim());
      }
    } catch {
      setError("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setPayingId(null);
      setPayTarget(null);
    }
  };

  const unpaidBills = bills.filter((b) => b.status === "unpaid" || b.status === "overdue");
  const totalDue = unpaidBills.reduce((s, b) => s + b.tagihan, 0);

  return (
    <>
      <BgScene />
      <Navbar
        links={NAV_LINKS}
        cta={{ label: "Berlangganan", href: "/daftar" }}
      />

      <section className="auth-section">
        <div className="auth-card bil-card">
          <div className="auth-icon">
            <i className="fas fa-file-invoice"></i>
          </div>
          <h2>Cek Tagihan</h2>
          <p className="auth-sub">
            Masukkan nomor WhatsApp yang terdaftar untuk melihat tagihan Anda
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="phone">No. WhatsApp</label>
              <div className="input-wrap">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="phone"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <i className="fas fa-circle-exclamation"></i> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Memeriksa...
                </>
              ) : (
                <>
                  <i className="fas fa-magnifying-glass"></i> Cek Tagihan
                </>
              )}
            </button>
          </form>

          {checked && !error && (
            <div className="bil-result">
              {bills.length === 0 ? (
                <div className="bil-empty">
                  <i className="fas fa-receipt"></i>
                  <p>Tidak ditemukan tagihan untuk nomor tersebut.</p>
                </div>
              ) : (
                <>
                  <div className="bil-customer">
                    <span>Atas Nama</span>
                    <strong>{customer?.namaLengkap || bills[0].customerName}</strong>
                    <em>No. Pelanggan: {customer?.noPelanggan || bills[0].noPelanggan}</em>
                  </div>

                  {totalDue > 0 && (
                    <div className="bil-due">
                      <div>
                        <span>Total Tagihan Belum Lunas</span>
                        <strong>{formatIDR(totalDue)}</strong>
                        <em>{unpaidBills.length} tagihan belum dibayar</em>
                      </div>
                    </div>
                  )}

                  <div className="bil-list">
                    {bills.map((b) => (
                      <div className="bil-item" key={b.id}>
                        <div className="bil-item-top">
                          <span className={`bil-check ${b.status === "paid" ? "checked" : ""}`}>
                            <i className="fa-solid fa-check" />
                          </span>
                          <span className="bil-bulan">{b.bulan}</span>
                          <span className={`bil-pill ${BILL_STATUS[b.status]?.cls}`}>
                            <i className={`fas ${BILL_STATUS[b.status]?.icon}`}></i>{" "}
                            {BILL_STATUS[b.status]?.label}
                          </span>
                        </div>
                        <div className="bil-item-mid">
                          <strong>{formatIDR(b.tagihan)}</strong>
                          <span>Jatuh tempo {b.tanggalJatuhTempo}</span>
                        </div>
                        {b.status === "paid" ? (
                          <div className="bil-item-paid">
                            <i className="fas fa-check-circle"></i> LUNAS · Dibayar {b.tanggalBayar}
                            {b.metodeBayar ? ` · ${b.metodeBayar}` : ""}
                          </div>
                        ) : (
                          <button
                            className="bil-pay-btn"
                            onClick={() => handlePay(b)}
                            disabled={payingId === b.id}
                          >
                            {payingId === b.id ? (
                              <>
                                <i className="fas fa-spinner fa-spin"></i> Memproses...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-shield-halved"></i> Bayar Sekarang
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bil-yape">
                    <i className="fas fa-lock"></i>{" "}
                    Pembayaran diproses aman melalui <strong>Midtrans</strong>.
                  </div>

                  <div className="bil-login">
                    <i className="fas fa-info-circle"></i>{" "}
                    Gunakan halaman ini untuk mengecek tagihan internet Anda.
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {verifying && (
        <div className="bil-verify">
          <i className="fas fa-spinner fa-spin"></i> Memverifikasi pembayaran...
        </div>
      )}

      {toast && (
        <div className={`bil-toast ${toast.type}`}>
          <i
            className={`fas ${
              toast.type === "success"
                ? "fa-circle-check"
                : toast.type === "error"
                  ? "fa-circle-exclamation"
                  : "fa-hourglass-half"
            }`}
          ></i>
          {toast.msg}
        </div>
      )}

      {payTarget && (
        <div className="cms-modal-overlay" onClick={() => setPayTarget(null)}>
          <div className="cms-modal bil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>Bayar via Midtrans (Demo)</h3>
              <button className="cms-modal-close" onClick={() => setPayTarget(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="bil-modal-body">
              <div className="bil-modal-bill">
                <span>Tagihan {payTarget.bulan}</span>
                <strong>{formatIDR(payTarget.tagihan)}</strong>
              </div>
              <p className="bil-modal-note">
                <i className="fas fa-info-circle"></i> Mode demo karena kunci Midtrans
                belum diisi. Pilih metode, lalu konfirmasi untuk menandai tagihan lunas.
              </p>
              <div className="bil-methods">
                {DEMO_METHODS.map((m) => (
                  <button
                    key={m.id}
                    className={`bil-method ${demoMethod === m.id ? "selected" : ""}`}
                    onClick={() => setDemoMethod(m.id)}
                  >
                    <i className={`fas ${m.icon}`} />
                    <span>
                      <strong>{m.label}</strong>
                      <em>{m.desc}</em>
                    </span>
                    <b className={`bil-method-radio${demoMethod === m.id ? " on" : ""}`} />
                  </button>
                ))}
              </div>
              <div className="bil-modal-actions">
                <button className="cms-btn cms-btn-outline" onClick={() => setPayTarget(null)}>
                  Batal
                </button>
                <button
                  className="cms-btn cms-btn-primary"
                  onClick={completeDemoPay}
                  disabled={payingId === payTarget.id}
                >
                  {payingId === payTarget.id ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock" /> Konfirmasi Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterDetail />

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom" style={{ justifyContent: "center" }}>
            <p>&copy; 2026 Dukodu Internet. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </>
  );
}