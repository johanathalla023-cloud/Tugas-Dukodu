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

export default function DaftarPage() {
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
        cta={{ label: "Masuk", href: "/login" }}
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
                    placeholder="Ulangi password"
                    required
                  />
                </div>
              </div>
            </div>

            <label className="checkbox-label terms">
              <input type="checkbox" required /> Saya menyetujui{" "}
              <a href="#">Syarat &amp; Ketentuan</a>
            </label>

            <button type="submit" className="btn btn-primary auth-btn">
              Daftar
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun? <Link href="/login">Login</Link>
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