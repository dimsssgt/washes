import type { Metadata } from "next";
import PengaturanClient from "@/components/admin/PengaturanClient";
import { ambilPengaturan } from "@/lib/pengaturan/actions";

export const metadata: Metadata = { title: "Promo & Diskon — Admin Laundyku" };

export default async function HalamanPromo() {
  const awal = await ambilPengaturan();
  return <PengaturanClient tab="promo" awal={awal} />;
}
