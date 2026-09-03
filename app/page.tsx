import BgScene from "@/components/BgScene";
import Navbar from "@/components/Navbar";
import CekArea from "@/components/CekArea";
import FAQ from "@/components/FAQ";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FooterDetail from "@/components/FooterDetail";
import Reveal from "@/components/Reveal";

const NAV_LINKS = [
  { label: "Paket", href: "#paket" },
  { label: "Cek Area", href: "#cek-area" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "FAQ", href: "#faq" },
];

const PACKAGES = [
  {
    name: "Paket Hemat",
    speed: "30 Mbps",
    price: "175",
    features: [
      "Kecepatan 30 Mbps",
      "Instalasi Gratis",
      "Router Gratis",
      "Support 24/7",
    ],
  },
  {
    name: "Paket Utama",
    speed: "50 Mbps",
    price: "199",
    popular: true,
    features: [
      "Kecepatan 50 Mbps",
      "Instalasi Gratis",
      "Router Premium",
      "Support Prioritas",
      "Garansi 2 Tahun",
    ],
  },
  {
    name: "Paket Premium",
    speed: "100 Mbps",
    price: "599",
    features: [
      "Kecepatan 100 Mbps",
      "Instalasi + Training",
      "Router Ultra Premium",
      "Support VIP 24/7",
      "Garansi 3 Tahun",
    ],
  },
];

const FEATURES = [
  {
    icon: "fas fa-bolt",
    title: "Kecepatan Tinggi",
    desc: "Fiber optik terkini dengan kecepatan konsisten hingga 100 Mbps untuk streaming, gaming, dan kerja online tanpa lag.",
  },
  {
    icon: "fas fa-server",
    title: "Infrastruktur Terpercaya",
    desc: "Jaringan modern dengan server tersebar strategis menjamin kualitas koneksi stabil dan aman di seluruh wilayah.",
  },
  {
    icon: "fas fa-headset",
    title: "Support 24/7",
    desc: "Tim profesional siap membantu kapan saja melalui chat, telepon, atau kunjungan langsung ke lokasi Anda.",
  },
  {
    icon: "fas fa-coins",
    title: "Harga Terjangkau",
    desc: "Paket fleksibel dengan harga kompetitif tanpa biaya tersembunyi, instalasi gratis, dan bonus perangkat.",
  },
  {
    icon: "fas fa-lock",
    title: "Keamanan Terjamin",
    desc: "Enkripsi tingkat enterprise dan firewall canggih melindungi data pribadi serta privasi online Anda setiap saat.",
  },
  {
    icon: "fas fa-truck-fast",
    title: "Instalasi Mudah",
    desc: "Proses aktivasi cepat hanya 1-2 hari kerja dengan teknisi berpengalaman dan panduan lengkap di awal penggunaan.",
  },
];

