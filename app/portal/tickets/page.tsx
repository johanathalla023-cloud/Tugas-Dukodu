"use client";

import { useEffect, useState } from "react";
import { getCustomerSession } from "@/lib/auth";

interface Reply {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  message: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  noPelanggan: string;
  customerName: string;
  subject: string;
  kategori: string;
  deskripsi: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  prioritas: string;
  tanggalDibuat: string;
  tanggalDiupdate: string;
  replies: Reply[];
}

const STATUS_META: Record<string, { icon: string; cls: string; label: string }> = {
  open: { icon: "fa-envelope-open", cls: "blue", label: "Terbuka" },
  in_progress: { icon: "fa-gear", cls: "gold", label: "Diproses" },
  resolved: { icon: "fa-circle-check", cls: "green", label: "Selesai" },
  closed: { icon: "fa-circle-xmark", cls: "gray", label: "Ditutup" },
};

const KATEGORI: { id: string; label: string }[] = [
  { id: "gangguan", label: "Gangguan Layanan" },
  { id: "tagihan", label: "Tagihan / Pembayaran" },
  { id: "pasang_baru", label: "Pasang Baru" },
  { id: "perubahan_paket", label: "Perubahan Paket" },
  { id: "lainnya", label: "Lainnya" },
];

export default function PortalTickets() {
  const [customer, setCustomer] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [form, setForm] = useState({ subject: "", kategori: "gangguan", deskripsi: "", prioritas: "medium" });
  const [toast, setToast] = useState("");

  const load = async () => {
    if (!customer) return;
    setLoading(true);
    const res = await fetch(`/api/tickets?noPelanggan=${customer.noPelanggan}`);
    const data = await res.json();
    setTickets((data.tickets || []).sort((a: Ticket, b: Ticket) => b.tanggalDibuat.localeCompare(a.tanggalDibuat)));
    setLoading(false);
  };

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) return;
    setCustomer(session);
  }, []);

  useEffect(() => {
    if (customer) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noPelanggan: customer.noPelanggan,
        customerName: customer.namaLengkap,
        ...form,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ subject: "", kategori: "gangguan", deskripsi: "", prioritas: "medium" });
      showToast("Tiket berhasil dibuat. Tim kami akan segera merespons.");
      load();
    }
  };

  const sendReply = async () => {
    if (!openTicket || !reply.trim()) return;
    const res = await fetch(`/api/tickets/${openTicket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: reply.trim(),
        sender: "customer",
        senderName: customer?.namaLengkap,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOpenTicket(data.ticket);
      setReply("");
      load();
    }
  };

  if (loading && !tickets.length) {
    return <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>;
  }

  return (
    <div className="portal-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Tiket Support</h1>
          <p>Butuh bantuan? Buat tiket dan tim kami akan menghubungi Anda.</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={() => setShowForm(true)}>
          <i className="fa-solid fa-plus" /> Buat Tiket
        </button>
      </div>

      {showForm && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>Buat Tiket Baru</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={createTicket} className="cms-form">
              <label>Judul Masalah *<input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Contoh: Internet terputus sejak tadi malam" required /></label>
              <div className="cms-form-row">
                <label>Kategori
                  <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                    {KATEGORI.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
                  </select>
                </label>
                <label>Prioritas
                  <select value={form.prioritas} onChange={e => setForm({ ...form, prioritas: e.target.value })}>
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Sangat Penting</option>
                  </select>
                </label>
              </div>
              <label>Deskripsi Masalah *
                <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={5} required
                  placeholder="Jelaskan masalah Anda secara detail, termasuk sejak kapan terjadi, apa yang sudah dicoba, dsb." />
              </label>
              <div className="cms-form-actions">
                <button type="button" className="cms-btn cms-btn-outline" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="cms-btn cms-btn-primary" disabled={!form.subject || !form.deskripsi}>
                  <i className="fa-solid fa-paper-plane" /> Kirim Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="portal-card">
          <div className="portal-states-empty">
            <i className="fa-solid fa-headset" />
            <h3>Belum ada tiket</h3>
            <p>Jika Anda mengalami masalah, buat tiket support agar tim kami dapat membantu Anda.</p>
            <button className="portal-btn portal-btn-primary" onClick={() => setShowForm(true)}>
              <i className="fa-solid fa-plus" /> Buat Tiket Pertama
            </button>
          </div>
        </div>
      ) : (
        <div className="portal-ticket-cards">
          {tickets.map(t => (
            <div key={t.id} className="portal-ticket-card" onClick={() => setOpenTicket(t)}>
              <div className="portal-ticket-card-head">
                <span className={`portal-pill ${STATUS_META[t.status]?.cls}`}>{STATUS_META[t.status]?.label}</span>
                <span className="portal-pill gray">{KATEGORI.find(k => k.id === t.kategori)?.label}</span>
              </div>
              <h3>{t.subject}</h3>
              <p>{t.deskripsi}</p>
              <div className="portal-ticket-card-foot">
                <span><i className="fa-solid fa-calendar" /> {t.tanggalDibuat}</span>
                <span>{t.replies.length} balasan</span>
                <span className="portal-ticket-open"><i className="fa-solid fa-chevron-right" /></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {openTicket && (
        <div className="cms-modal-overlay" onClick={() => setOpenTicket(null)}>
          <div className="cms-modal cms-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{openTicket.subject}</h3>
              <button className="cms-modal-close" onClick={() => setOpenTicket(null)}><i className="fa-solid fa-xmark" /></button>
            </div>

            <div className="cms-ticket-meta">
              <span><span className={`portal-pill ${STATUS_META[openTicket.status]?.cls}`}>{STATUS_META[openTicket.status]?.label}</span></span>
              <span><strong>No. Tiket:</strong> {openTicket.id.toUpperCase().slice(0, 8)}</span>
              <span><strong>Dibuat:</strong> {openTicket.tanggalDibuat}</span>
            </div>

            <div className="cms-ticket-desc">
              <p>{openTicket.deskripsi}</p>
            </div>

            <div className="cms-ticket-replies">
              <div className="cms-ticket-thread-head"><i className="fa-solid fa-comments" /> Percakapan</div>
              {openTicket.replies.length === 0 && <p className="cms-empty-msg">Belum ada balasan dari tim kami. Silakan tunggu, kami akan segera merespons.</p>}
              {openTicket.replies.map(r => (
                <div key={r.id} className={`cms-msg ${r.sender === "admin" ? "admin" : "customer"}`}>
                  <div className="cms-msg-head">
                    <strong>{r.senderName}</strong>
                    <span>{new Date(r.timestamp).toLocaleString("id-ID")}</span>
                  </div>
                  <p>{r.message}</p>
                </div>
              ))}
            </div>

            {openTicket.status !== "closed" && openTicket.status !== "resolved" && (
              <div className="cms-ticket-reply-form">
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Tulis tanggapan Anda..." />
                <button className="cms-btn cms-btn-primary" onClick={sendReply} disabled={!reply.trim()}>
                  <i className="fa-solid fa-paper-plane" /> Kirim Balasan
                </button>
              </div>
            )}

            {(openTicket.status === "closed" || openTicket.status === "resolved") && (
              <p className="portal-closed-note"><i className="fa-solid fa-lock" /> Tiket ini sudah {STATUS_META[openTicket.status]?.label.toLowerCase()}. Jika masih butuh bantuan, silakan buat tiket baru.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}