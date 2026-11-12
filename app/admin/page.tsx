import type { Metadata } from "next";
import Link from "next/link";
import RekapClient from "@/components/admin/RekapClient";
import { transaksiTiruan } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Dashboard Admin — Laundyku" };

export default function HalamanDashboardAdmin() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 13,
            color: "#1457D6",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke Beranda Utama
        </Link>
      </div>
      <RekapClient transaksi={transaksiTiruan} />
    </>
  );
}
