import type { Metadata } from "next";
import NotifikasiClient from "@/components/pelanggan/NotifikasiClient";

export const metadata: Metadata = { title: "Notifikasi — Laundyku" };

export default function NotifikasiPage() {
  return <NotifikasiClient />;
}
