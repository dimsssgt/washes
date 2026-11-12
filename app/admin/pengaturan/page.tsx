import type { Metadata } from "next";
import PengaturanClient from "@/components/admin/PengaturanClient";

export const metadata: Metadata = { title: "Pengaturan — Admin Laundyku" };

export default function HalamanPengaturan() {
  return <PengaturanClient />;
}
