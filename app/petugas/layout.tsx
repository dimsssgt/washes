import type { ReactNode } from "react";
import { Archivo_Black, Space_Mono } from "next/font/google";
import SidebarPetugas from "@/components/petugas/SidebarPetugas";
import { NotifikasiProvider } from "@/components/petugas/NotifikasiProvider";
import { PetugasProvider } from "@/components/petugas/PetugasProvider";
import { buatKerjaTiruan } from "@/lib/petugas/alur-tiruan";
import { pesananMasukTiruan } from "@/lib/petugas/data-tiruan";
import { buatNotifikasiTiruan } from "@/lib/petugas/notifikasi-tiruan";
import "./petugas.css";
import "./notifikasi.css";
import "./alur.css";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});
const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function PetugasLayout({ children }: { children: ReactNode }) {
  // TODO (Orang 1): penjaga login dan peran, hanya akun "petugas" yang boleh masuk ke sini.
  // TODO (Supabase): ganti semua data tiruan di bawah dengan data dari database.
  const sekarang = new Date();

  return (
    <div className={`petugas ${archivo.variable} ${mono.variable}`}>
      <PetugasProvider antrianAwal={pesananMasukTiruan} kerjaAwal={buatKerjaTiruan(sekarang)}>
        <NotifikasiProvider awal={buatNotifikasiTiruan(sekarang)} sekarangIso={sekarang.toISOString()}>
          <SidebarPetugas />
          <main className="pt-main">{children}</main>
        </NotifikasiProvider>
      </PetugasProvider>
    </div>
  );
}
