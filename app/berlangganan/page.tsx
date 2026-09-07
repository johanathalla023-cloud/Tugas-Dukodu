"use client";

import { useState } from "react";
import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import FooterDetail from "@/components/FooterDetail";
import LocationMap from "@/components/LocationMap";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Area", href: "/#cek-area" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "FAQ", href: "/#faq" },
];

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
    features: [
      "Instalasi Gratis",
      "Router Premium",
      "Support Prioritas",
      "Garansi 2 Tahun",
    ],
  },
  {
    id: "premium",
    name: "Paket Premium",
    speed: "100 Mbps",
    price: "599",
    features: [
      "Instalasi + Training",
      "Router Ultra Premium",
      "Support VIP 24/7",
      "Garansi 3 Tahun",
    ],
  },
];

const PROVINSI = [
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "Jawa Timur",
  "DI Yogyakarta",
];

const KABUPATEN: Record<string, string[]> = {
  "DKI Jakarta": [
    "Jakarta Selatan",
    "Jakarta Pusat",
    "Jakarta Utara",
    "Jakarta Barat",
    "Jakarta Timur",
  ],
  "Jawa Barat": [
    "Kota Depok",
    "Kota Bogor",
    "Kota Bekasi",
    "Kabupaten Bogor",
    "Kota Bandung",
  ],
  Banten: ["Kota Tangerang", "Kota Tangerang Selatan", "Kabupaten Tangerang", "Kota Serang"],
  "Jawa Tengah": ["Kota Semarang", "Kota Surakarta", "Kabupaten Banyumas"],
  "Jawa Timur": ["Kota Surabaya", "Kota Malang", "Kabupaten Sidoarjo"],
  "DI Yogyakarta": ["Kota Yogyakarta", "Kabupaten Sleman", "Kabupaten Bantul"],
};

const KECAMATAN: Record<string, string[]> = {
  "Jakarta Selatan": [
    "Mampang Prapatan",
    "Tebet",
    "Setiabudi",
    "Kebayoran Baru",
    "Pancoran",
    "Jagakarsa",
    "Pasar Minggu",
    "Cilandak",
    "Kebayoran Lama",
    "Pesanggrahan",
  ],
  "Jakarta Pusat": ["Menteng", "Senen", "Gambir", "Tanah Abang"],
  "Jakarta Utara": ["Kelapa Gading", "Koja", "Penjaringan", "Tanjung Priok"],
  "Jakarta Barat": ["Kebon Jeruk", "Palmerah", "Grogol Petamburan", "Kembangan"],
  "Jakarta Timur": ["Duren Sawit", "Jatinegara", "Pulo Gadung", "Kramat Jati"],
  "Kota Depok": [
    "Beji",
    "Pancoran Mas",
    "Cimanggis",
    "Sukmajaya",
    "Tapos",
    "Sawangan",
    "Limo",
    "Cinere",
    "Bojongsari",
  ],
  "Kota Bogor": ["Bogor Barat", "Bogor Timur", "Bogor Utara", "Bogor Selatan"],
  "Kota Bekasi": ["Bekasi Timur", "Bekasi Barat", "Bekasi Utara", "Bekasi Selatan"],
  "Kabupaten Bogor": ["Cibinong", "Bojong Gede", "Gunung Putri", "Cileungsi"],
  "Kota Bandung": ["Coblong", "Bandung Wetan", "Astanaanyar", "Cicendo"],
  "Kota Tangerang": ["Ciledug", "Karawaci", "Cipondoh", "Jatiuwung"],
  "Kota Tangerang Selatan": ["Serpong", "Ciputat", "Pamulang", "Setu"],
  "Kabupaten Tangerang": ["Balaraja", "Cikupa", "Kosambi", "Pasar Kemis"],
  "Kota Serang": ["Serang", "Cipocok Jaya", "Curug", "Walantaka"],
  "Kota Semarang": ["Semarang Tengah", "Semarang Selatan", "Semarang Utara", "Semarang Barat"],
  "Kota Surakarta": ["Laweyan", "Serengan", "Pasar Kliwon", "Jebres"],
  "Kabupaten Banyumas": ["Purwokerto Barat", "Purwokerto Timur", "Sokaraja", "Ajibarang"],
  "Kota Surabaya": ["Wonokromo", "Genteng", "Gubeng", "Rungkut"],
  "Kota Malang": ["Klojen", "Blimbing", "Lowokwaru", "Sukun"],
  "Kabupaten Sidoarjo": ["Sidoarjo", "Candi", "Waru", "Taman"],
  "Kota Yogyakarta": ["Gondokusuman", "Umbulharjo", "Tegalrejo", "Jetis"],
  "Kabupaten Sleman": ["Depok", "Gamping", "Mlati", "Ngemplak"],
  "Kabupaten Bantul": ["Bantul", "Sewon", "Kasihan", "Banguntapan"],
};

