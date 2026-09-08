"use client";

import { useState } from "react";
import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import FooterDetail from "@/components/FooterDetail";
import Link from "next/link";
import { setCustomerSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Area", href: "/#cek-area" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "FAQ", href: "/#faq" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }
      setCustomerSession(data.customer);
      setShowToast(true);
      setTimeout(() => {
        router.push("/portal");
      }, 1400);
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
        cta={{ label: "Berlangganan", href: "/daftar" }}
      />

      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2>Login Akun</h2>
          <p className="auth-sub">
            Masuk untuk membuka Portal Pelanggan Dukodu
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" /> Ingat saya
              </label>
              <a href="#" className="forgot-link">
                Lupa password?
              </a>
            </div>

            {error && <div className="auth-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="auth-demo">
            <i className="fas fa-info-circle"></i> Belum punya akun? Silakan daftar terlebih dahulu untuk masuk ke portal.
          </div>

          <p className="auth-switch">
            Belum punya akun? <Link href="/daftar">Daftar sekarang</Link>
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
        Login berhasil! Mengarahkan ke portal pelanggan...
      </div>
    </>
  );
}