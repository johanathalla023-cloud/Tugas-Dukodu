"use client";

import { useState } from "react";
import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import FooterDetail from "@/components/FooterDetail";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Area", href: "/#cek-area" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "FAQ", href: "/#faq" },
];

export default function DaftarPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nohp, setNohp] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== konfirmasi) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nama,
          email,
          phone: nohp,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal");
        setLoading(false);
        return;
      }
      setShowToast(true);
      setTimeout(() => {
        router.push("/");
      }, 1800);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <>
      <BgScene />
      <Navbar
        links={NAV_LINKS}
        cta={{ label: "Berlangganan", href: "/berlangganan" }}
      />

      <section className="auth-section">
        <div className="auth-card auth-card-lg">
          <div className="auth-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2>Daftar Akun</h2>
          <p className="auth-sub">
            Buat akun baru untuk berlangganan Dukodu
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap</label>
              <div className="input-wrap">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nohp">No. WhatsApp</label>
              <div className="input-wrap">
                <i className="fab fa-whatsapp"></i>
                <input
                  type="tel"
                  id="nohp"
                  value={nohp}
                  onChange={(e) => setNohp(e.target.value)}
                  placeholder="Masukkan nomor WhatsApp"
                  required
                />
              </div>
            </div>

            <div className="form-row half">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat password"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="konfirmasi">Konfirmasi Password</label>
                <div className="input-wrap">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="konfirmasi"
                    value={konfirmasi}
                    onChange={(e) => setKonfirmasi(e.target.value)}
                    placeholder="Ulangi password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <div className="auth-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

            <label className="checkbox-label terms">
              <input type="checkbox" required /> Saya menyetujui{" "}
              <a href="#">Syarat &amp; Ketentuan</a>
            </label>

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="auth-switch">
            Ingin berlangganan? <a href="/berlangganan">Ajukan pendaftaran</a>
          </p>
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

      <div className={`auth-toast${showToast ? " show" : ""}`}>
        Pendaftaran berhasil! Mengarahkan ke beranda...
      </div>
    </>
  );
}