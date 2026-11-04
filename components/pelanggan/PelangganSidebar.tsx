"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/pelanggan", label: "Pesanan" },
  { href: "/pelanggan/aktif", label: "Pesanan Aktif" },
  { href: "/pelanggan/riwayat", label: "Riwayat" },
  { href: "/pelanggan/notifikasi", label: "Notifikasi" },
];

export default function PelangganSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        background: "#1457D6",
        color: "#fff",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <Link
        href="/pelanggan"
        style={{
          fontFamily: "'Archivo Black', Impact, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          fontSize: 22,
          color: "#FFD21F",
          padding: 0,
          marginBottom: 24,
          textDecoration: "none",
          display: "block",
        }}
      >
        Laundy
        <br />
        ku
      </Link>

      {/* Nav links */}
      {navItems.map((item) => {
        const isActive =
          item.href === "/pelanggan"
            ? pathname === "/pelanggan"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: 44,
              padding: "0 16px",
              borderRadius: 12,
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              textDecoration: "none",
              color: isActive ? "#0B2A6B" : "#fff",
              background: isActive ? "#FFD21F" : "transparent",
              transition: "background 0.15s",
            }}
          >
            {item.label}
          </Link>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User info */}
      <div
        style={{
          background: "rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: 14,
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {/* TODO: ganti dengan nama user dari session */}
        [Nama pelanggan]
        <br />
        Pelanggan
      </div>

      {/* Profil & Keluar */}
      <Link
        href="/pelanggan/profil"
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: 44,
          padding: "0 16px",
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        Profil
      </Link>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: 44,
          padding: "0 16px",
          borderRadius: 12,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          color: "#fff",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        onClick={() => {
          // TODO: panggil API logout saat backend sudah siap
          window.location.href = "/login";
        }}
      >
        Keluar
      </button>
    </aside>
  );
}
