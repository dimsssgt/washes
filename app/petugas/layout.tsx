import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import SidebarPetugas from "@/components/petugas/SidebarPetugas";
import { NotifikasiProvider } from "@/components/petugas/NotifikasiProvider";
import { PetugasProvider } from "@/components/petugas/PetugasProvider";
import { ambilPesananMasuk } from "@/lib/petugas/pesanan-db";
import { createClient } from "@/lib/supabase/server";
import type { Bagian } from "@/lib/petugas/alur";
import "./petugas.css";
import "./notifikasi.css";
import "./alur.css";
import "./mobile.css";

export default async function PetugasLayout({ children }: { children: ReactNode }) {
  // 1. Harus login. Tamu dikirim ke halaman login.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Peran dan bagian dibaca dari database.
  const { data: profil } = await supabase
    .from("profiles")
    .select("nama, peran, bagian, aktif")
    .eq("id", user.id)
    .single();

  // 3. Hanya petugas aktif yang boleh masuk.
  if (!profil || profil.peran !== "petugas" || !profil.aktif || !profil.bagian) {
    redirect("/login");
  }

  const sekarang = new Date();
  const pengguna = {
    nama: profil.nama || user.email || "Petugas",
    bagian: profil.bagian as Bagian,
  };

  // Semua data dibaca dari database. Yang belum tersambung dikirim kosong.
  const antrian = await ambilPesananMasuk();

  return (
    <div className="petugas">
      <PetugasProvider pengguna={pengguna} antrianAwal={antrian} kerjaAwal={[]}>
        <NotifikasiProvider awal={[]} sekarangIso={sekarang.toISOString()}>
          <SidebarPetugas />
          <main className="pt-main">{children}</main>
        </NotifikasiProvider>
      </PetugasProvider>
    </div>
  );
}