"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePetugas } from "./PetugasProvider";
import LoncengPetugas from "./LoncengPetugas";
import { LABEL_BAGIAN } from "@/lib/petugas/alur";

const MENU = [
  { href: "/petugas", label: "Dashboard" },
  { href: "/petugas/pengerjaan", label: "Pengerjaan" },
  { href: "/petugas/riwayat", label: "Riwayat" },
  { href: "/petugas/profil", label: "Profil" },
];

export default function SidebarPetugas() {
  const pathname = usePathname();
  const router = useRouter();
  const { pengguna } = usePetugas();
  const [terbuka, setTerbuka] = useState(false);
  const label = LABEL_BAGIAN[pengguna.bagian];
  const inisial =
    pengguna.nama
      .split(" ")
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  useEffect(() => {
    setTerbuka(false);
  }, [pathname]);

  useEffect(() => {
    if (!terbuka) return;
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTerbuka(false);
    };
    document.addEventListener("keydown", tekan);
    return () => document.removeEventListener("keydown", tekan);
  }, [terbuka]);

  async function keluar() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="pt-topbar">
        <Link href="/petugas" className="pt-topbar-brand">
          LAUNDYKU
        </Link>
        <div className="pt-topbar-aksi">
          <LoncengPetugas />
          <Link
            href="/petugas/profil"
            className="pt-avatar"
            title="Profil saya"
            aria-label={`Profil ${pengguna.nama}`}
          >
            {inisial}
          </Link>
          <button
            type="button"
            className={`pt-hamburger${terbuka ? " terbuka" : ""}`}
            aria-label={terbuka ? "Tutup menu" : "Buka menu"}
            aria-expanded={terbuka}
            aria-controls="pt-drawer"
            onClick={() => setTerbuka((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`pt-overlay${terbuka ? " terbuka" : ""}`}
        onClick={() => setTerbuka(false)}
        aria-hidden="true"
      />

      <aside id="pt-drawer" className={`pt-side${terbuka ? " terbuka" : ""}`}>
        <div className="pt-drawer-head">
          <Link href="/petugas" className="pt-d pt-logo">
            Laundy
            <br />
            ku
          </Link>
          <button
            type="button"
            className="pt-drawer-close"
            aria-label="Tutup menu"
            onClick={() => setTerbuka(false)}
          >
            ✕
          </button>
        </div>

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

        <div className="pt-drawer-bawah">
          <div className="pt-user">
            <b>{pengguna.nama}</b>
            <br />
            {label}
          </div>
          <Link href="/petugas/profil" className="pt-profil-link">
            Profil
          </Link>
          <button type="button" className="pt-keluar" onClick={keluar}>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}