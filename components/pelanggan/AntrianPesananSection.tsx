"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface AntrianItem {
  kode: string;
  layanan: string;
  jadwalJemput: string;
}

const initialAntrian: AntrianItem[] = [
  {
    kode: "LDY-20261030-016",
    layanan: "Cuci Kiloan",
    jadwalJemput: "31 Okt 2026, 09.00",
  },
  {
    kode: "LDY-20261030-017",
    layanan: "Cuci Satuan",
    jadwalJemput: "31 Okt 2026, 13.00",
  },
];

export default function AntrianPesananSection() {
  const [antrian, setAntrian] = useState<AntrianItem[]>(initialAntrian);
  const [batalTarget, setBatalTarget] = useState<AntrianItem | null>(null);

  function handleBatal() {
    if (!batalTarget) return;
    setAntrian((prev) => prev.filter((item) => item.kode !== batalTarget.kode));
    setBatalTarget(null);
  }

  return (
    <>
      <section
        id="antrian"
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 18,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 28,
          color: "#0B2A6B",
        }}
      >
        <h2
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            fontSize: 24,
            color: "#1457D6",
            marginBottom: 16,
          }}
        >
          Antrian pesanan
        </h2>
        <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, margin: "0 0 16px" }}>
          Pesanan yang sudah kamu kirim dan belum diterima petugas.
        </p>

        {antrian.length === 0 ? (
          <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, color: "#4A5A80", padding: "12px 0" }}>
            Tidak ada pesanan dalam antrian.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
              <thead>
                <tr>
                  {["Kode", "Layanan", "Jadwal jemput", "Status", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 10px",
                        borderBottom: "2px dashed #C9B98F",
                        textAlign: "left",
                        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                        fontSize: 11,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {antrian.map((p) => (
                  <tr key={p.kode}>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      {p.kode}
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      {p.layanan}
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      {p.jadwalJemput}
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F" }}>
                      <span
                        style={{
                          display: "inline-block",
                          border: "2px solid #0B2A6B",
                          borderRadius: 999,
                          padding: "3px 12px",
                          fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          background: "#FFD21F",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Menunggu jemput
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F" }}>
                      <button
                        onClick={() => setBatalTarget(p)}
                        title="Batalkan pesanan"
                        aria-label="Batalkan pesanan"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#D42A25",
                          color: "#fff",
                          border: "none",
                          borderRadius: 999,
                          width: 40,
                          minHeight: 40,
                          cursor: "pointer",
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /><path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pop up Konfirmasi Batal Pesanan */}
      {batalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(51,71,126,0.85)" }}
          onClick={(e) => e.target === e.currentTarget && setBatalTarget(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 24,
              boxShadow: "6px 6px 0 #0B2A6B",
              padding: 26,
              boxSizing: "border-box",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              color: "#0B2A6B",
            }}
          >
            <h2
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 22,
                color: "#D42A25",
                margin: 0,
              }}
            >
              Batalkan pesanan?
            </h2>
            <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.5 }}>
              Pesanan {batalTarget.kode} akan dibatalkan. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span style={{ color: "#4A5A80" }}>Kode</span>
                <b style={{ textAlign: "right" }}>{batalTarget.kode}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span style={{ color: "#4A5A80" }}>Layanan</span>
                <b style={{ textAlign: "right" }}>{batalTarget.layanan}</b>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
              <Button variant="danger" fullWidth onClick={handleBatal}>
                Ya, batalkan
              </Button>
              <Button variant="yellow" fullWidth onClick={() => setBatalTarget(null)}>
                Tidak
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
