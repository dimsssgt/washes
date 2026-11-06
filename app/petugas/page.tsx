import type { Metadata } from "next";
import DashboardPetugas from "@/components/petugas/DashboardPetugas";
import { pesananMasukTiruan } from "@/lib/petugas/data-tiruan";

export const metadata: Metadata = { title: "Dashboard Petugas — Laundyku" };

export default function HalamanDashboardPetugas() {
  // TODO: ganti data tiruan dengan data dari Supabase (server component bisa langsung query).
  return (
    <DashboardPetugas
      pesananAwal={pesananMasukTiruan}
      sedangDiproses={5}
      siapDiserahkan={3}
    />
  );
}
