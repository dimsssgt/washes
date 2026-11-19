import type { Metadata } from "next";
import RekapClient from "@/components/admin/RekapClient";
import { pesananAktifTiruan, transaksiTiruan } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Dashboard Admin — Laundyku" };

export default function HalamanDashboardAdmin() {
  return <RekapClient transaksi={transaksiTiruan} pesananAktif={pesananAktifTiruan} />;
}