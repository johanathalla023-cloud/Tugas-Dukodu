"use client";

import { useEffect, useState } from "react";

interface Settings {
  id: string;
  logo: string;
  updatedAt: string;
}

interface Photo {
  id: string;
  src: string;
  alt: string;
  icon: string;
  label: string;
  urutan: number;
  status: "active" | "inactive";
}

export default function AdminMedia() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [logoDraft, setLogoDraft] = useState("");
  const [savingLogo, setSavingLogo] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Photo> | null>(null);
  const [toast, setToast] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [siteRes, galleryRes] = await Promise.all([
        fetch("/api/site"),
        fetch("/api/gallery"),
      ]);
      const site = await siteRes.json();
      const gallery = await galleryRes.json();
      if (site.settings) {
        setSettings(site.settings);
        setLogoDraft(site.settings.logo || "");
      }
      setPhotos(gallery.photos || []);
    } catch {
      // abai
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLogo(true);
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: logoDraft }),
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
        showToast("Logo header diperbarui");
      }
    } finally {
      setSavingLogo(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    showToast("Foto dihapus");
    loadAll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/gallery", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      showToast(editing.id ? "Foto diperbarui" : "Foto ditambahkan");
      setShowForm(false);
      setEditing(null);
      loadAll();
    }
  };

  const openNew = () => {
    setEditing({ src: "", alt: "", icon: "fa-image", label: "", urutan: photos.length + 1, status: "active" });
    setShowForm(true);
  };

  const openEdit = (p: Photo) => {
    setEditing({ ...p });
    setShowForm(true);
  };

  return (
    <div className="cms-page">
      {toast && <div className="cms-toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}

      <div className="cms-page-head">
        <div>
          <h1>Media Website</h1>
          <p>Kelola header (logo) dan foto galeri di halaman utama</p>
        </div>
        <div className="cms-page-actions">
          <button className="cms-btn cms-btn-primary" onClick={openNew}>
            <i className="fa-solid fa-plus" /> Tambah Foto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>
      ) : (
        <>
          {/* HEADER / LOGO */}
          <div className="cms-card cms-media-card">
            <div className="cms-card-head">
              <h2><i className="fa-solid fa-image" /> Logo / Header</h2>
            </div>
            <form onSubmit={handleSaveLogo} className="cms-form">
              <div className="cms-form-row">
                <label style={{ flex: 2 }}>
                  URL Logo Header *
                  <input
                    value={logoDraft}
                    onChange={(e) => setLogoDraft(e.target.value)}
                    placeholder="https://...png atau /uploads/logo.png"
                    required
                  />
                </label>
                <label style={{ flex: 1 }}>
                  Terakhir Diperbarui
                  <input value={settings?.updatedAt || "-"} readOnly />
                </label>
              </div>
              <div className="cms-media-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoDraft} alt="Pratinjau logo" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                <p>Pratinjau logo di header website.</p>
              </div>
              <div className="cms-form-actions">
                <button type="submit" className="cms-btn cms-btn-primary" disabled={savingLogo}>
                  <i className="fa-solid fa-floppy-disk" /> {savingLogo ? "Menyimpan..." : "Simpan Logo"}
                </button>
              </div>
            </form>
          </div>

          {/* GALLERY PHOTOS */}
          <div className="cms-card cms-media-card">
            <div className="cms-card-head">
              <h2><i className="fa-solid fa-images" /> Foto Galeri (Hero)</h2>
            </div>

            {showForm && editing && (
              <div className="cms-modal-overlay" onClick={() => setShowForm(false)}>
                <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="cms-modal-head">
                    <h3>{editing.id ? "Edit Foto" : "Tambah Foto Baru"}</h3>
                    <button className="cms-modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="cms-form">
                    <label>URL Foto *<input value={editing.src || ""} onChange={e => setEditing({ ...editing, src: e.target.value })} placeholder="https://...jpg atau /uploads/foto.jpg" required /></label>
                    {editing.src && (
                      <div className="cms-media-preview semantic">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editing.src} alt="Pratinjau" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                      </div>
                    )}
                    <div className="cms-form-row">
                      <label>Label *<input value={editing.label || ""} onChange={e => setEditing({ ...editing, label: e.target.value })} placeholder="Fiber Optik" required /></label>
                      <label>Urutan *<input type="number" min="1" value={editing.urutan ?? 1} onChange={e => setEditing({ ...editing, urutan: parseInt(e.target.value || "1", 10) })} /></label>
                    </div>
                    <div className="cms-form-row">
                      <label>Alt Text *<input value={editing.alt || ""} onChange={e => setEditing({ ...editing, alt: e.target.value })} placeholder="Deskripsi foto" required /></label>
                      <label>Ikon (Font Awesome)<input value={editing.icon || ""} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="fa-bolt" /></label>
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

            <div className="cms-table-card cms-table-card-flat">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Label</th>
                    <th>Urutan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {photos.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="cms-media-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.src} alt={p.alt} onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                          <span>{p.alt}</span>
                        </div>
                      </td>
                      <td><span className="cms-cell-title"><i className={`fas ${p.icon}`} style={{ minWidth: 22 }} /> {p.label}</span></td>
                      <td>{p.urutan}</td>
                      <td>
                        <span className={`cms-pill ${p.status === "active" ? "green" : "gray"}`}>
                          {p.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td>
                        <div className="cms-row-actions">
                          <button className="cms-icon-btn" onClick={() => openEdit(p)} title="Edit"><i className="fa-solid fa-pen" /></button>
                          <button className="cms-icon-btn danger" onClick={() => handleDelete(p.id)} title="Hapus"><i className="fa-solid fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {photos.length === 0 && (
                    <tr><td colSpan={5} className="cms-empty">Belum ada foto galeri.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}