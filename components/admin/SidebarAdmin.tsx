"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface MenuItem {
  href: string;
  label: string;
  badge?: number;
}

export default function SidebarAdmin({
  jumlahTransaksi = 0,
  pengguna,
}: {
  jumlahTransaksi?: number;
  pengguna: { nama: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);

  const inisial = pengguna.nama
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function keluar() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

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
          onClick={() => setTerbuka(false)}
        >
          {m.label}
          {m.badge !== undefined && <span className="ad-badge">{m.badge}</span>}
        </Link>
      );
    });

  return (
    <>
      {/* Bilah atas khusus layar kecil */}
      <div className="ad-topbar">
        <button
          type="button"
          className="ad-hamburger"
          aria-label={terbuka ? "Tutup menu" : "Buka menu"}
          aria-expanded={terbuka}
          aria-controls="ad-sidebar"
          onClick={() => setTerbuka((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="ad-brand">
          <span className="ad-brand-ikon">L</span>
          <span>
            <strong>Laundyku</strong>
          </span>
        </Link>
      </div>

      {/* Latar gelap di belakang menu saat terbuka di layar kecil */}
      <div
        className={`ad-overlay${terbuka ? " terbuka" : ""}`}
        onClick={() => setTerbuka(false)}
        aria-hidden="true"
      />

      <aside id="ad-sidebar" className={`ad-side${terbuka ? " terbuka" : ""}`}>
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
        
        {pathname.startsWith("/admin/pengaturan") && (
          <nav aria-label="Submenu pengaturan" className="ad-nav ad-sub">
            <Link
              href="/admin/pengaturan"
              className={`ad-menu ad-submenu${pathname === "/admin/pengaturan" ? " on" : ""}`}
              aria-current={pathname === "/admin/pengaturan" ? "page" : undefined}
              onClick={() => setTerbuka(false)}
            >
              Umum
            </Link>
            <Link
              href="/admin/pengaturan/promo"
              className={`ad-menu ad-submenu${pathname.startsWith("/admin/pengaturan/promo") ? " on" : ""}`}
              aria-current={pathname.startsWith("/admin/pengaturan/promo") ? "page" : undefined}
              onClick={() => setTerbuka(false)}
            >
              Promo &amp; Diskon
            </Link>
          </nav>
        )}
        <div style={{ flex: 1 }} />

        <div className="ad-user-kartu">
          <span className="ad-avatar">{inisial}</span>
          <div>
            <strong>{pengguna.nama}</strong>
            <small>{pengguna.email}</small>
          </div>
        </div>
        <button type="button" className="ad-keluar" onClick={keluar}>
          Keluar
        </button>
      </aside>
    </>
  );
}