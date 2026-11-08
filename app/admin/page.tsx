import type { Metadata } from "next";
import KelolaClient from "@/components/admin/KelolaClient";
import { hargaAwal, layananAwal, penggunaAwal } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Dashboard Admin — Laundyku" };

export default function HalamanKelola() {
  // TODO: ganti data tiruan dengan data dari Supabase (server component bisa langsung query).
  return <KelolaClient layananAwal={layananAwal} hargaAwal={hargaAwal} penggunaAwal={penggunaAwal} />;
}
