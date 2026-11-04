import type { Metadata } from "next";
import ProfilClient from "@/components/pelanggan/ProfilClient";

export const metadata: Metadata = { title: "Profil Pengguna — Laundyku" };

export default function ProfilPage() {
  return <ProfilClient />;
}
