"use client";

import { useEffect, useState } from "react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  urutan: number;
  status: "active" | "inactive";
}

export default function AdminFaqs() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setItems(data.faqs || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus FAQ ini?")) return;
    await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
    showToast("FAQ dihapus");
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/faqs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      showToast(editing.id ? "FAQ diperbarui" : "FAQ ditambahkan");
      setShowForm(false);
      setEditing(null);
      load();
    }
  };

  const openNew = () => {
    setEditing({ question: "", answer: "", urutan: items.length + 1, status: "active" });
    setShowForm(true);
  };

  const openEdit = (f: Faq) => {
    setEditing({ ...f });
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>FAQ</h1>
          <p>Kelola pertanyaan umum di halaman utama</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Tambah FAQ
        </button>
      </div>

      {showForm && editing && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{editing.id ? "Edit FAQ" : "Tambah FAQ Baru"}</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="cms-form">
              <label>Pertanyaan *<input value={editing.question || ""} onChange={e => setEditing({ ...editing, question: e.target.value })} required /></label>
              <label>Jawaban *<textarea value={editing.answer || ""} onChange={e => setEditing({ ...editing, answer: e.target.value })} rows={4} placeholder="Jawaban lengkap..." required /></label>
              <div className="cms-form-row">
                <label>Urutan *<input type="number" min="1" value={editing.urutan ?? 1} onChange={e => setEditing({ ...editing, urutan: parseInt(e.target.value || "1", 10) })} /></label>
                <label>Status
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as any })}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </label>
              </div>
              <div className="cms-form-actions">
                <button type="button" className="cms-btn cms-btn-outline" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="cms-btn cms-btn-primary">{editing.id ? "Simpan" : "Tambahkan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>
      ) : (
        <div className="cms-table-card">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Urutan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map(f => (
                <tr key={f.id}>
                  <td>
                    <div className="cms-cell-title">{f.question}</div>
                  </td>
                  <td><span className="cms-cell-sub">{f.answer.length > 90 ? f.answer.slice(0, 90) + "..." : f.answer}</span></td>
                  <td>{f.urutan}</td>
                  <td>
                    <span className={`cms-pill ${f.status === "active" ? "green" : "gray"}`}>
                      {f.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button className="cms-icon-btn" onClick={() => openEdit(f)} title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button className="cms-icon-btn danger" onClick={() => handleDelete(f.id)} title="Hapus"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="cms-empty">Belum ada FAQ.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}