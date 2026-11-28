import type { Metadata } from "next";
import NotifikasiClient from "@/components/pelanggan/NotifikasiClient";
import { ambilNotifikasiSaya } from "@/lib/pelanggan/actions";

export const metadata: Metadata = { title: "Notifikasi — Laundyku" };

export default async function NotifikasiPage() {
  const data = await ambilNotifikasiSaya();
  return <NotifikasiClient data={data} />;
}