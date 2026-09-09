"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw0TYJA7SsIgrZmfQgh0FLFHaNhFrYVlMNQ7nu-lhGKw&s=10",
    alt: "Foto Dukodu 1",
    icon: "fa-bolt",
    label: "Fiber Optik",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIBBYpaZjlLk_G7LvqJnbFglqJTA3iNTyabcPmLcweQg&s=10",
    alt: "Foto Dukodu 2",
    icon: "fa-wifi",
    label: "Koneksi Stabil",
  },
];

const INTERVAL_MS = 4500;

export default function PhotoSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const goto = (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="photo-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="photo-slider-track">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="photo-slider-slide"
            style={{ transform: `translateX(${(i - index) * 100}%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} loading="eager" />
            <span className="hero-photo-badge">
              <i className={`fas ${s.icon}`}></i> {s.label}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="photo-slider-arrow prev"
        onClick={() => goto(index - 1)}
        aria-label="Sebelumnya"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        type="button"
        className="photo-slider-arrow next"
        onClick={() => goto(index + 1)}
        aria-label="Berikutnya"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="photo-slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`photo-slider-dot ${i === index ? "active" : ""}`}
            onClick={() => goto(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}