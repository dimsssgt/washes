import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Archivo_Black, Space_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import SidebarPetugas from "@/components/petugas/SidebarPetugas";
import { NotifikasiProvider } from "@/components/petugas/NotifikasiProvider";
import { PetugasProvider } from "@/components/petugas/PetugasProvider";
import { buatKerjaTiruan } from "@/lib/petugas/alur-tiruan";
import { pesananMasukTiruan } from "@/lib/petugas/data-tiruan";
import { buatNotifikasiTiruan } from "@/lib/petugas/notifikasi-tiruan";
import type { Bagian } from "@/lib/petugas/alur";
import "./petugas.css";
import "./notifikasi.css";
import "./alur.css";
import "./mobile.css";

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export default async function PetugasLayout({ children }: { children: ReactNode }) {
  // 1. Harus login. Tamu dikirim ke halaman login.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Peran dan bagian dibaca dari database, bukan dari form atau cookie.
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
  const pengguna = { nama: profil.nama || user.email || "Petugas", bagian: profil.bagian as Bagian };

  return (
    <div className={`petugas ${archivo.variable} ${mono.variable}`}>
      <PetugasProvider
        pengguna={pengguna}
        antrianAwal={pesananMasukTiruan}
        kerjaAwal={buatKerjaTiruan(sekarang)}
      >
        <NotifikasiProvider awal={buatNotifikasiTiruan(sekarang)} sekarangIso={sekarang.toISOString()}>
          <SidebarPetugas />
          <main className="pt-main">{children}</main>
        </NotifikasiProvider>
      </PetugasProvider>
    </div>
  );
}