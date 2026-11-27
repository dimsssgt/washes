import type { Metadata } from "next";
import RiwayatPetugas from "@/components/petugas/RiwayatPetugas";
import { ambilRiwayatSelesai } from "@/lib/petugas/riwayat-db";
import { riwayatTiruan } from "@/lib/petugas/riwayat-tiruan";
import "./riwayat.css";

export const metadata: Metadata = { title: "Riwayat Petugas — Laundyku" };

export default async function HalamanRiwayat() {
  // Coba ambil dari database. Kalau gagal (null), pakai data tiruan sebagai cadangan.
  const dariDatabase = await ambilRiwayatSelesai();
  return <RiwayatPetugas awal={dariDatabase ?? riwayatTiruan} />;
}