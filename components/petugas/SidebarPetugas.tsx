"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePetugas } from "./PetugasProvider";
import { DAFTAR_BAGIAN, LABEL_BAGIAN, type Bagian } from "@/lib/petugas/alur";

const MENU = [
  { href: "/petugas", label: "Dashboard" },
  { href: "/petugas/pengerjaan", label: "Pengerjaan" },
  { href: "/petugas/riwayat", label: "Riwayat" },
];

export default function SidebarPetugas() {
  const pathname = usePathname();
  const { pengguna, gantiBagianDemo } = usePetugas();

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
            <Link key={m.href} href={m.href} className={`pt-menu${aktif ? " on" : ""}`} aria-current={aktif ? "page" : undefined}>
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div className="pt-user">
        {pengguna.nama}
        <br />
        {LABEL_BAGIAN[pengguna.bagian]}
      </div>

      {/* DEMO: di aplikasi asli bagian ditentukan oleh akun yang login (kolom bagian di profil petugas). */}
      <div className="pt-demo">
        <label htmlFor="pt-bagian-demo">Masuk sebagai (demo)</label>
        <select id="pt-bagian-demo" value={pengguna.bagian} onChange={(e) => gantiBagianDemo(e.target.value as Bagian)}>
          {DAFTAR_BAGIAN.map((b) => (
            <option key={b} value={b}>
              {LABEL_BAGIAN[b]}
            </option>
          ))}
        </select>
      </div>

      <Link href="/login" className="pt-keluar">
        Keluar
      </Link>
    </aside>
  );
}
