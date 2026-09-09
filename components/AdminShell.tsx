"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAdminSession, clearAdminSession } from "@/lib/auth";

const NAV = [
  { href: "/admin", icon: "fa-chart-pie", label: "Dashboard", exact: true },
  { href: "/admin/packages", icon: "fa-box-open", label: "Paket Internet" },
  { href: "/admin/tickets", icon: "fa-headset", label: "Tiket Support" },
  { href: "/admin/coverage", icon: "fa-map-location-dot", label: "Coverage Map" },
  { href: "/admin/features", icon: "fa-star", label: "Keunggulan" },
  { href: "/admin/testimonials", icon: "fa-comment-dots", label: "Apa Kata Mereka" },
  { href: "/admin/faqs", icon: "fa-circle-question", label: "FAQ" },
];

const NAV_LOADING_MS = 450;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const prevPath = useRef(pathname);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    const session = getAdminSession();
    if (!session) {
      router.replace("/admin/login");
    } else {
      setAdmin(session);
    }
  }, [router, isLoginPage]);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setNavigating(true);
    const t = setTimeout(() => setNavigating(false), NAV_LOADING_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!admin) {
    return (
      <div className="cms-loading">
        <div className="cms-loading-spinner" />
        <p>Memuat halaman admin...</p>
      </div>
    );
  }

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/");
  };

  return (
    <div className={`cms-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <span className="cms-brand-dot">D</span>
          <div>
            <strong>Dukodu</strong>
            <em>Admin CMS</em>
          </div>
        </div>

        <nav className="cms-nav">
          {NAV.map((item) => {
            const active = item.exact 
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`cms-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fa-solid ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="cms-sidebar-footer">
          <Link href="/" className="cms-nav-item">
            <i className="fa-solid fa-globe" />
            <span>Lihat Website</span>
          </Link>
          <button className="cms-nav-item cms-logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="cms-main">
        <header className="cms-topbar">
          <button className="cms-hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <i className="fa-solid fa-bars" />
          </button>
          <div className="cms-topbar-user">
            <span className="cms-topbar-role">{admin.role}</span>
            <span className="cms-topbar-name">{admin.nama}</span>
            <span className="cms-avatar"><i className="fa-solid fa-user-shield" /></span>
          </div>
        </header>

        <main className="cms-content">
          {navigating && (
            <div className="cms-nav-loading">
              <div className="cms-loading-spinner" />
              <p>Memuat...</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
