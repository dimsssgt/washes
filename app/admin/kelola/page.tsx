import type { Metadata } from "next";
import KelolaClient from "@/components/admin/KelolaClient";
import { hargaAwal, layananAwal, penggunaAwal } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Kelola — Admin Laundyku" };

export default function HalamanKelola() {
  return <KelolaClient layananAwal={layananAwal} hargaAwal={hargaAwal} penggunaAwal={penggunaAwal} />;
}