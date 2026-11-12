import type { Metadata } from "next";
import HalamanNotifikasi from "@/components/petugas/HalamanNotifikasi";

export const metadata: Metadata = { title: "Notifikasi Petugas — Laundyku" };

export default function HalamanNotifikasiPetugas() {
  return <HalamanNotifikasi />;
}
