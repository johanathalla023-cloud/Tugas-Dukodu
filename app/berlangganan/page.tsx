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
    paketId: "pkg-001",
    name: "Paket Hemat",
    speed: "30 Mbps",
    price: "175",
    features: ["Instalasi Gratis", "Router Gratis", "Support 24/7"],
  },
  {
    id: "utama",
    paketId: "pkg-002",
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
    paketId: "pkg-003",
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

const buildAlamatUtama = (f: FormData): string =>
  [f.alamat, f.kelurahan, f.kecamatan, f.kabupaten, f.provinsi]
    .filter(Boolean)
    .join(", ");

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
  fotoKtp: string;
  alamatInstalasi: string;
  alamatPenagihan: string;
  instalasiSamaUtama: boolean;
  penagihanSama: boolean;
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
  fotoKtp: "",
  alamatInstalasi: "",
  alamatPenagihan: "",
  instalasiSamaUtama: false,
  penagihanSama: false,
};

export default function BerlanggananPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const togglePenagihanSama = (same: boolean) => {
    setForm((prev) => ({
      ...prev,
      penagihanSama: same,
      alamatPenagihan: same ? buildAlamatUtama(prev) : prev.alamatPenagihan,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.alamatPenagihan;
      return next;
    });
  };

  const toggleInstalasiSamaUtama = (same: boolean) => {
    setForm((prev) => ({
      ...prev,
      instalasiSamaUtama: same,
      alamatInstalasi: same ? buildAlamatUtama(prev) : prev.alamatInstalasi,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.alamatInstalasi;
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

  const onKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const allowedExt = /\.(jpg|jpeg|png)$/i;
    const MAX_SIZE = 5 * 1024 * 1024;

    const validType =
      allowedTypes.includes(file.type) && allowedExt.test(file.name);

    if (!validType) {
      setErrors((prev) => ({
        ...prev,
        fotoKtp: "Format file harus JPG, JPEG, atau PNG",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        fotoKtp: "Ukuran file maksimal 5 MB",
      }));
      e.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, fotoKtp: file.name }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.fotoKtp;
      return next;
    });
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
      if (!form.fotoKtp) e.fotoKtp = "Foto KTP wajib dilampirkan";
      if (!form.alamatInstalasi.trim())
        e.alamatInstalasi = "Alamat instalasi wajib diisi";
      if (!form.penagihanSama && !form.alamatPenagihan.trim())
        e.alamatPenagihan = "Alamat penagihan wajib diisi";
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

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError("");

    const selectedPkg = PACKAGES.find((p) => p.id === form.paket);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nama,
          email: form.email,
          phone: form.wa,
          password: form.password,
          alamat: buildAlamatUtama(form),
          provinsi: form.provinsi,
          kabupaten: form.kabupaten,
          kecamatan: form.kecamatan,
          kelurahan: form.kelurahan,
          lat: form.lat,
          lng: form.lng,
          paketId: selectedPkg?.paketId || "",
          fotoKTP: form.fotoKtp,
          alamatInstalasi: form.alamatInstalasi,
          alamatPenagihan: form.alamatPenagihan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pendaftaran");

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPkg = PACKAGES.find((p) => p.id === form.paket);

  return (
    <>
      <BgScene />
      <Navbar links={NAV_LINKS} />

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
                <div className="modal-success-actions">
                  <a href="/" className="btn btn-primary modal-success-btn">
                    <i className="fas fa-house"></i> Kembali ke Beranda
                  </a>
                  <a href="/cek-tagihan" className="btn btn-ghost modal-success-btn">
                    Cek Tagihan
                  </a>
                </div>
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
                  {/* Kolom Foto KTP + Data Diri */}
                  <div className="subs-kolom">
                    {/* Foto KTP (di atas) */}
                    <div className="subs-field subs-ktp-field">
                      <label>
                        Foto KTP <span className="subs-req">*</span>
                      </label>
                      <div className="subs-upload">
                        <label className={`subs-upload-box${form.fotoKtp ? " has-file" : ""}`}>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            onChange={onKtpChange}
                          />
                          {form.fotoKtp ? (
                            <>
                              <i className="fas fa-file-image"></i>
                              <span className="subs-upload-name">{form.fotoKtp}</span>
                              <span className="subs-upload-change">Ganti file</span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-cloud-upload-alt"></i>
                              <span className="subs-upload-title">
                                Unggah Foto KTP
                              </span>
                              <span className="subs-upload-sub">
                                Klik untuk memilih file (JPG, JPEG, PNG — max 5 MB)
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                      {errors.fotoKtp && (
                        <span className="subs-error">{errors.fotoKtp}</span>
                      )}
                    </div>

                    {/* Data Diri */}
                    <div className="subs-subtitle">
                      <i className="fas fa-id-card"></i> Data Diri
                    </div>
                    <div className="subs-form-grid">
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

                  {/* Kolom Alamat Instalasi & Penagihan */}
                  <div className="subs-form-grid">
                    <div className="subs-field">
                      <label>
                        Alamat Instalasi <span className="subs-req">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Alamat lokasi pemasangan internet"
                        value={form.alamatInstalasi}
                        onChange={(e) => update("alamatInstalasi", e.target.value)}
                        disabled={form.instalasiSamaUtama}
                      ></textarea>
                      {errors.alamatInstalasi && (
                        <span className="subs-error">{errors.alamatInstalasi}</span>
                      )}
                      <label className="subs-check subs-check-sm">
                        <input
                          type="checkbox"
                          checked={form.instalasiSamaUtama}
                          onChange={(e) => toggleInstalasiSamaUtama(e.target.checked)}
                        />
                        <span className="subs-checkmark">
                          <i className="fas fa-check"></i>
                        </span>
                        <span className="subs-check-text">
                          Sama dengan alamat utama (Langkah 1)
                        </span>
                      </label>
                    </div>
                    <div className="subs-field">
                      <label>
                        Alamat Penagihan <span className="subs-req">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Alamat untuk pengiriman tagihan / invoice"
                        value={form.alamatPenagihan}
                        onChange={(e) => update("alamatPenagihan", e.target.value)}
                        disabled={form.penagihanSama}
                      ></textarea>
                      {errors.alamatPenagihan && (
                        <span className="subs-error">{errors.alamatPenagihan}</span>
                      )}
                      <label className="subs-check subs-check-sm">
                        <input
                          type="checkbox"
                          checked={form.penagihanSama}
                          onChange={(e) => togglePenagihanSama(e.target.checked)}
                        />
                        <span className="subs-checkmark">
                          <i className="fas fa-check"></i>
                        </span>
                        <span className="subs-check-text">
                          Sama dengan alamat utama (Langkah 1)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Info: instalasi sudah termasuk */}
                  <div className="subs-info">
                    <i className="fas fa-info-circle"></i>
                    <span>
                      Bagus! Setiap paket <strong>sudah termasuk biaya instalasi</strong>{" "}
                      hingga <strong>{selectedPkg ? selectedPkg.speed : "kecepatan"}</strong>{" "}
                      — tim teknisi kami akan datang ke alamat di atas untuk memasang.
                    </span>
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
                  <button
                    className="subs-btn-next"
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Mengirim...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Kirim Pendaftaran
                      </>
                    )}
                  </button>
                )}
              </div>
              {submitError && (
                <div className="subs-error" style={{ textAlign: "center", marginTop: "-6px" }}>
                  <i className="fas fa-exclamation-triangle"></i> {submitError}
                </div>
              )}

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