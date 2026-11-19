"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  href: string;
  label: string;
  badge?: number;
}

export default function SidebarAdmin({ jumlahTransaksi = 0 }: { jumlahTransaksi?: number }) {
  const pathname = usePathname();

  const ANALITIK: MenuItem[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/kelola", label: "Kelola" },
    { href: "/admin/transaksi", label: "Transaksi & Report", badge: jumlahTransaksi },
  ];
  const RUANG_KERJA: MenuItem[] = [{ href: "/admin/pengaturan", label: "Pengaturan" }];

  const aktifKah = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const renderMenu = (daftar: MenuItem[]) =>
    daftar.map((m) => {
      const aktif = aktifKah(m.href);
      return (
        <Link
          key={m.href}
          href={m.href}
          className={`ad-menu${aktif ? " on" : ""}`}
          aria-current={aktif ? "page" : undefined}
        >
          {m.label}
          {m.badge !== undefined && <span className="ad-badge">{m.badge}</span>}
        </Link>
      );
    });

  return (
    <aside className="ad-side">
      <Link href="/" className="ad-brand">
        <span className="ad-brand-ikon">L</span>
        <span>
          <strong>Laundyku</strong>
          <small>Outlet Pusat</small>
        </span>
      </Link>

      <div className="ad-cari" aria-hidden="true">
        <span>Cari...</span>
        <kbd>⌘K</kbd>
      </div>

      <p className="ad-grup">Analitik</p>
      <nav aria-label="Menu admin" className="ad-nav">
        {renderMenu(ANALITIK)}
      </nav>

      <p className="ad-grup">Ruang kerja</p>
      <nav aria-label="Ruang kerja" className="ad-nav">
        {renderMenu(RUANG_KERJA)}
      </nav>

      <div style={{ flex: 1 }} />

      {/* TODO: nama dan email admin dari sesi login, tombol Keluar memakai Supabase signOut. */}
      <div className="ad-user-kartu">
        <span className="ad-avatar">AD</span>
        <div>
          <strong>Admin Laundyku</strong>
          <small>admin@laundyku.id</small>
        </div>
      </div>
      <Link href="/login" className="ad-keluar">
        Keluar
      </Link>
    </aside>
  );
}