export default function HomePage() {
  return (
    <>
      <BgScene />
      <Navbar links={NAV_LINKS} cta={{ label: "Daftar", href: "/daftar" }} />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="badge-dot"></span>
                  <span>Fiber Optik Kualitas Premium</span>
                </div>

                <h1 className="hero-title">
                  Internet <em className="gradient-text">Super Cepat</em>
                  <br />
                  untuk Rumah Modern
                </h1>

                <p className="hero-subtitle">
                  Nikmati streaming, gaming, dan kerja online tanpa lag dengan
                  jaringan fiber optik Dukodu. Instalasi gratis, support 24/7,
                  dan jaminan koneksi stabil untuk keluarga Indonesia.
                </p>

                <div className="hero-cta">
                  <button className="btn btn-primary btn-lg">
                    <i className="fas fa-location-dot"></i>
                    Cek Ketersediaan
                  </button>
                  <a href="#paket" className="btn btn-ghost btn-lg">
                    <i className="fas fa-play-circle"></i>
                    Lihat Paket
                  </a>
                </div>

                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-value">100+</div>
                    <div className="stat-label">Ribu Pelanggan</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">99.9%</div>
                    <div className="stat-label">Uptime</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">24/7</div>
                    <div className="stat-label">Support</div>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="glass-tv">
                  <div className="speed-display">
                    <div className="speed-ring">
                      <div className="speed-ring-inner">
                        <strong>100</strong>
                        <span>Mbps</span>
                      </div>
                    </div>
                    <div className="speed-label">Gamer · Ultra Premium</div>
                    <div className="speed-sub">
                      Fiber optik, tanpa buffering
                    </div>
                  </div>
                </div>
                <div className="hero-icon hi-1">
                  <i className="fas fa-wifi"></i>
                </div>
                <div className="hero-icon hi-2">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="hero-icon hi-3">
                  <i className="fas fa-film"></i>
                </div>
                <div className="hero-icon hi-4">
                  <i className="fas fa-headset"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">
          <div className="container">
            <Reveal>
              <div className="trust-inner">
                <span className="trust-note">
                  Dipercaya di seluruh Indonesia
                </span>
                <div className="trust-items">
                  <div className="trust-item">
                    <i className="fas fa-truck-fast"></i> Instalasi Gratis
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-gauge-high"></i> Kecepatan 100 Mbps
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-headset"></i> Support 24/7
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-shield-halved"></i> Garansi Koneksi
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PAKET */}
        <section id="paket" className="section">
          <div className="container">
            <Reveal>
              <div className="section-header">
                <span className="section-label">Layanan Kami</span>
                <h2>Pilih Paket Sesuai Kebutuhan</h2>
                <p>
                  Kecepatan fiber optik premium dengan harga terjangkau. Tanpa
                  biaya tersembunyi.
                </p>
              </div>
            </Reveal>

            <div className="paket-grid">
              {PACKAGES.map((pkg) => (
                <Reveal key={pkg.name}>
                  <div
                    className={`paket-card${pkg.popular ? " paket-popular" : ""}`}
                  >
                    {pkg.popular && (
                      <div className="popular-badge">POPULER</div>
                    )}
                    <div className="paket-header">
                      <h3>{pkg.name}</h3>
                      <span className="paket-speed">
                        <i className="fas fa-bolt"></i> {pkg.speed}
                      </span>
                    </div>
                    <div className="paket-price">
                      <span className="price-amount">{pkg.price}</span>
                      <span className="price-period">Ribu/Bulan</span>
                    </div>
                    <div className="paket-divider"></div>
                    <div className="paket-features">
                      {pkg.features.map((f) => (
                        <div className="feature" key={f}>
                          <i className="fas fa-check"></i>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={`btn-paket${pkg.popular ? " btn-paket-primary" : ""}`}
                    >
                      Pilih Paket
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CEK AREA */}
        <CekArea />

        {/* KEUNGGULAN */}
        <section id="keunggulan" className="section">
          <div className="container">
            <Reveal>
              <div className="section-header">
                <span className="section-label">Mengapa Memilih Kami</span>
                <h2>Keunggulan Dukodu</h2>
                <p>
                  Teknologi fiber optik terbaru dengan layanan terbaik untuk
                  seluruh keluarga.
                </p>
              </div>
            </Reveal>

            <div className="features-grid">
              {FEATURES.map((f) => (
                <Reveal key={f.title}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className={f.icon}></i>
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <TestimonialCarousel />

        {/* FAQ */}
        <FAQ />

        {/* CTA Final */}
        <section className="section">
          <div className="container">
            <Reveal>
              <div className="cta-box">
                <h2>
                  Siap Upgrade Internet{" "}
                  <span className="gradient-text">Rumah Anda?</span>
                </h2>
                <p>
                  Bergabunglah dengan ribuan pelanggan puas yang sudah menikmati
                  internet super cepat dari Dukodu.
                </p>
                <div className="cta-buttons">
                  <a href="/daftar" className="btn btn-primary btn-lg">
                    <i className="fas fa-rocket"></i>
                    Mulai Sekarang
                  </a>
                  <a href="/login" className="btn btn-ghost btn-lg">
                    <i className="fas fa-phone"></i>
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

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