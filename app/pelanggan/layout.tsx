import type { Metadata } from "next";
import PelangganSidebar from "@/components/pelanggan/PelangganSidebar";

export const metadata: Metadata = { title: "Dashboard — Laundyku" };

export default function PelangganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "270px 1fr",
        minHeight: "100vh",
        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
        color: "#0B2A6B",
        background: "#EEF2F7",
      }}
    >
      <PelangganSidebar />
      <main
        style={{
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
          background: "#EEF2F7",
          minHeight: "100vh",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
