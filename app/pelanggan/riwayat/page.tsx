import type { Metadata } from "next";
import RiwayatPesananClient from "@/components/pelanggan/RiwayatPesananClient";

export const metadata: Metadata = { title: "Riwayat Pesanan — Laundyku" };

export default function RiwayatPage() {
  return <RiwayatPesananClient />;
}
