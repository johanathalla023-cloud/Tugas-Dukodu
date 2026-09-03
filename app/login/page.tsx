"use client";

import { useState } from "react";
import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import FooterDetail from "@/components/FooterDetail";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Area", href: "/#cek-area" },
  { label: "Keunggulan", href: "/#keunggulan" },
  { label: "FAQ", href: "/#faq" },
];

export default function LoginPage() {
  const [showToast, setShowToast] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1400);
  };

  return (
    <>
      <BgScene />
      <Navbar
        links={NAV_LINKS}
        cta={{ label: "Daftar", href: "/daftar" }}
      />

      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2>Login Akun</h2>
          <p className="auth-sub">
            Masuk untuk melanjutkan ke akun Dukodu Anda
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email / No. Pelanggan</label>
              <div className="input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  id="email"
                  placeholder="Masukkan email atau nomor pelanggan"
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

            <button type="submit" className="btn btn-primary auth-btn">
              Login
            </button>
          </form>

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
        Berhasil! Anda akan diarahkan ke beranda.
      </div>
    </>
  );
}