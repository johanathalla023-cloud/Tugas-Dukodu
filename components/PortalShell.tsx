"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCustomerSession, clearCustomerSession } from "@/lib/auth";

const NAV = [
  { href: "/portal", icon: "fa-house", label: "Dashboard", exact: true },
  { href: "/portal/bills", icon: "fa-file-invoice-dollar", label: "Tagihan Saya" },
  { href: "/portal/payment", icon: "fa-credit-card", label: "Pembayaran" },
  { href: "/portal/tickets", icon: "fa-headset", label: "Tiket Support" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [customer, setCustomer] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) {
      router.replace("/login");
    } else {
      setCustomer(session);
    }
  }, [router]);

  if (!customer) {
    return (
      <div className="cms-loading">
        <div className="cms-loading-spinner" />
        <p>Memuat portal pelanggan...</p>
      </div>
    );
  }

  const handleLogout = () => {
    clearCustomerSession();
    router.replace("/");
  };

  return (
    <div className={`portal-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <span className="portal-brand-dot"><i className="fa-solid fa-tower-cell" /></span>
          <div>
            <strong>Portal Pelanggan</strong>
            <em>Dukodu Internet</em>
          </div>
        </div>

        <div className="portal-user">
          <span className="portal-user-avatar"><i className="fa-solid fa-user" /></span>
          <div>
            <strong>{customer.namaLengkap}</strong>
            <em>{customer.noPelanggan}</em>
          </div>
        </div>

        <nav className="portal-nav">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`portal-nav-item ${active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`fa-solid ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="portal-sidebar-footer">
          <Link href="/" className="portal-nav-item">
            <i className="fa-solid fa-globe" />
            <span>Lihat Website</span>
          </Link>
          <button className="portal-nav-item portal-logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button className="portal-hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <i className="fa-solid fa-bars" />
          </button>
          <div className="portal-topbar-title">
            <i className="fa-solid fa-tower-cell" /> Dukodu Customer Center
          </div>
          <div className="portal-topbar-status">
            <span className={`portal-status-dot ${customer.status === "active" ? "on" : "off"}`} />
            {customer.status === "active" ? "Layanan Aktif" : customer.status === "pending" ? "Menunggu Pasang" : "Layanan Terhenti"}
          </div>
        </header>

        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}