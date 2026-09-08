"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatIDR, getCustomerSession } from "@/lib/auth";

interface Pkg { id: string; nama: string; kecepatan: string; harga: number; }
interface Ticket { id: string; subject: string; status: string; kategori: string; tanggalDibuat: string; }
interface Bill { id: string; bulan: string; tagihan: number; status: string; tanggalTerbit: string; tanggalJatuhTempo: string; tanggalBayar?: string; }

const TICKET_STATUS: Record<string, { icon: string; cls: string; label: string }> = {
  open: { icon: "fa-envelope-open", cls: "blue", label: "Terbuka" },
  in_progress: { icon: "fa-gear", cls: "gold", label: "Diproses" },
  resolved: { icon: "fa-circle-check", cls: "green", label: "Selesai" },
  closed: { icon: "fa-circle-xmark", cls: "gray", label: "Ditutup" },
};

export default function PortalDashboard() {
  const [customer, setCustomer] = useState<any>(null);
  const [paket, setPaket] = useState<Pkg | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) return;
    setCustomer(session);
    const load = async () => {
      try {
        const res = await fetch(`/api/customers/${session.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setPaket(data.paket);
        setBills(data.bills || []);
        setTickets(data.tickets || []);
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

  const unpaid = bills.filter(b => b.status === "unpaid" || b.status === "overdue");
  const totalDue = unpaid.reduce((s, b) => s + b.tagihan, 0);
  const unpaidCount = unpaid.length;
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const latestBill = bills.length ? bills[0] : null;
  const paidCount = bills.filter(b => b.status === "paid").length;

  return (
    <div className="portal-page">
      <div className="portal-hello">
        <h1>Halo, {customer.namaLengkap.split(" ")[0]}! 👋</h1>
        <p>Selamat datang di portal pelanggan Dukodu. Kelola tagihan, lakukan pembayaran, dan hubungi tim support kami dengan mudah.</p>
      </div>

      <div className="portal-overview">
        <div className="portal-ov-count">
          <span className="portal-ov-badge red"><i className="fa-solid fa-file-invoice-dollar" /></span>
          <div>
            <strong>{formatIDR(totalDue)}</strong>
            <em>{unpaidCount > 0 ? `${unpaidCount} tagihan belum dibayar` : "Semua tagihan lunas"}</em>
          </div>
        </div>
        <div className="portal-ov-count">
          <span className="portal-ov-badge gold"><i className="fa-solid fa-ticket" /></span>
          <div>
            <strong>{openTickets}</strong>
            <em>{openTickets > 0 ? "tiket aktif" : "tidak ada tiket aktif"}</em>
          </div>
        </div>
        <div className="portal-ov-count">
          <span className="portal-ov-badge green"><i className="fa-solid fa-satellite-dish" /></span>
          <div>
            <strong>{paket ? paket.kecepatan : "-"}</strong>
            <em>{paket ? paket.nama : "Belum ada paket"}</em>
          </div>
        </div>
      </div>

      {customer.status === "pending" && (
        <div className="portal-notice">
          <i className="fa-solid fa-hourglass-half" />
          <div>
            <strong>Menunggu Instalasi</strong>
            <p>Terima kasih sudah mendaftar! Tim Dukodu akan menghubungi Anda untuk menjadwalkan instalasi dalam 1x24 jam kerja.</p>
          </div>
        </div>
      )}

      <div className="portal-grid">
        <div className="portal-card">
          <div className="portal-card-head">
            <h2><i className="fa-solid fa-file-invoice-dollar" /> Tagihan Terbaru</h2>
            <Link href="/portal/bills" className="portal-link">Lihat semua <i className="fa-solid fa-arrow-right" /></Link>
          </div>
          {latestBill ? (
            <div className="portal-bill-highlight">
              <div className="portal-bill-period">
                <span>Periode &nbsp;{latestBill.bulan}</span>
                <span className={`portal-pill ${latestBill.status === "paid" ? "green" : latestBill.status === "overdue" ? "red" : "gold"}`}>
                  {latestBill.status === "paid" ? "LUNAS" : latestBill.status === "overdue" ? "TERLAMBAT" : "BELUM BAYAR"}
                </span>
              </div>
              <div className="portal-bill-amount">{formatIDR(latestBill.tagihan)}</div>
              <p>Jatuh tempo: {latestBill.tanggalJatuhTempo}</p>
              {latestBill.status !== "paid" ? (
                <Link href="/portal/payment" className="portal-btn portal-btn-primary">
                  <i className="fa-solid fa-credit-card" /> Bayar Sekarang
                </Link>
              ) : (
                <p className="portal-paid-note"><i className="fa-solid fa-circle-check" /> Dibayar {latestBill.tanggalBayar}</p>
              )}
            </div>
          ) : (
            <p className="portal-empty-msg">Belum ada tagihan.</p>
          )}
        </div>

        <div className="portal-card">
          <div className="portal-card-head">
            <h2><i className="fa-solid fa-headset" /> Tiket Support Terbaru</h2>
            <Link href="/portal/tickets" className="portal-link">Kelola <i className="fa-solid fa-arrow-right" /></Link>
          </div>
          {tickets.length > 0 ? (
            <div className="portal-ticket-list">
              {tickets.slice(0, 3).map(t => (
                <Link href="/portal/tickets" key={t.id} className="portal-ticket-item">
                  <span className={`portal-pill ${TICKET_STATUS[t.status]?.cls}`}>{TICKET_STATUS[t.status]?.label}</span>
                  <div>
                    <strong>{t.subject}</strong>
                    <em>{t.tanggalDibuat}</em>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="portal-empty-msg">Belum ada tiket. <Link href="/portal/tickets" className="portal-link">Buat tiket baru</Link></p>
          )}
          <Link href="/portal/tickets" className="portal-btn portal-btn-outline portal-btn-block">
            <i className="fa-solid fa-plus" /> Buat Tiket Baru
          </Link>
        </div>
      </div>

      <div className="portal-card portal-profile-card">
        <div className="portal-card-head">
          <h2><i className="fa-solid fa-user" /> Profil & Paket Saya</h2>
        </div>
        <div className="portal-profile-grid">
          <div><label>No. Pelanggan</label><strong>{customer.noPelanggan}</strong></div>
          <div><label>Nama</label><strong>{customer.namaLengkap}</strong></div>
          <div><label>Email</label><strong>{customer.email}</strong></div>
          <div><label>No. WhatsApp</label><strong>{customer.noWhatsApp}</strong></div>
          <div><label>Paket</label><strong>{paket ? `${paket.nama} (${paket.kecepatan})` : "-"}</strong></div>
          <div><label>Status Layanan</label><strong>{customer.status === "active" ? "Aktif" : customer.status === "pending" ? "Menunggu Pasang" : "Terhenti"}</strong></div>
        </div>
      </div>
    </div>
  );
}