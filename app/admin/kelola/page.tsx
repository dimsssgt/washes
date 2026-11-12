import type { Metadata } from "next";
import Link from "next/link";
import KelolaClient from "@/components/admin/KelolaClient";
import { hargaAwal, layananAwal, penggunaAwal } from "@/lib/admin/data-tiruan";

export const metadata: Metadata = { title: "Kelola — Admin Laundyku" };

export default function HalamanKelola() {
  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Link
          href="/admin"
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
          ← Kembali ke Dashboard Admin
        </Link>
      </div>
      <KelolaClient layananAwal={layananAwal} hargaAwal={hargaAwal} penggunaAwal={penggunaAwal} />
    </>
  );
}
