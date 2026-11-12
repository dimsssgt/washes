import type { Metadata } from "next";
import RiwayatPetugas from "@/components/petugas/RiwayatPetugas";
import { riwayatTiruan } from "@/lib/petugas/riwayat-tiruan";
import "./riwayat.css";

export const metadata: Metadata = { title: "Riwayat Petugas — Laundyku" };

export default function HalamanRiwayat() {
  // TODO: ganti data tiruan dengan data dari Supabase.
  return <RiwayatPetugas awal={riwayatTiruan} />;
}
