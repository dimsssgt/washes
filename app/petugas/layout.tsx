import type { ReactNode } from "react";
import { Archivo_Black, Space_Mono } from "next/font/google";
import SidebarPetugas from "@/components/petugas/SidebarPetugas";
import "./petugas.css";

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
  return (
    <div className={`petugas ${archivo.variable} ${mono.variable}`}>
      <SidebarPetugas />
      <main className="pt-main">{children}</main>
    </div>
  );
}
