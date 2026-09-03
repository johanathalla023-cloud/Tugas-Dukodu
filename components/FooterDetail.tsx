import Link from "next/link";

export default function FooterDetail() {
  return (
    <section className="footer-detail">
      <div className="footer-detail-grid">
        <div className="footer-detail-col">
          <h3>DUKODU</h3>
          <div className="detail-items">
            <div className="detail-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <p>
                  Margonda Raya Jl. Salak No 520 Ruko B-C, Kel. Pondok Cina,
                  Kecamatan Beji, Kota Depok, Jawa Barat 16424
                </p>
              </div>
            </div>
            <div className="detail-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <p>
                  Jalan Ahmad Yani 1 Komplek Ayani Megamall Ruko No. C 9-10
                  Kelurahan Parit Tokaya, Pontianak Selatan - 78123
                </p>
              </div>
            </div>
            <div className="detail-item">
              <i className="fas fa-phone"></i>
              <div>
                <p>+62 811-5634-634 (Chat Only)</p>
              </div>
            </div>
            <div className="detail-item">
              <i className="fas fa-envelope"></i>
              <div>
                <p>cs@dukodu.id</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-detail-col">
          <h3>Social Media</h3>
          <div className="detail-items">
            <div className="detail-item">
              <i className="fab fa-facebook"></i>
              <p>Official Facebook Dukodu</p>
            </div>
            <div className="detail-item">
              <i className="fab fa-x-twitter"></i>
              <p>Official Twitter Dukodu</p>
            </div>
            <div className="detail-item">
              <i className="fab fa-instagram"></i>
              <p>Official Instagram Dukodu</p>
            </div>
            <div className="detail-item">
              <i className="fab fa-linkedin"></i>
              <p>Official LinkedIn Dukodu</p>
            </div>
            <div className="detail-item">
              <i className="fab fa-whatsapp"></i>
              <p>Official Whatsapp Dukodu</p>
            </div>
          </div>
        </div>

        <div className="footer-detail-col">
          <h3>Coverage Area</h3>
          <p className="coverage-title">DUKODU INTERNET BROADBAND</p>
          <p className="coverage-title">DUKODU HOME</p>
          <p className="coverage-areas">
            DEPOK | BOGOR | CIREBON | KOTA BEKASI | KALIMANTAN BARAT
          </p>

          <div className="owned-by">
            <p>
              <strong>Owned By :</strong>
            </p>
            <p className="company-name">PT Dukodu Digital Solution</p>
          </div>

          <div className="subsidiary-of">
            <p>
              <strong>Subsidiary Of :</strong>
            </p>
            <p className="company-name">Trans Hybrid</p>
          </div>
        </div>
      </div>
    </section>
  );
}