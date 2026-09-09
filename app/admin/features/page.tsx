"use client";

import { useEffect, useState } from "react";

interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
  urutan: number;
  status: "active" | "inactive";
}

export default function AdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Feature> | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/features");
    const data = await res.json();
    setFeatures(data.features || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus keunggulan ini?")) return;
    await fetch(`/api/features?id=${id}`, { method: "DELETE" });
    showToast("Keunggulan dihapus");
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/features", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      showToast(editing.id ? "Keunggulan diperbarui" : "Keunggulan ditambahkan");
      setShowForm(false);
      setEditing(null);
      load();
    }
  };

  const openNew = () => {
    setEditing({ icon: "fas fa-star", title: "", desc: "", urutan: features.length + 1, status: "active" });
    setShowForm(true);
  };

  const openEdit = (f: Feature) => {
    setEditing({ ...f });
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Keunggulan Dukodu</h1>
          <p>Kelola keunggulan yang tampil di halaman utama</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Tambah Keunggulan
        </button>
      </div>

      {showForm && editing && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{editing.id ? "Edit Keunggulan" : "Tambah Keunggulan Baru"}</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="cms-form">
              <div className="cms-form-row">
                <label>Judul *<input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} required /></label>
                <label>Urutan *<input type="number" min="1" value={editing.urutan ?? 1} onChange={e => setEditing({ ...editing, urutan: parseInt(e.target.value || "1", 10) })} /></label>
              </div>
              <label>Ikon (class Font Awesome) *<input value={editing.icon || ""} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="fas fa-bolt" required /></label>
              <label>Deskripsi *<textarea value={editing.desc || ""} onChange={e => setEditing({ ...editing, desc: e.target.value })} rows={3} placeholder="Penjelasan singkat keunggulan" required /></label>
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
                <th>Keunggulan</th>
                <th>Deskripsi</th>
                <th>Urutan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {features.map(f => (
                <tr key={f.id}>
                  <td>
                    <div className="cms-cell-title">
                      <i className={`${f.icon} cms-feature-icon`} style={{ minWidth: 22 }} />
                      {f.title}
                    </div>
                  </td>
                  <td><span className="cms-cell-sub">{f.desc}</span></td>
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
              {features.length === 0 && (
                <tr><td colSpan={5} className="cms-empty">Belum ada keunggulan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}