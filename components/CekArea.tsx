"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const SERVED_AREAS = [
  "dukodu residence",
  "dukodu park",
  "dukodu hills",
  "kota dukodu",
  "jakarta",
  "dukodu",
];

export default function CekArea() {
  const [value, setValue] = useState("");
  const [buttonText, setButtonText] = useState(
    <><i className="fas fa-location-dot"></i> Cek Ketersediaan</>
  );
  const [result, setResult] = useState<{ type: "success" | "error" } | null>(
    null
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().toLowerCase();
    setResult(null);
    if (!v) return;

    setButtonText(<i className="fas fa-circle-notch fa-spin"></i>);
    setTimeout(() => {
      const available = SERVED_AREAS.some(
        (area) => v.includes(area) || area.includes(v)
      );
      setResult({ type: available ? "success" : "error" });
      setButtonText(
        <><i className="fas fa-location-dot"></i> Cek Ketersediaan</>
      );
    }, 600);
  };

  return (
    <section id="cek-area" className="section cek-area">
      <div className="container">
        <Reveal>
          <div className="cek-box">
            <span className="section-label">Cek Area</span>
            <h2>Apakah Area Anda Sudah Tersedia?</h2>
            <p>
              Masukkan alamat atau nama daerah Anda untuk mengetahui
              ketersediaan jaringan fiber optik Dukodu.
            </p>

            <form className="cek-form" onSubmit={onSubmit}>
              <div className="cek-input-wrap">
                <i className="fas fa-location-dot"></i>
                <input
                  type="text"
                  className="cek-input"
                  placeholder="Contoh: Jakarta Selatan, Dukodu Residence"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {buttonText}
              </button>
            </form>

            <div
              className={`cek-result ${result ? result.type : ""}`}
              style={{ display: result ? "flex" : "none" }}
            >
              {result?.type === "success" ? (
                <>
                  <i className="fas fa-circle-check"></i>
                  <span>
                    Selamat, area Anda{" "}
                    <strong>terlayani</strong>! Silakan daftar untuk mulai
                    berlangganan.
                  </span>
                </>
              ) : result?.type === "error" ? (
                <>
                  <i className="fas fa-circle-exclamation"></i>
                  <span>
                    Area Anda <strong>belum terlayani</strong> untuk saat ini.
                    Hubungi support kami untuk info lebih lanjut.
                  </span>
                </>
              ) : null}
            </div>

            <p className="cek-hint">
              <strong>Area terlayani:</strong> Dukodu Residence, Dukodu Park,
              Dukodu Hills, Kota Dukodu
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}