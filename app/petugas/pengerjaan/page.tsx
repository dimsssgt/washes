import type { Metadata } from "next";
import PengerjaanPetugas from "@/components/petugas/PengerjaanPetugas";
import "./pengerjaan.css";

export const metadata: Metadata = { title: "Pengerjaan — Laundyku" };

export default function HalamanPengerjaan() {
  return <PengerjaanPetugas />;
}
