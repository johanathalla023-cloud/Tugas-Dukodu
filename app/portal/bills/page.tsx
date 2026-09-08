"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatIDR, getCustomerSession } from "@/lib/auth";

interface Bill {
  id: string;
  bulan: string;
  tagihan: number;
  status: "unpaid" | "paid" | "overdue" | "partial";
  tanggalTerbit: string;
  tanggalJatuhTempo: string;
  tanggalBayar?: string;
  metodeBayar?: string;
  jumlahBayar?: number;
}

const BILL_STATUS: Record<string, { icon: string; cls: string; label: string }> = {
  unpaid: { icon: "fa-hourglass", cls: "gold", label: "Belum Dibayar" },
  paid: { icon: "fa-circle-check", cls: "green", label: "Lunas" },
  overdue: { icon: "fa-triangle-exclamation", cls: "red", label: "Terlambat" },
  partial: { icon: "fa-circle-half-stroke", cls: "blue", label: "Sebagian" },
};

export default function PortalBills() {
  const [customer, setCustomer] = useState<any>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) return;
    setCustomer(session);
    const load = async () => {
      try {
        const res = await fetch(`/api/billing?noPelanggan=${session.noPelanggan}`);
        const data = await res.json();
        setBills((data.bills || []).sort((a: Bill, b: Bill) => b.tanggalTerbit.localeCompare(a.tanggalTerbit)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>;
  }

  if (!customer) return null;

  const unpaidBills = bills.filter(b => b.status === "unpaid" || b.status === "overdue");
  const totalDue = unpaidBills.reduce((s, b) => s + b.tagihan, 0);

  return (
    <div className="portal-page">
      <div className="cms-page-head">
        <div>
          <h1>Tagihan Saya</h1>
          <p>Riwayat tagihan layanan internet Anda</p>
        </div>
      </div>

      {totalDue > 0 && (
        <div className="portal-due-banner">
          <div>
            <span>Total yang harus dibayar</span>
            <strong>{formatIDR(totalDue)}</strong>
            <em>{unpaidBills.length} tagihan belum lunas</em>
          </div>
          <Link href="/portal/payment" className="portal-btn portal-btn-primary">
            <i className="fa-solid fa-credit-card" /> Bayar Sekarang
          </Link>
        </div>
      )}

      <div className="portal-card">
        <div className="portal-card-head">
          <h2><i className="fa-solid fa-file-invoice-dollar" /> Riwayat Tagihan</h2>
        </div>
        <div className="portal-table-wrap">
          <table className="cms-table portal-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Terbit</th>
                <th>Jatuh Tempo</th>
                <th>Tagihan</th>
                <th>Status</th>
                <th>Bayar</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.bulan}</strong></td>
                  <td>{b.tanggalTerbit}</td>
                  <td>{b.tanggalJatuhTempo}</td>
                  <td className="cms-money">{formatIDR(b.tagihan)}</td>
                  <td><span className={`cms-pill ${BILL_STATUS[b.status]?.cls}`}><i className={`fa-solid ${BILL_STATUS[b.status]?.icon}`} /> {BILL_STATUS[b.status]?.label}</span></td>
                  <td>
                    {b.status === "paid" ? (
                      <span className="cms-cell-sub">{b.tanggalBayar} · {b.metodeBayar}</span>
                    ) : (
                      <Link href="/portal/payment" className="portal-btn portal-btn-sm portal-btn-primary">Bayar</Link>
                    )}
                  </td>
                </tr>
              ))}
              {bills.length === 0 && <tr><td colSpan={6} className="cms-empty">Belum ada tagihan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}