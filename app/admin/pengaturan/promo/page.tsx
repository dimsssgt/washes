import type { Metadata } from "next";
import PengaturanClient from "@/components/admin/PengaturanClient";

export const metadata: Metadata = { title: "Promo & Diskon — Admin Laundyku" };

export default function HalamanPromo() {
  return <PengaturanClient tab="promo" />;
}