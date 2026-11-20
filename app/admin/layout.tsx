import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import { transaksiTiruan } from "@/lib/admin/data-tiruan";
import "./admin.css";

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 1. Harus login. Tamu dikirim ke halaman login.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Peran dibaca dari database, bukan dari form atau cookie.
  const { data: profil } = await supabase
    .from("profiles")
    .select("nama, peran, aktif")
    .eq("id", user.id)
    .single();

  // 3. Hanya admin aktif yang boleh masuk.
  if (!profil || profil.peran !== "admin" || !profil.aktif) redirect("/login");

  const pengguna = {
    nama: profil.nama || user.email || "Admin",
    email: user.email ?? "",
  };

  return (
    <div className={`admin ${jakarta.variable}`}>
      <SidebarAdmin jumlahTransaksi={transaksiTiruan.length} pengguna={pengguna} />
      <main className="ad-main">{children}</main>
    </div>
  );
}