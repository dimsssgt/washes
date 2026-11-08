import type { ReactNode } from "react";
import { Archivo_Black, Space_Mono } from "next/font/google";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import "./admin.css";

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

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO (Orang 1): penjaga login dan peran, hanya "admin" yang boleh masuk ke sini.
  return (
    <div className={`admin ${archivo.variable} ${mono.variable}`}>
      <SidebarAdmin />
      <main className="ad-main">{children}</main>
    </div>
  );
}
