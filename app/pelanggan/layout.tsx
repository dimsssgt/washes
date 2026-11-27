import type { Metadata } from "next";
import PelangganSidebar from "@/components/pelanggan/PelangganSidebar";
import "./pelanggan.css";

export const metadata: Metadata = { title: "Dashboard — Laundyku" };

export default function PelangganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pelanggan-container">
      <PelangganSidebar />
      <main className="pelanggan-main">
        {children}
      </main>
    </div>
  );
}
