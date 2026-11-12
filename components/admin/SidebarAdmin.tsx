"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/kelola", label: "Kelola" },
  { href: "/admin/transaksi", label: "Transaksi & Report" },
  { href: "/admin/pengaturan", label: "Pengaturan" },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className="ad-side">
      <Link href="/" className="ad-d ad-logo">
        Laundy
        <br />
        ku
      </Link>

      <nav aria-label="Menu admin" className="ad-nav">
        {MENU.map((m) => {
          const aktif = m.href === "/admin" ? pathname === m.href : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`ad-menu${aktif ? " on" : ""}`}
              aria-current={aktif ? "page" : undefined}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.12)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 10,
          textDecoration: "none",
        }}
      >
        ← Beranda Utama
      </Link>
      {/* TODO: nama admin dari sesi login, dan tombol Keluar memakai Supabase signOut. */}
      <div className="ad-user">
        [Nama admin]
        <br />
        Admin
      </div>
      <Link href="/login" className="ad-keluar">
        Keluar
      </Link>
    </aside>
  );
}
