import type { ReactNode } from "react";
import { Archivo_Black, Space_Mono } from "next/font/google";
import SidebarPetugas from "@/components/petugas/SidebarPetugas";
import { NotifikasiProvider } from "@/components/petugas/NotifikasiProvider";
import { buatNotifikasiTiruan } from "@/lib/petugas/notifikasi-tiruan";
import "./petugas.css";
import "./notifikasi.css";

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
  // TODO (Orang 1): penjaga login dan peran, hanya "petugas" yang boleh masuk ke sini.
  // TODO (Supabase): ganti data tiruan dengan notifikasi milik petugas yang sedang login.
  const sekarang = new Date();

  return (
    <div className={`petugas ${archivo.variable} ${mono.variable}`}>
      <NotifikasiProvider awal={buatNotifikasiTiruan(sekarang)} sekarangIso={sekarang.toISOString()}>
        <SidebarPetugas />
        <main className="pt-main">{children}</main>
      </NotifikasiProvider>
    </div>
  );
}
