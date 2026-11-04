import type { Metadata } from "next";
import PesananAktifClient from "@/components/pelanggan/PesananAktifClient";

export const metadata: Metadata = { title: "Pesanan Aktif — Laundyku" };

export default function AktifPage() {
  return <PesananAktifClient />;
}
