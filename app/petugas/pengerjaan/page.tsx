import type { Metadata } from "next";
import PengerjaanPetugas from "@/components/petugas/PengerjaanPetugas";
import { pesananKerjaTiruan } from "@/lib/petugas/pengerjaan-tiruan";
import "./pengerjaan.css";

export const metadata: Metadata = { title: "Pengerjaan — Laundyku" };

export default function HalamanPengerjaan() {
  // TODO: ganti data tiruan dengan data dari Supabase.
  return <PengerjaanPetugas awal={pesananKerjaTiruan} />;
}
