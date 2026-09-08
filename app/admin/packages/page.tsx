"use client";

import { useEffect, useState } from "react";
import { formatIDR } from "@/lib/auth";

interface Package {
  id: string;
  nama: string;
  kecepatan: string;
  harga: number;
  deskripsi: string;
  fitur: string[];
  status: "active" | "inactive";
  popular: boolean;
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Package> | null>(null);
  const [fiturText, setFiturText] = useState("");
  const [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/packages");
    const data = await res.json();
    setPackages(data.packages || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus paket ini? Pelanggan yang berlangganan akan kehilangan referensi paket.")) return;
    await fetch(`/api/packages?id=${id}`, { method: "DELETE" });
    showToast("Paket dihapus");
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      fitur: fiturText.split("\n").map(f => f.trim()).filter(Boolean),
      harga: Number(editing.harga),
    };
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/packages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      showToast(editing.id ? "Paket diperbarui" : "Paket ditambahkan");
      setShowForm(false);
      setEditing(null);
      load();
    }
  };

  const openNew = () => {
    setEditing({ nama: "", kecepatan: "", harga: 0, deskripsi: "", fitur: [], status: "active", popular: false });
    setFiturText("");
    setShowForm(true);
  };

  const openEdit = (pkg: Package) => {
    setEditing({ ...pkg });
    setFiturText(pkg.fitur.join("\n"));
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Paket Internet</h1>
          <p>Kelola paket yang ditawarkan ke pelanggan</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Tambah Paket
        </button>
      </div>

      {showForm && editing && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{editing.id ? "Edit Paket" : "Tambah Paket Baru"}</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="cms-form">
              <div className="cms-form-row">
                <label>Nama Paket *<input value={editing.nama || ""} onChange={e => setEditing({ ...editing, nama: e.target.value })} required /></label>
                <label>Kecepatan *<input value={editing.kecepatan || ""} onChange={e => setEditing({ ...editing, kecepatan: e.target.value })} placeholder="50 Mbps" required /></label>
              </div>
              <div className="cms-form-row">
                <label>Harga *<div className="cms-money-input"><span className="cms-money-prefix">Rp</span><input type="text" inputMode="numeric" value={editing.harga ? editing.harga.toLocaleString("id-ID") : ""} onChange={e => setEditing({ ...editing, harga: parseInt(e.target.value.replace(/\D/g, "") || "0", 10) })} placeholder="0" required /></div></label>
                <label>Status
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as any })}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </label>
              </div>
              <label>Deskripsi<textarea value={editing.deskripsi || ""} onChange={e => setEditing({ ...editing, deskripsi: e.target.value })} rows={2} placeholder="Deskripsi singkat paket" /></label>
              <label>Fitur (satu per baris)<textarea value={fiturText} onChange={e => setFiturText(e.target.value)} rows={4} placeholder={"Unlimited quota\nWiFi router\nFree instalasi"} /></label>
              <label className="cms-check-inline">
                <input type="checkbox" checked={editing.popular || false} onChange={e => setEditing({ ...editing, popular: e.target.checked })} />
                Tandai sebagai paket populer
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
                <th>Paket</th>
                <th>Kecepatan</th>
                <th>Harga</th>
                <th>Fitur</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    <div className="cms-cell-title">
                      {pkg.nama}
                      {pkg.popular && <span className="cms-popular-badge">POPULER</span>}
                    </div>
                    <span className="cms-cell-sub">{pkg.deskripsi}</span>
                  </td>
                  <td><strong>{pkg.kecepatan}</strong></td>
                  <td className="cms-money">{formatIDR(pkg.harga)}<span className="cms-cell-sub">/bulan</span></td>
                  <td>
                    <div className="cms-tag-list">
                      {pkg.fitur.slice(0, 3).map((f, i) => <span key={i} className="cms-tag">{f}</span>)}
                      {pkg.fitur.length > 3 && <span className="cms-tag more">+{pkg.fitur.length - 3}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`cms-pill ${pkg.status === "active" ? "green" : "gray"}`}>
                      {pkg.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button className="cms-icon-btn" onClick={() => openEdit(pkg)} title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button className="cms-icon-btn danger" onClick={() => handleDelete(pkg.id)} title="Hapus"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr><td colSpan={6} className="cms-empty">Belum ada paket.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}