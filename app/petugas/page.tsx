import type { Metadata } from "next";
import DashboardPetugas from "@/components/petugas/DashboardPetugas";

export const metadata: Metadata = { title: "Dashboard Petugas — Laundyku" };

export default function HalamanDashboardPetugas() {
  return <DashboardPetugas />;
}
