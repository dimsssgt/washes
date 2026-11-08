"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/admin", label: "Kelola" },
  { href: "/admin/transaksi", label: "Transaksi" },
  { href: "/admin/rekap", label: "Rekap pendapatan" },
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
