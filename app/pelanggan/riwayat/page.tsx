import type { Metadata } from "next";
import RiwayatPesananClient from "@/components/pelanggan/RiwayatPesananClient";
import { ambilRiwayatSaya } from "@/lib/pelanggan/actions";

export const metadata: Metadata = { title: "Riwayat Pesanan — Laundyku" };

export default async function RiwayatPage() {
  const data = await ambilRiwayatSaya();
  return <RiwayatPesananClient data={data} />;
}