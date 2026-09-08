"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatIDR } from "@/lib/auth";

interface Stats {
  totalCustomers: number;
  activeCustomers: number;
  pendingCustomers: number;
  totalPackages: number;
  activePackages: number;
  totalTickets: number;
  openTickets: number;
  totalRevenue: number;
  pendingBills: number;
  totalAreas: number;
  activeAreas: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="cms-page">
      <div className="cms-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan kinerja Dukodu Internet</p>
        </div>
        <div className="cms-page-actions">
          <Link href="/admin/tickets" className="cms-btn cms-btn-primary">
            <i className="fa-solid fa-headset" /> Tiket Masuk
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="cms-loading-inline"><div className="cms-loading-spinner" /></div>
      ) : stats ? (
        <>
          <div className="cms-stats-grid">
            <div className="cms-stat-card">
              <div className="cms-stat-icon red"><i className="fa-solid fa-users" /></div>
              <div>
                <span className="cms-stat-value">{stats.totalCustomers}</span>
                <span className="cms-stat-label">Total Pelanggan</span>
              </div>
              <span className="cms-stat-badge">{stats.activeCustomers} aktif</span>
            </div>
            <div className="cms-stat-card">
              <div className="cms-stat-icon gold"><i className="fa-solid fa-sack-dollar" /></div>
              <div>
                <span className="cms-stat-value">{formatIDR(stats.totalRevenue)}</span>
                <span className="cms-stat-label">Pendapatan</span>
              </div>
              <span className="cms-stat-badge">{formatIDR(stats.pendingBills)} yang harus dibayar</span>
            </div>
            <div className="cms-stat-card">
              <div className="cms-stat-icon green"><i className="fa-solid fa-ticket" /></div>
              <div>
                <span className="cms-stat-value">{stats.totalTickets}</span>
                <span className="cms-stat-label">Total Tiket</span>
              </div>
              <span className="cms-stat-badge">{stats.openTickets} terbuka</span>
            </div>
            <div className="cms-stat-card">
              <div className="cms-stat-icon blue"><i className="fa-solid fa-box-open" /></div>
              <div>
                <span className="cms-stat-value">{stats.activePackages}</span>
                <span className="cms-stat-label">Paket Aktif</span>
              </div>
              <span className="cms-stat-badge">{stats.activeAreas} area tercakup</span>
            </div>
          </div>

          <div className="cms-dash-grid">
            <div className="cms-card">
              <div className="cms-card-head">
                <h2><i className="fa-solid fa-list-check" /> Quick Actions</h2>
              </div>
              <div className="cms-quick-actions">
                <Link href="/admin/packages" className="cms-quick"><i className="fa-solid fa-layer-group" /> <span>Kelola Paket</span></Link>
                <Link href="/admin/tickets" className="cms-quick"><i className="fa-solid fa-wrench" /> <span>Proses Tiket</span></Link>
                <Link href="/admin/coverage" className="cms-quick"><i className="fa-solid fa-map" /> <span>Atur Coverage</span></Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="cms-empty">Data tidak tersedia.</div>
      )}
    </div>
  );
}