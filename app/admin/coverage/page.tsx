"use client";

import { useEffect, useState } from "react";
import CmsCoverageMap from "@/components/CmsCoverageMap";

interface CoverageArea {
  id: string;
  nama: string;
  lokasi: string;
  lat: number;
  lng: number;
  radius: number;
  kecepatanMax: number;
  status: "active" | "inactive";
  tanggalDibuat: string;
}

export default function AdminCoverage() {
  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<CoverageArea>>({});
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [mapKey, setMapKey] = useState(0);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/coverage");
    const data = await res.json();
    setAreas(data.areas || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.lokasi || form.lat == null || form.lng == null) {
      showToast("Lengkapi semua data area");
      return;
    }
    const res = await fetch("/api/coverage/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      showToast(form.id ? "Area diperbarui" : "Area ditambahkan");
      setShowForm(false);
      setForm({});
      setMapKey(k => k + 1);
      load();
    } else {
      const d = await res.json();
      showToast(d.error || "Gagal menyimpan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus area ini?")) return;
    await fetch(`/api/coverage/manage?id=${id}`, { method: "DELETE" });
    showToast("Area dihapus");
    setMapKey(k => k + 1);
    load();
  };

  const toggleStatus = async (area: CoverageArea) => {
    const res = await fetch("/api/coverage/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...area, status: area.status === "active" ? "inactive" : "active" }),
    });
    if (res.ok) {
      showToast(`Area ${area.status === "active" ? "dinonaktifkan" : "diaktifkan"}`);
      setMapKey(k => k + 1);
      load();
    }
  };

  const openNew = () => {
    setForm({ nama: "", lokasi: "", lat: -6.25, lng: 106.825, radius: 1, kecepatanMax: 50, status: "active" });
    setShowForm(true);
  };

  const openEdit = (a: CoverageArea) => {
    setForm({ ...a });
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Coverage Map</h1>
          <p>{areas.filter(a => a.status === "active").length} area aktif</p>
        </div>
        <button className="cms-btn cms-btn-primary" onClick={openNew}>
          <i className="fa-solid fa-location-plus" /> Tambah Area
        </button>
      </div>

      <div className="cms-map-wrap">
        <CmsCoverageMap areas={areas} refreshKey={mapKey} />
      </div>

      {showForm && (
        <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-head">
              <h3>{form.id ? "Edit Area" : "Tambah Area Baru"}</h3>
              <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="cms-form">
              <div className="cms-form-row">
                <label>Nama Area *<input value={form.nama || ""} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Dukodu Blok B" required /></label>
                <label>Lokasi *<input value={form.lokasi || ""} onChange={e => setForm({ ...form, lokasi: e.target.value })} placeholder="Kecamatan, Kota" required /></label>
              </div>
              <div className="cms-form-row">
                <label>Latitude *<input type="number" step="any" value={form.lat ?? ""} onChange={e => setForm({ ...form, lat: Number(e.target.value) })} required /></label>
                <label>Longitude *<input type="number" step="any" value={form.lng ?? ""} onChange={e => setForm({ ...form, lng: Number(e.target.value) })} required /></label>
              </div>
              <div className="cms-form-row">
                <label>Radius (km) *<input type="number" step="0.1" value={form.radius ?? 1} onChange={e => setForm({ ...form, radius: Number(e.target.value) })} required /></label>
                <label>Kecepatan Maks (Mbps) *<input type="number" min={1} max={1000} value={form.kecepatanMax ?? 50} onChange={e => setForm({ ...form, kecepatanMax: Number(e.target.value) })} required /></label>
              </div>
              <label>Status
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </label>
              <div className="cms-form-actions">
                <button type="button" className="cms-btn cms-btn-outline" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="cms-btn cms-btn-primary">{form.id ? "Simpan" : "Tambahkan"}</button>
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
                <th>Area</th>
                <th>Koordinat</th>
                <th>Radius</th>
                <th>Kecepatan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {areas.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.nama}</strong><br /><span className="cms-cell-sub">{a.lokasi}</span></td>
                  <td className="cms-cell-sub">{a.lat.toFixed(4)}, {a.lng.toFixed(4)}</td>
                  <td>{a.radius} km</td>
                  <td><strong>{a.kecepatanMax} Mbps</strong></td>
                  <td>
                    <button className={`cms-pill ${a.status === "active" ? "green" : "gray"} cms-pill-btn`} onClick={() => toggleStatus(a)}>
                      <i className={`fa-solid ${a.status === "active" ? "fa-check" : "fa-ban"}`} /> {a.status === "active" ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td>
                    <div className="cms-row-actions">
                      <button className="cms-icon-btn" onClick={() => openEdit(a)} title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button className="cms-icon-btn danger" onClick={() => handleDelete(a.id)} title="Hapus"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}