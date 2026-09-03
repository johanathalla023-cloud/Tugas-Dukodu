"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const TESTIMONIALS = [
  {
    text: '"Koneksi internet Dukodu benar-benar mengubah hidup saya. Kecepatan stabil, support responsif, dan harga yang sangat terjangkau. Sangat merekomendasikan!"',
    name: "Budi Santoso",
    title: "Freelancer",
    initials: "BS",
  },
  {
    text: '"Sebagai gamer, saya butuh kecepatan dan stabilitas. Dukodu memberikan keduanya dengan harga jauh lebih murah dari kompetitor. Puas!"',
    name: "Rini Wijaya",
    title: "Content Creator",
    initials: "RW",
  },
  {
    text: '"Proses instalasi sangat cepat dan tim support mereka luar biasa membantu. Internet stabil untuk kebutuhan kantor rumahan saya."',
    name: "Ahmad Pratama",
    title: "Entrepreneur",
    initials: "AP",
  },
];

export default function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const rotateRight = useCallback((steps: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    for (let s = 0; s < steps; s++) {
      const current = Array.from(track.children) as HTMLElement[];
      const firsts = current.map((c) => c.getBoundingClientRect().left);
      const last = current[current.length - 1];
      track.prepend(last);
      void track.offsetWidth;
      const lasts = current.map((c) => c.getBoundingClientRect().left);
      current.forEach((c, i) => {
        c.style.transition = "none";
        c.style.transform = `translateX(${firsts[i] - lasts[i]}px)`;
      });
      void track.offsetWidth;
      current.forEach((c) => {
        c.style.transition =
          "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)";
        c.style.transform = "translateX(0)";
      });
    }
    setActiveDot((prev) => (prev + steps) % TESTIMONIALS.length);
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => rotateRight(1), 3000);
  }, [rotateRight]);

  function stopAuto() {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto]);

  const handleDotClick = (index: number) => {
    const n = TESTIMONIALS.length;
    const steps = (n - index) % n;
    if (steps > 0) rotateRight(steps);
    startAuto();
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Kepercayaan Pelanggan</span>
          <h2>Apa Kata Mereka</h2>
          <p>Ribuan pelanggan telah merasakan bedanya internet Dukodu.</p>
        </div>

        <div
          className="testimonial-carousel"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <div className="testimonial-track" ref={trackRef}>
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.initials}>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <i className="fas fa-star" key={i}></i>
                  ))}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-title">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot${activeDot === i ? " active" : ""}`}
                aria-label={`Tampilkan testimoni ${i + 1}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}