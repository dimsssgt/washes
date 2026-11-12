import type { Metadata } from "next";
import Link from "next/link";
import BuatPesananSection from "@/components/pelanggan/BuatPesananSection";
import AntrianPesananSection from "@/components/pelanggan/AntrianPesananSection";

export const metadata: Metadata = { title: "Pesanan — Laundyku" };

// Data dummy — akan diganti dengan data dari database
const statsDummy = {
  pesananAktif: 2,
  tagihanBelumBayar: 29000,
  totalPesanan: 12,
};

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PelangganPage() {
  return (
    <>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Notifikasi bell */}
        <Link
          href="/pelanggan/notifikasi"
          title="Notifikasi"
          aria-label="Notifikasi"
          style={{
            marginLeft: "auto",
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            border: "2px solid #0B2A6B",
            borderRadius: 12,
            background: "#fff",
            color: "#0B2A6B",
            flexShrink: 0,
            order: 2,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          {/* Badge notifikasi */}
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#D42A25",
              border: "2px solid #0B2A6B",
            }}
          />
        </Link>

        <h1
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
            fontSize: 40,
            color: "#1457D6",
            order: 1,
          }}
        >
          {/* TODO: ganti [Nama] dengan nama user dari session */}
          Halo, [Nama]!
        </h1>

        <Link
          href="#buat-pesanan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFD21F",
            color: "#0B2A6B",
            fontFamily: "'Archivo Black', sans-serif",
            textTransform: "uppercase",
            fontSize: 13,
            padding: "10px 22px",
            borderRadius: 999,
            minHeight: 44,
            border: "none",
            cursor: "pointer",
            boxShadow: "inset 0 0 0 2px #0B2A6B",
            textDecoration: "none",
            order: 3,
          }}
        >
          Buat Pesanan
        </Link>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {[
          { label: "Pesanan aktif", value: statsDummy.pesananAktif },
          { label: "Tagihan belum dibayar", value: formatRupiah(statsDummy.tagihanBelumBayar) },
          { label: "Total pesanan", value: statsDummy.totalPesanan },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 20,
              color: "#0B2A6B",
            }}
          >
            <div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12 }}>{s.label}</div>
            <div
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1,
                fontSize: 28,
                marginTop: 8,
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Form buat pesanan */}
      <BuatPesananSection />

      {/* Tabel antrian */}
      <AntrianPesananSection />
    </>
  );
}
