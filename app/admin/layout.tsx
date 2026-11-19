import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import { transaksiTiruan } from "@/lib/admin/data-tiruan";
import "./admin.css";

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO (Orang 1): penjaga login dan peran, hanya "admin" yang boleh masuk ke sini.
  return (
    <div className={`admin ${jakarta.variable}`}>
      <SidebarAdmin jumlahTransaksi={transaksiTiruan.length} />
      <main className="ad-main">{children}</main>
    </div>
  );
}