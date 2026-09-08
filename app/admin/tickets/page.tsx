"use client";

import { useEffect, useState } from "react";

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
  prioritas: "low" | "medium" | "high" | "urgent";
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

const PRIORITY_META: Record<string, { icon: string; cls: string; label: string }> = {
  low: { icon: "fa-arrow-down", cls: "gray", label: "Rendah" },
  medium: { icon: "fa-minus", cls: "blue", label: "Sedang" },
  high: { icon: "fa-arrow-up", cls: "orange", label: "Tinggi" },
  urgent: { icon: "fa-bolt", cls: "red", label: "Penting" },
};

const KATEGORI_META: Record<string, string> = {
  gangguan: "Gangguan",
  tagihan: "Tagihan",
  pasang_baru: "Pasang Baru",
  perubahan_paket: "Perubahan Paket",
  lainnya: "Lainnya",
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const openTicket = (t: Ticket) => {
    setSelected(t);
    setReply("");
  };

  const changeStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast("Status tiket diperbarui");
      const data = await res.json();
      setSelected(data.ticket);
      load();
    }
  };

  const changePriority = async (id: string, prioritas: string) => {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prioritas }),
    });
    if (res.ok) {
      showToast("Prioritas diperbarui");
      const data = await res.json();
      setSelected(data.ticket);
      load();
    }
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    const res = await fetch(`/api/tickets/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply.trim(), sender: "admin", senderName: "Tim Dukodu" }),
    });
    if (res.ok) {
      const data = await res.json();
      setSelected(data.ticket);
      setReply("");
      showToast("Balasan terkirim");
      load();
    }
  };

  const filtered = filter ? tickets.filter(t => t.status === filter) : tickets;

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Tiket Support</h1>
          <p>{tickets.filter(t => t.status === "open" || t.status === "in_progress").length} tiket perlu penanganan</p>
        </div>
      </div>

      <div className="cms-filters">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="cms-select">
          <option value="">Semua Status</option>
          <option value="open">Terbuka</option>
          <option value="in_progress">Diproses</option>
          <option value="resolved">Selesai</option>
          <option value="closed">Ditutup</option>
        </select>
      </div>

      {loading ? (
        <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>
      ) : (
        <div className="cms-table-card">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Pelanggan</th>
                <th>Kategori</th>
                <th>Prioritas</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.subject}</strong><br /><span className="cms-cell-sub">{t.id.toUpperCase().slice(0, 8)}</span></td>
                  <td><strong>{t.customerName}</strong><br /><span className="cms-cell-sub">{t.noPelanggan}</span></td>
                  <td><span className="cms-tag">{KATEGORI_META[t.kategori] || t.kategori}</span></td>
                  <td><span className={`cms-pill ${PRIORITY_META[t.prioritas]?.cls}`}><i className={`fa-solid ${PRIORITY_META[t.prioritas]?.icon}`} /> {PRIORITY_META[t.prioritas]?.label}</span></td>
                  <td><span className={`cms-pill ${STATUS_META[t.status]?.cls}`}><i className={`fa-solid ${STATUS_META[t.status]?.icon}`} /> {STATUS_META[t.status]?.label}</span></td>
                  <td>{t.tanggalDibuat}</td>
                  <td>
                    <button className="cms-icon-btn" onClick={() => openTicket(t)} title="Buka"><i className="fa-solid fa-reply" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="cms-empty">Tidak ada tiket.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="cms-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cms-modal cms-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3><i className="fa-solid fa-headset" /> {selected.subject}</h3>
              <button className="cms-modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark" /></button>
            </div>

            <div className="cms-ticket-meta">
              <span><strong>Dari:</strong> {selected.customerName} ({selected.noPelanggan})</span>
              <span><strong>Kategori:</strong> {KATEGORI_META[selected.kategori]}</span>
              <span><strong>Dibuat:</strong> {selected.tanggalDibuat}</span>
              <label className="cms-ticket-meta-control">
                <strong>Status:</strong>
                <select value={selected.status} onChange={e => changeStatus(selected.id, e.target.value)}>
                  {Object.entries(STATUS_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                </select>
              </label>
              <label className="cms-ticket-meta-control">
                <strong>Prioritas:</strong>
                <select value={selected.prioritas} onChange={e => changePriority(selected.id, e.target.value)}>
                  {Object.entries(PRIORITY_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                </select>
              </label>
            </div>

            <div className="cms-ticket-desc">
              <p>{selected.deskripsi}</p>
            </div>

            <div className="cms-ticket-replies">
              <div className="cms-ticket-thread-head"><i className="fa-solid fa-comments" /> Percakapan</div>
              {selected.replies.length === 0 && <p className="cms-empty-msg">Belum ada balasan.</p>}
              {selected.replies.map(r => (
                <div key={r.id} className={`cms-msg ${r.sender === "admin" ? "admin" : "customer"}`}>
                  <div className="cms-msg-head">
                    <strong>{r.senderName}</strong>
                    <span>{new Date(r.timestamp).toLocaleString("id-ID")}</span>
                  </div>
                  <p>{r.message}</p>
                </div>
              ))}
            </div>

            <div className="cms-ticket-reply-form">
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Tulis balasan untuk pelanggan..." />
              <button className="cms-btn cms-btn-primary" onClick={sendReply} disabled={!reply.trim()}>
                <i className="fa-solid fa-paper-plane" /> Kirim Balasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}