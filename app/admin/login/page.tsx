"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAdminSession } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }
      setAdminSession(data.admin);
      router.replace("/admin");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="cms-login-wrap">
      <div
        className="cms-login-bg"
        style={{
          background: "linear-gradient(135deg, #1a0505 0%, #4d0a0a 40%, #dc1212 100%)",
        }}
      />
      <div className="cms-login-card">
        <div className="cms-login-logo">
          <span className="cms-brand-dotc"><i className="fa-solid fa-tower-cell" /></span>
          <h1>Dukodu Admin</h1>
          <p>Content Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="cms-login-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="cms-login-error"><i className="fa-solid fa-circle-exclamation" /> {error}</div>}

          <button type="submit" className="cms-btn cms-btn-primary cms-btn-block" disabled={loading}>
            {loading ? "Memproses..." : "Masuk ke Admin"}
          </button>
        </form>

        <Link href="/" className="cms-login-back"><i className="fa-solid fa-arrow-left" /> Kembali ke Website</Link>

        <div className="cms-login-hint">
          <p>Demo admin: <code>admin</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}