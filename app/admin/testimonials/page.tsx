"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  text: string;
  name: string;
  title: string;
  initials: string;
  urutan: number;
  status: "active" | "inactive";
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setItems(data.testimonials || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const makeInitials = (name: string) =>
    name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    showToast("Testimoni dihapus");
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = { ...editing, initials: editing.initials || makeInitials(editing.name || "") };
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      showToast(editing.id ? "Testimoni diperbarui" : "Testimoni ditambahkan");
      setShowForm(false);
      setEditing(null);
      load();
    }
  };

  const openNew = () => {
    setEditing({ text: "", name: "", title: "", initials: "", urutan: items.length + 1, status: "active" });
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing({ ...t });
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Apa Kata Mereka</h1>
          <p>Kelola testimoni pelanggan di halaman utama</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Tambah Testimoni
        </button>
      </div>

      {showForm && editing && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{editing.id ? "Edit Testimoni" : "Tambah Testimoni Baru"}</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="cms-form">
              <label>Isi Testimoni *<textarea value={editing.text || ""} onChange={e => setEditing({ ...editing, text: e.target.value })} rows={4} placeholder="Kutipan kata-kata pelanggan..." required /></label>
              <div className="cms-form-row">
                <label>Nama *<input value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} required /></label>
                <label>Inisial<input value={editing.initials || ""} onChange={e => setEditing({ ...editing, initials: e.target.value })} placeholder="Otomatis dari nama" maxLength={3} /></label>
              </div>
              <div className="cms-form-row">
                <label>Pekerjaan/Peran<input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Freelancer" /></label>
                <label>Urutan *<input type="number" min="1" value={editing.urutan ?? 1} onChange={e => setEditing({ ...editing, urutan: parseInt(e.target.value || "1", 10) })} /></label>
              </div>
              <label>Status
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as any })}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </label>
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
                <th>Testimoni</th>
                <th>Nama</th>
                <th>Urutan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="cms-cell-title">{t.name}</div>
                    <span className="cms-cell-sub">{t.text.slice(0, 90)}{t.text.length > 90 ? "..." : ""}</span>
                  </td>
                  <td>
                    <div className="cms-cell-title">{t.name}</div>
                    <span className="cms-cell-sub">{t.title} · {t.initials}</span>
                  </td>
                  <td>{t.urutan}</td>
                  <td>
                    <span className={`cms-pill ${t.status === "active" ? "green" : "gray"}`}>
                      {t.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button className="cms-icon-btn" onClick={() => openEdit(t)} title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button className="cms-icon-btn danger" onClick={() => handleDelete(t.id)} title="Hapus"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="cms-empty">Belum ada testimoni.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}