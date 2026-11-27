import type { Metadata } from "next";
import PengaturanClient from "@/components/admin/PengaturanClient";
import { ambilPengaturan } from "@/lib/pengaturan/actions";

export const metadata: Metadata = { title: "Pengaturan — Admin Laundyku" };

export default async function HalamanPengaturan() {
  const awal = await ambilPengaturan();
  return <PengaturanClient tab="umum" awal={awal} />;
}