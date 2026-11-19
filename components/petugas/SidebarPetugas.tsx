"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePetugas } from "./PetugasProvider";
import { LABEL_BAGIAN } from "@/lib/petugas/alur";

const MENU = [
  { href: "/petugas", label: "Dashboard" },
  { href: "/petugas/pengerjaan", label: "Pengerjaan" },
  { href: "/petugas/riwayat", label: "Riwayat" },
];

export default function SidebarPetugas() {
  const pathname = usePathname();
  const router = useRouter();
  const { pengguna } = usePetugas();

  async function keluar() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

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

      <button type="button" className="pt-keluar" onClick={keluar}>
        Keluar
      </button>
    </aside>
  );
}