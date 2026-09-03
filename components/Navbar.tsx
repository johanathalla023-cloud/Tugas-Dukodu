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
  cta: { label: string; href: string; primary?: boolean };
};

export default function Navbar({ links, cta }: NavbarProps) {
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
          <Link href="/" className="logo-brand" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Dukodu" className="logo-img" />
          </Link>

          <nav className={`nav-links${open ? " mobile-open" : ""}`} id="navLinks">
            {links.map((l) => (
              <Link key={l.label} href={l.href} onClick={closeMenu}>
                {l.label}
              </Link>
            ))}
            <Link href={cta.href} className="btn-nav" onClick={closeMenu}>
              {cta.label}
            </Link>
          </nav>

          <div className="nav-auth">
            <Link href={cta.href} className="btn-nav">
              {cta.label}
            </Link>
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
