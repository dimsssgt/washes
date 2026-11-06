import type { Metadata } from "next";

export const metadata: Metadata = { title: "Riwayat Petugas — Laundyku" };

// Halaman sementara supaya menu sidebar tidak 404. Akan diganti pada pekerjaan berikutnya.
export default function HalamanRiwayat() {
  return (
    <>
      <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Riwayat</h1>
      <p className="pt-hint">Halaman ini dikerjakan setelah dashboard selesai.</p>
    </>
  );
}
