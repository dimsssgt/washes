import type { Metadata } from "next";
import RiwayatPetugas from "@/components/petugas/RiwayatPetugas";
import { ambilRiwayatSelesai } from "@/lib/petugas/riwayat-db";
import "./riwayat.css";

export const metadata: Metadata = { title: "Riwayat Petugas — Laundyku" };

export default async function HalamanRiwayat() {
  // Dari database. Kalau gagal, tampil kosong (bukan data palsu).
  const dariDatabase = await ambilRiwayatSelesai();
  return <RiwayatPetugas awal={dariDatabase ?? []} />;
}