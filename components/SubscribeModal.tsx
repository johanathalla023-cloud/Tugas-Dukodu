"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;

type FormData = {
  address: string;
  city: string;
  district: string;
  package: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const PACKAGES = [
  {
    id: "hemat",
    name: "Paket Hemat",
    speed: "30 Mbps",
    price: "175",
    features: ["Instalasi Gratis", "Router Gratis", "Support 24/7"],
  },
  {
    id: "utama",
    name: "Paket Utama",
    speed: "50 Mbps",
    price: "199",
    popular: true,
    features: ["Instalasi Gratis", "Router Premium", "Support Prioritas", "Garansi 2 Tahun"],
  },
  {
    id: "premium",
    name: "Paket Premium",
    speed: "100 Mbps",
    price: "599",
    features: ["Instalasi + Training", "Router Ultra Premium", "Support VIP 24/7", "Garansi 3 Tahun"],
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SubscribeModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    address: "",
    city: "",
    district: "",
    package: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};

    if (step === 1) {
      if (!formData.address.trim()) e.address = "Alamat wajib diisi";
      if (!formData.city.trim()) e.city = "Kota/Kabupaten wajib diisi";
      if (!formData.district.trim()) e.district = "Kecamatan wajib diisi";
    } else if (step === 2) {
      if (!formData.package) e.package = "Pilih salah satu paket";
    } else if (step === 3) {
      if (!formData.fullName.trim()) e.fullName = "Nama lengkap wajib diisi";
      if (!formData.email.trim()) {
        e.email = "Email wajib diisi";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        e.email = "Format email tidak valid";
      }
      if (!formData.phone.trim()) {
        e.phone = "No. WhatsApp wajib diisi";
      } else if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(formData.phone.replace(/\s/g, ""))) {
        e.phone = "Format nomor WhatsApp tidak valid";
      }
      if (!formData.password.trim()) {
        e.password = "Password wajib diisi";
      } else if (formData.password.length < 8) {
        e.password = "Password minimal 8 karakter";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 3) as Step);
    }
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 1) as Step);
  };

  const submit = () => {
    if (validateStep()) {
      setSubmitted(true);
    }
  };

  const close = () => {
    setStep(1);
    setFormData({ address: "", city: "", district: "", package: "", fullName: "", email: "", phone: "", password: "" });
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  const selectedPkg = PACKAGES.find((p) => p.id === formData.package);

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Tutup">
          <i className="fas fa-xmark"></i>
        </button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <i className="fas fa-check"></i>
            </div>
            <h3>Pendaftaran Berhasil!</h3>
            <p>
              Terima kasih <strong>{formData.fullName}</strong>. Tim Dukodu akan
              menghubungi Anda via WhatsApp dalam 1×24 jam untuk konfirmasi
              pemasangan.
            </p>
            <button className="btn btn-primary modal-success-btn" onClick={close}>
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h2>Berlangganan Sekarang!</h2>
              <p>Lengkapi data berikut untuk memulai langganan Dukodu</p>
            </div>

            {/* Steps Indicator */}
            <div className="modal-steps">
              <div className={`modal-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
                <div className="step-circle">
                  {step > 1 ? <i className="fas fa-check"></i> : "1"}
                </div>
                <span>Lokasi</span>
              </div>
              <div className="step-line"></div>
              <div className={`modal-step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
                <div className="step-circle">
                  {step > 2 ? <i className="fas fa-check"></i> : "2"}
                </div>
                <span>Paket</span>
              </div>
              <div className="step-line"></div>
              <div className={`modal-step ${step >= 3 ? "active" : ""}`}>
                <div className="step-circle">3</div>
                <span>Data Diri</span>
              </div>
            </div>

            {/* Step 1: Lokasi */}
            {step === 1 && (
              <div className="modal-form">
                <div className="modal-form-group">
                  <label>Alamat Lengkap</label>
                  <div className="modal-input-wrap">
                    <i className="fas fa-location-dot"></i>
                    <input
                      type="text"
                      placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 02"
                      value={formData.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </div>
                  {errors.address && <span className="modal-error">{errors.address}</span>}
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Kota / Kabupaten</label>
                    <div className="modal-input-wrap">
                      <i className="fas fa-city"></i>
                      <input
                        type="text"
                        placeholder="Contoh: Depok"
                        value={formData.city}
                        onChange={(e) => update("city", e.target.value)}
                      />
                    </div>
                    {errors.city && <span className="modal-error">{errors.city}</span>}
                  </div>
                  <div className="modal-form-group">
                    <label>Kecamatan</label>
                    <div className="modal-input-wrap">
                      <i className="fas fa-map"></i>
                      <input
                        type="text"
                        placeholder="Contoh: Beji"
                        value={formData.district}
                        onChange={(e) => update("district", e.target.value)}
                      />
                    </div>
                    {errors.district && <span className="modal-error">{errors.district}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Paket */}
            {step === 2 && (
              <div className="modal-form">
                <div className="modal-packages">
                  {PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`modal-pkg-card${formData.package === pkg.id ? " selected" : ""}${pkg.popular ? " popular" : ""}`}
                      onClick={() => update("package", pkg.id)}
                    >
                      {pkg.popular && <div className="modal-pkg-badge">POPULER</div>}
                      <div className="modal-pkg-name">{pkg.name}</div>
                      <div className="modal-pkg-speed">
                        <i className="fas fa-bolt"></i> {pkg.speed}
                      </div>
                      <div className="modal-pkg-price">
                        <span>Rp {pkg.price}.000</span>
                        <span className="modal-pkg-period">/bulan</span>
                      </div>
                      <div className="modal-pkg-features">
                        {pkg.features.map((f) => (
                          <div key={f} className="modal-pkg-feature">
                            <i className="fas fa-check"></i> {f}
                          </div>
                        ))}
                      </div>
                      <div className="modal-pkg-radio">
                        <div className={`radio-circle${formData.package === pkg.id ? " checked" : ""}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.package && <span className="modal-error" style={{ textAlign: "center" }}>{errors.package}</span>}
              </div>
            )}

            {/* Step 3: Data Diri */}
            {step === 3 && (
              <div className="modal-form">
                {selectedPkg && (
                  <div className="modal-summary">
                    <div className="modal-summary-label">Paket yang dipilih</div>
                    <div className="modal-summary-value">
                      <i className="fas fa-bolt"></i> {selectedPkg.name} — {selectedPkg.speed} — Rp {selectedPkg.price}.000/bulan
                    </div>
                  </div>
                )}
                <div className="modal-form-group">
                  <label>Nama Lengkap</label>
                  <div className="modal-input-wrap">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                  </div>
                  {errors.fullName && <span className="modal-error">{errors.fullName}</span>}
                </div>
                <div className="modal-form-group">
                  <label>Email</label>
                  <div className="modal-input-wrap">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Masukkan email"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                  {errors.email && <span className="modal-error">{errors.email}</span>}
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>No. WhatsApp</label>
                    <div className="modal-input-wrap">
                      <i className="fab fa-whatsapp"></i>
                      <input
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                    {errors.phone && <span className="modal-error">{errors.phone}</span>}
                  </div>
                  <div className="modal-form-group">
                    <label>Password</label>
                    <div className="modal-input-wrap">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={formData.password}
                        onChange={(e) => update("password", e.target.value)}
                      />
                    </div>
                    {errors.password && <span className="modal-error">{errors.password}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions">
              {step > 1 && (
                <button className="btn btn-ghost modal-btn-back" onClick={back}>
                  <i className="fas fa-arrow-left"></i> Kembali
                </button>
              )}
              <div style={{ flex: 1 }}></div>
              {step < 3 ? (
                <button className="btn btn-primary modal-btn-next" onClick={next}>
                  Selanjutnya <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button className="btn btn-primary modal-btn-next" onClick={submit}>
                  <i className="fas fa-paper-plane"></i> Kirim Pendaftaran
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
