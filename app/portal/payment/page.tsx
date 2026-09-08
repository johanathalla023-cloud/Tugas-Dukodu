"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatIDR, getCustomerSession } from "@/lib/auth";

interface Bill {
  id: string;
  bulan: string;
  tagihan: number;
  status: string;
  tanggalJatuhTempo: string;
}

const PAYMENT_METHODS = [
  { id: "transfer", icon: "fa-landmark", label: "Transfer Bank", desc: "BCA, BNI, Mandiri, BRI" },
  { id: "ewallet", icon: "fa-wallet", label: "E-Wallet", desc: "OVO, GoPay, DANA, ShopeePay" },
  { id: "card", icon: "fa-credit-card", label: "Kartu Kredit", desc: "Visa, Mastercard, JCB" },
  { id: "virtual", icon: "fa-building-columns", label: "Virtual Account", desc: "Bayar via ATM / m-banking" },
];

export default function PortalPayment() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [method, setMethod] = useState("transfer");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) return;
    setCustomer(session);
    const load = async () => {
      try {
        const res = await fetch(`/api/billing?noPelanggan=${session.noPelanggan}`);
        const data = await res.json();
        const unpaid = (data.bills || []).filter((b: Bill) => b.status === "unpaid" || b.status === "overdue");
        setBills(unpaid);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = bills.filter(b => selected.includes(b.id)).reduce((s, b) => s + b.tagihan, 0);

  const toggleBill = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePay = async () => {
    setProcessing(true);
    try {
      const results = [];
      for (const billId of selected) {
        const res = await fetch("/api/billing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ billId, metodeBayar: method }),
        });
        const data = await res.json();
        results.push(data.bill);
      }
      setReceipt({ bills: results, total, method, date: new Date().toISOString().split("T")[0], ref: "DKD-BAY-" + Math.random().toString(36).slice(2, 8).toUpperCase() });
      setStep("done");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>;
  }

  if (!customer) return null;

  if (step === "done" && receipt) {
    return (
      <div className="portal-page portal-pay-done-wrap">
        <div className="portal-pay-done">
          <div className="portal-pay-done-icon"><i className="fa-solid fa-circle-check" /></div>
          <h1>Pembayaran Berhasil!</h1>
          <p>Terima kasih, pembayaran Anda telah kami terima. Bukti pembayaran:</p>

          <div className="portal-receipt">
            <div className="portal-receipt-head">
              <strong>Dukodu Internet</strong>
              <span>No. Referensi: {receipt.ref}</span>
            </div>
            <div className="portal-receipt-body">
              <div className="portal-receipt-row"><span>Pelanggan</span><strong>{customer.noPelanggan} · {customer.namaLengkap}</strong></div>
              <div className="portal-receipt-row"><span>Tanggal</span><strong>{receipt.date}</strong></div>
              <div className="portal-receipt-row"><span>Metode</span><strong>{PAYMENT_METHODS.find(m => m.id === receipt.method)?.label}</strong></div>
              {receipt.bills.map((b: any) => (
                <div className="portal-receipt-row" key={b.id}><span>{b.bulan}</span><strong>{formatIDR(b.tagihan)}</strong></div>
              ))}
              <div className="portal-receipt-total">
                <span>Total Dibayar</span>
                <strong>{formatIDR(receipt.total)}</strong>
              </div>
            </div>
          </div>

          <div className="portal-pay-done-actions">
            <button className="portal-btn portal-btn-primary" onClick={() => { setStep("select"); setReceipt(null); setSelected([]); }}>Bayar Lagi</button>
            <button className="portal-btn portal-btn-outline" onClick={() => router.push("/portal")}>Ke Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="cms-page-head">
        <div>
          <h1>Pembayaran</h1>
          <p>Bayar tagihan internet Anda secara online</p>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="portal-card">
          <div className="portal-states-empty">
            <i className="fa-solid fa-circle-check" />
            <h3>Tidak ada tagihan yang perlu dibayar</h3>
            <p>Semua tagihan Anda sudah lunas. Terima kasih!</p>
            <button className="portal-btn portal-btn-outline" onClick={() => router.push("/portal")}>Kembali ke Dashboard</button>
          </div>
        </div>
      ) : (
        <div className="portal-pay-grid">
          <div>
            <div className="portal-card">
              <div className="portal-card-head">
                <h2><i className="fa-solid fa-file-invoice-dollar" /> Pilih Tagihan</h2>
              </div>
              <div className="portal-select-list">
                {bills.map(b => (
                  <label key={b.id} className={`portal-select-item ${selected.includes(b.id) ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() => toggleBill(b.id)}
                    />
                    <span className="portal-check"><i className="fa-solid fa-check" /></span>
                    <div>
                      <strong>{b.bulan}</strong>
                      <em>Jatuh tempo {b.tanggalJatuhTempo}</em>
                    </div>
                    <span className="portal-select-amount">{formatIDR(b.tagihan)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="portal-card">
              <div className="portal-card-head">
                <h2><i className="fa-solid fa-credit-card" /> Metode Pembayaran</h2>
              </div>
              <div className="portal-method-grid">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    className={`portal-method ${method === m.id ? "selected" : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <i className={`fa-solid ${m.icon}`} />
                    <strong>{m.label}</strong>
                    <em>{m.desc}</em>
                    <span className="portal-method-radio"><span /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="portal-summary">
            <div className="portal-card portal-summary-card">
              <h3>Ringkasan</h3>
              <div className="portal-summary-row"><span>Tagihan dibayar</span><strong>{selected.length} tagihan</strong></div>
              <div className="portal-summary-row"><span>Metode</span><strong>{PAYMENT_METHODS.find(m => m.id === method)?.label}</strong></div>
              <div className="portal-summary-total">
                <span>Total Pembayaran</span>
                <strong>{formatIDR(total)}</strong>
              </div>
              <button
                className="portal-btn portal-btn-primary portal-btn-block portal-btn-lg"
                disabled={selected.length === 0 || processing}
                onClick={() => setStep("confirm")}
              >
                <i className="fa-solid fa-shield-halved" /> Lanjut Pembayaran
              </button>
              <p className="portal-summary-note"><i className="fa-solid fa-lock" /> Pembayaran aman & terenkripsi</p>
            </div>
          </div>
        </div>
      )}

      {step === "confirm" && selected.length > 0 && (
        <div className="cms-modal-overlay" onClick={() => setStep("select")}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>Konfirmasi Pembayaran</h3>
              <button className="cms-modal-close" onClick={() => setStep("select")}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="portal-confirm">
              <div className="portal-confirm-methods">
                <div className={`portal-confirm-icon ${method}`}>
                  <i className={`fa-solid ${PAYMENT_METHODS.find(m => m.id === method)?.icon}`} />
                </div>
                <div>
                  <strong>{PAYMENT_METHODS.find(m => m.id === method)?.label}</strong>
                  <em>Anda akan diarahkan ke halaman pembayaran</em>
                </div>
              </div>
              {bills.filter(b => selected.includes(b.id)).map(b => (
                <div className="portal-confirm-row" key={b.id}>
                  <span>{b.bulan}</span>
                  <strong>{formatIDR(b.tagihan)}</strong>
                </div>
              ))}
              <div className="portal-confirm-total">
                <span>Total</span>
                <strong>{formatIDR(total)}</strong>
              </div>
              <div className="cms-form-actions">
                <button className="cms-btn cms-btn-outline" onClick={() => setStep("select")}>Batal</button>
                <button className="cms-btn cms-btn-primary" onClick={handlePay} disabled={processing}>
                  {processing ? <><i className="fa-solid fa-spinner fa-spin" /> Memproses...</> : <><i className="fa-solid fa-lock" /> Bayar {formatIDR(total)}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}