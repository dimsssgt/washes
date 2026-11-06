"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/petugas", label: "Dashboard" },
  { href: "/petugas/pengerjaan", label: "Pengerjaan" },
  { href: "/petugas/riwayat", label: "Riwayat" },
];

export default function SidebarPetugas() {
  const pathname = usePathname();

  return (
    <aside className="pt-side">
      <Link href="/" className="pt-d pt-logo">
        Laundy
        <br />
        ku
      </Link>

      <nav aria-label="Menu petugas" className="pt-nav">
        {MENU.map((m) => {
          const aktif = m.href === "/petugas" ? pathname === m.href : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`pt-menu${aktif ? " on" : ""}`}
              aria-current={aktif ? "page" : undefined}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />
      {/* TODO: nama petugas dari sesi login, dan tombol Keluar memakai Supabase signOut. */}
      <div className="pt-user">
        [Nama petugas]
        <br />
        Petugas
      </div>
      <Link href="/login" className="pt-keluar">
        Keluar
      </Link>
    </aside>
  );
}