const KELURAHAN: Record<string, string[]> = {
  "Mampang Prapatan": ["Mampang Prapatan", "Kuningan Barat", "Tegal Parang", "Bangka", "Pela Mampang"],
  Tebet: ["Tebet Barat", "Tebet Timur", "Kebon Baru", "Bukit Duri", "Manggarai", "Manggarai Selatan"],
  Setiabudi: ["Karet", "Karet Semanggi", "Karet Kuningan", "Setiabudi", "Kuningan Timur", "Menteng Atas", "Guntur", "Karet Tengsin"],
  "Kebayoran Baru": ["Kramat Pela", "Gandaria Utara", "Gandaria Selatan", "Cipete Utara", "Cipete Selatan", "Melawai", "Petogogan", "Rawa Barat", "Senayan", "Gunung"],
  Pancoran: ["Pancoran", "Kalibata", "Rawa Jati", "Duren Tiga", "Cikoko", "Pengadegan"],
  Jagakarsa: ["Cipedak", "Jagakarsa", "Srengseng Sawah", "Tanjung Barat", "Lenteng Agung"],
  "Pasar Minggu": ["Pasar Minggu", "Kebagusan", "Jati Padang", "Ragunan", "Pejaten Timur", "Cilandak Timur"],
  Cilandak: ["Cilandak Barat", "Cilandak Timur", "Gandaria Selatan", "Lebak Bulus", "Pondok Labu"],
  "Kebayoran Lama": ["Kebayoran Lama Utara", "Kebayoran Lama Selatan", "Grogol Utara", "Grogol Selatan", "Cipulir"],
  Pesanggrahan: ["Pesanggrahan", "Bintaro", "Petukangan Utara", "Petukangan Selatan", "Ulujami"],
  Beji: ["Beji", "Beji Timur", "Kemiri Muka", "Pondok Cina", "Kukusan", "Tanah Baru"],
  "Pancoran Mas": ["Pancoran Mas", "Depok", "Depok Jaya", "Mampang", "Rangkapan Jaya", "Rangkapan Jaya Baru"],
  Cimanggis: ["Cilangkap", "Mekarsari", "Tugu", "Harjamukti", "Pondok Petir", "Curug"],
  Sukmajaya: ["Sukmajaya", "Bakti Jaya", "Abadijaya", "Cisalak", "Mekar Jaya", "Tirtajaya"],
  Tapos: ["Tapos", "Cilangkap", "Jatijajar", "Leuwinanggung", "Sukamaju Baru"],
  Sawangan: ["Sawangan", "Bedahan", "Pasir Putih", "Pengasinan", "Kedaung"],
  Limo: ["Limo", "Meruyung", "Krukut"],
  Cinere: ["Cinere", "Pangkalan Jati", "Gandul", "Kedaung"],
  Bojongsari: ["Bojongsari", "Bojongsari Baru", "Serua", "Serua Indah", "Pondok Petir", "Duren Seribu", "Duren Mekar"],
  Menteng: ["Menteng", "Pegangsaan", "Cikini", "Kebon Sirih", "Gondangdia"],
  Senen: ["Senen", "Kwitang", "Kenari", "Paseban", "Kramat", "Bungur"],
  "Kelapa Gading": ["Kelapa Gading Barat", "Kelapa Gading Timur", "Pegangsaan Dua"],
  "Kebon Jeruk": ["Kebon Jeruk", "Kedoya Utara", "Kedoya Selatan", "Sukabumi Utara", "Sukabumi Selatan", "Duri Kepa", "Kelapa Dua"],
  "Duren Sawit": ["Duren Sawit", "Pondok Bambu", "Pondok Kelapa", "Malaka Jaya", "Malaka Sari"],
  Jatinegara: ["Bali Mester", "Kampung Melayu", "Bidara Cina", "Cipinang Cempedak", "Rawa Bunga"],
};

type Step = 1 | 2 | 3;

type FormData = {
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  lat: string;
  lng: string;
  paket: string;
  nama: string;
  email: string;
  wa: string;
  password: string;
};

const EMPTY_FORM: FormData = {
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  kelurahan: "",
  alamat: "",
  lat: "",
  lng: "",
  paket: "",
  nama: "",
  email: "",
  wa: "",
  password: "",
};

