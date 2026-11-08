import type { Metadata } from "next";
import RekapClient from "@/components/admin/RekapClient";
import { transaksiTiruan } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Rekap Pendapatan — Admin Laundyku" };

export default function HalamanRekap() {
  // TODO: ambil dari Supabase (agregasi bisa dilakukan di database).
  return <RekapClient transaksi={transaksiTiruan} />;
}
