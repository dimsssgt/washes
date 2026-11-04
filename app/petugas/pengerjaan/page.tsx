import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pengerjaan Petugas — Laundyku" };

// Halaman sementara supaya menu sidebar tidak 404. Akan diganti pada pekerjaan berikutnya.
export default function HalamanPengerjaan() {
  return (
    <>
      <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Pengerjaan</h1>
      <p className="pt-hint">Halaman ini dikerjakan setelah dashboard selesai.</p>
    </>
  );
}