export default function BerlanggananPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onProvinsiChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      provinsi: value,
      kabupaten: "",
      kecamatan: "",
      kelurahan: "",
    }));
  };

  const onKabupatenChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      kabupaten: value,
      kecamatan: "",
      kelurahan: "",
    }));
  };

  const onKecamatanChange = (value: string) => {
    setForm((prev) => ({ ...prev, kecamatan: value, kelurahan: "" }));
  };

  const onCoordsChange = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};

    if (step === 1) {
      if (!form.provinsi) e.provinsi = "Pilih provinsi";
      if (!form.kabupaten) e.kabupaten = "Pilih kabupaten/kota";
      if (!form.kecamatan) e.kecamatan = "Pilih kecamatan";
      if (KELURAHAN[form.kecamatan] && !form.kelurahan)
        e.kelurahan = "Pilih kelurahan";
      if (!form.alamat.trim()) e.alamat = "Alamat lengkap wajib diisi";
      if (!form.lat || !form.lng)
        e.koordinat = "Tandai lokasi Anda di peta atau gunakan tombol GPS";
    } else if (step === 2) {
      if (!form.paket) e.paket = "Pilih salah satu paket";
    } else if (step === 3) {
      if (!form.nama.trim()) e.nama = "Nama lengkap wajib diisi";
      if (!form.email.trim()) {
        e.email = "Email wajib diisi";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = "Format email tidak valid";
      }
      if (!form.wa.trim()) {
        e.wa = "No. WhatsApp wajib diisi";
      } else if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(form.wa.replace(/\s/g, ""))) {
        e.wa = "Format nomor WhatsApp tidak valid";
      }
      if (!form.password.trim()) {
        e.password = "Password wajib diisi";
      } else if (form.password.length < 8) {
        e.password = "Password minimal 8 karakter";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3) as Step);
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 1) as Step);
    setErrors({});
  };

  const submit = () => {
    if (validateStep()) setSubmitted(true);
  };

  const selectedPkg = PACKAGES.find((p) => p.id === form.paket);

  return (
    <>
      <BgScene />
      <Navbar links={NAV_LINKS} cta={{ label: "Masuk", href: "/login" }} />

      <section className="subs-section">
        <div className="subs-card">
          {submitted ? (
            <div className="modal-success">
              <div className="modal-success-icon">
                <i className="fas fa-check"></i>
              </div>
              <h3>Pendaftaran Berhasil!</h3>
              <p>
                Terima kasih <strong>{form.nama}</strong>. Tim Dukodu akan
                menghubungi Anda via WhatsApp dalam 1×24 jam untuk konfirmasi
                pemasangan.
              </p>
              <a href="/" className="btn btn-primary modal-success-btn">
                Kembali ke Beranda
              </a>
            </div>
          ) : (
            <>
              {/* Steps Indicator */}
              <div className="subs-steps">
                <div className={`subs-step${step > 1 ? " done" : ""}${step === 1 ? " active" : ""}`}>
                  <div className="subs-step-circle">
                    {step > 1 ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <i className="fas fa-location-dot"></i>
                    )}
                  </div>
                  <span>Lokasi</span>
                </div>
                <div className="subs-step-line"></div>
                <div className={`subs-step${step > 2 ? " done" : ""}${step === 2 ? " active" : ""}`}>
                  <div className="subs-step-circle">
                    {step > 2 ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <i className="fas fa-box"></i>
                    )}
                  </div>
                  <span>Paket</span>
                </div>
                <div className="subs-step-line"></div>
                <div className={`subs-step${step === 3 ? " active" : ""}`}>
                  <div className="subs-step-circle">
                    <i className="fas fa-user"></i>
                  </div>
                  <span>Data Diri</span>
                </div>
              </div>

              {/* Step 1: Lokasi */}
              {step === 1 && (
                <div className="subs-form">
                  <h3 className="subs-form-title">
                    <i className="fas fa-location-dot"></i> Alamat Utama
                  </h3>

                  <div className="subs-form-grid">
                    <div className="subs-field">
                      <label>
                        Provinsi <span className="subs-req">*</span>
                      </label>
                      <div className="subs-select-wrap">
                        <select
                          value={form.provinsi}
                          onChange={(e) => onProvinsiChange(e.target.value)}
                        >
                          <option value="">Pilih provinsi</option>
                          {PROVINSI.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      {errors.provinsi && (
                        <span className="subs-error">{errors.provinsi}</span>
                      )}
                    </div>

                    <div className="subs-field">
                      <label>
                        Kabupaten <span className="subs-req">*</span>
                      </label>
                      <div className="subs-select-wrap">
                        <select
                          value={form.kabupaten}
                          onChange={(e) => onKabupatenChange(e.target.value)}
                          disabled={!form.provinsi}
                        >
                          <option value="">Pilih kabupaten</option>
                          {(KABUPATEN[form.provinsi] || []).map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      {errors.kabupaten && (
                        <span className="subs-error">{errors.kabupaten}</span>
                      )}
                    </div>

                    <div className="subs-field">
                      <label>
                        Kecamatan <span className="subs-req">*</span>
                      </label>
                      <div className="subs-select-wrap">
                        <select
                          value={form.kecamatan}
                          onChange={(e) => onKecamatanChange(e.target.value)}
                          disabled={!form.kabupaten}
                        >
                          <option value="">Pilih kecamatan</option>
                          {(KECAMATAN[form.kabupaten] || []).map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      {errors.kecamatan && (
                        <span className="subs-error">{errors.kecamatan}</span>
                      )}
                    </div>

                    <div className="subs-field">
                      <label>
                        Kelurahan <span className="subs-req">*</span>
                      </label>
                      <div className="subs-select-wrap">
                        <select
                          value={form.kelurahan}
                          onChange={(e) => update("kelurahan", e.target.value)}
                          disabled={!form.kecamatan}
                        >
                          <option value="">Pilih kelurahan</option>
                          {(KELURAHAN[form.kecamatan] || []).map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      {errors.kelurahan && (
                        <span className="subs-error">{errors.kelurahan}</span>
                      )}
                    </div>
                  </div>

                  <div className="subs-field">
                    <label>
                      Alamat Lengkap <span className="subs-req">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nama jalan, nomor rumah, RT/RW, dll"
                      value={form.alamat}
                      onChange={(e) => update("alamat", e.target.value)}
                    ></textarea>
                    {errors.alamat && (
                      <span className="subs-error">{errors.alamat}</span>
                    )}
                  </div>

                  {/* Koordinat Lokasi + Peta */}
                  <LocationMap
                    lat={form.lat}
                    lng={form.lng}
                    onCoordsChange={onCoordsChange}
                  />
                  {errors.koordinat && (
                    <span className="subs-error">{errors.koordinat}</span>
                  )}
                </div>
              )}

              {/* Step 2: Paket */}
              {step === 2 && (
                <div className="subs-form">
                  <h3 className="subs-form-title">
                    <i className="fas fa-box"></i> Pilih Paket
                  </h3>
                  <div className="modal-packages">
                    {PACKAGES.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`modal-pkg-card${form.paket === pkg.id ? " selected" : ""}${pkg.popular ? " popular" : ""}`}
                        onClick={() => update("paket", pkg.id)}
                      >
                        {pkg.popular && (
                          <div className="modal-pkg-badge">POPULER</div>
                        )}
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
                          <div
                            className={`radio-circle${form.paket === pkg.id ? " checked" : ""}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.paket && (
                    <span className="subs-error" style={{ textAlign: "center" }}>
                      {errors.paket}
                    </span>
                  )}
                </div>
              )}

              {/* Step 3: Data Diri */}
              {step === 3 && (
                <div className="subs-form">
                  <h3 className="subs-form-title">
                    <i className="fas fa-user"></i> Data Diri
                  </h3>
                  {selectedPkg && (
                    <div className="modal-summary">
                      <div className="modal-summary-label">Paket yang dipilih</div>
                      <div className="modal-summary-value">
                        <i className="fas fa-bolt"></i> {selectedPkg.name} —{" "}
                        {selectedPkg.speed} — Rp {selectedPkg.price}.000/bulan
                      </div>
                    </div>
                  )}
                  <div className="subs-field">
                    <label>Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={form.nama}
                      onChange={(e) => update("nama", e.target.value)}
                    />
                    {errors.nama && <span className="subs-error">{errors.nama}</span>}
                  </div>
                  <div className="subs-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Masukkan email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    {errors.email && <span className="subs-error">{errors.email}</span>}
                  </div>
                  <div className="subs-form-grid">
                    <div className="subs-field">
                      <label>No. WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={form.wa}
                        onChange={(e) => update("wa", e.target.value)}
                      />
                      {errors.wa && <span className="subs-error">{errors.wa}</span>}
                    </div>
                    <div className="subs-field">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                      />
                      {errors.password && (
                        <span className="subs-error">{errors.password}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="subs-actions">
                {step > 1 && (
                  <button className="btn btn-ghost subs-btn-back" onClick={back}>
                    <i className="fas fa-arrow-left"></i> Kembali
                  </button>
                )}
                <div style={{ flex: 1 }}></div>
                {step < 3 ? (
                  <button className="subs-btn-next" onClick={next}>
                    Lanjut <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button className="subs-btn-next" onClick={submit}>
                    <i className="fas fa-paper-plane"></i> Kirim Pendaftaran
                  </button>
                )}
              </div>

              <p className="subs-consent">
                Dengan mendaftar, Anda setuju untuk dihubungi oleh tim Dukodu
                melalui WhatsApp.
              </p>
            </>
          )}
        </div>
      </section>

      <FooterDetail />

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom" style={{ justifyContent: "center" }}>
            <p>&copy; 2026 Dukodu Internet. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </>
  );
}