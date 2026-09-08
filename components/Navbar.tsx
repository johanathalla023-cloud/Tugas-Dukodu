"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LOGO =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz226FoSaYk0w24v0a_7m63JKed5o3yzlxXAnnfqoG8g&s=10";

type LinkItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  links: LinkItem[];
  cta?: { label: string; href: string; primary?: boolean };
  onCtaClick?: () => void;
};

export default function Navbar({ links, cta, onCtaClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="nav-wrapper">
          <div className="brand-group">
            <Link href="/" className="logo-brand" onClick={closeMenu}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO} alt="Dukodu" className="logo-img" />
            </Link>
          </div>

          <nav className={`nav-links${open ? " mobile-open" : ""}`} id="navLinks">
            {links.map((l) => (
              <Link key={l.label} href={l.href} onClick={closeMenu}>
                {l.label}
              </Link>
            ))}
            {cta &&
              (onCtaClick ? (
                <button className="btn-nav btn-nav-primary" onClick={() => { closeMenu(); onCtaClick(); }}>
                  {cta.label}
                </button>
              ) : (
                <Link href={cta.href} className="btn-nav btn-nav-primary" onClick={closeMenu}>
                  {cta.label}
                </Link>
              ))}
          </nav>

          <div className="nav-auth">
            {cta &&
              (onCtaClick ? (
                <button className="btn-nav btn-nav-primary" onClick={onCtaClick}>
                  {cta.label}
                </button>
              ) : (
                <Link href={cta.href} className="btn-nav btn-nav-primary">
                  {cta.label}
                </Link>
              ))}
          </div>

          <div
            className={`hamburger${open ? " active" : ""}`}
            id="hamburger"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
