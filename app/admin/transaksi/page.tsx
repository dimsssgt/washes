import type { Metadata } from "next";
import TransaksiClient from "@/components/admin/TransaksiClient";
import { transaksiTiruan } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Transaksi — Admin Laundyku" };

export default function HalamanTransaksi() {
  // TODO: ambil dari Supabase.
  return <TransaksiClient transaksiAwal={transaksiTiruan} />;
}
