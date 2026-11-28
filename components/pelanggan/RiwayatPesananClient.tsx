"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface RiwayatItem {
  kode: string;
  tanggal: string;
  layanan: string;
  jumlah: string;
  total: number;
  status: string;
  invoiceNo: string;
  statusPesanan: string;
  dibayar: string;
  rincianLayanan: number;
  ongkir: number;
  alamat?: string;
  petugas?: string;
}

const FONT = "var(--font-poppins), 'Poppins', Arial, sans-serif";
const CELL = {
  padding: "12px 10px",
  borderBottom: "2px dashed #C9B98F",
  fontFamily: FONT,
  fontSize: 13,
} as const;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function RiwayatPesananClient({ data }: { data: RiwayatItem[] }) {
  const riwayatList = data;
  const [selectedInvoice, setSelectedInvoice] = useState<RiwayatItem | null>(null);

  return (
    <>
      {/* Tombol Kembali */}
      <div style={{ marginBottom: 4 }}>
        <Link
          href="/pelanggan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            color: "#0B2A6B",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke dashboard pelanggan
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
            fontSize: 40,
            color: "#1457D6",
          }}
        >
          Riwayat pesanan
        </h1>
      </div>

      <section
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
            fontSize: 24,
            color: "#1457D6",
            marginBottom: 20,
          }}
        >
          Riwayat pesanan
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
            <thead>
              <tr>
                {["Kode", "Tanggal", "Layanan", "Total", "Status", "Aksi"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 10px",
                      borderBottom: "2px dashed #C9B98F",
                      textAlign: "left",
                      fontFamily: FONT,
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
              {riwayatList.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "20px 10px", fontFamily: FONT, fontSize: 13 }}>
                    Belum ada riwayat pesanan.
                  </td>
                </tr>
              )}
              {riwayatList.map((item) => (
                <tr key={item.kode}>
                  <td style={CELL}>{item.kode}</td>
                  <td style={CELL}>{item.tanggal}</td>
                  <td style={CELL}>{item.layanan}</td>
                  <td style={CELL}>{formatRupiah(item.total)}</td>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F" }}>
                    <span
                      style={{
                        display: "inline-block",
                        border: "2px solid #0B2A6B",
                        borderRadius: 999,
                        padding: "3px 12px",
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 700,
                        background: item.status === "Lunas" ? "#12805C" : "#FFD21F",
                        color: item.status === "Lunas" ? "#fff" : "#0B2A6B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F" }}>
                    <Button variant="yellow" size="sm" onClick={() => setSelectedInvoice(item)}>
                      Lihat detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: FONT, fontSize: 12, margin: "16px 0 0", color: "#4A5A80" }}>
          Klik Lihat detail untuk melihat rincian tagihan & bukti pembayaran resmi.
        </p>
      </section>

      {/* Popup Invoice Riwayat */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{
            background: "rgba(51,71,126,0.85)",
            padding: "40px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            WebkitOverflowScrolling: "touch",
            zIndex: 9999,
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedInvoice(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 28,
              boxSizing: "border-box",
              color: "#0B2A6B",
              fontFamily: FONT,
              margin: "auto 0",
            }}
          >
            {/* Header Popup */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6", margin: 0 }}>
                Invoice pesanan
              </h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                aria-label="Tutup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFD21F",
                  color: "#0B2A6B",
                  border: "none",
                  borderRadius: 999,
                  minHeight: 40,
                  width: 44,
                  cursor: "pointer",
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 13,
                  boxShadow: "inset 0 0 0 2px #0B2A6B",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 15 }}>
                {selectedInvoice.kode}
              </span>
              <span
                style={{
                  display: "inline-block",
                  border: "2px solid #0B2A6B",
                  borderRadius: 999,
                  padding: "3px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  background: selectedInvoice.status === "Lunas" ? "#12805C" : "#FFD21F",
                  color: selectedInvoice.status === "Lunas" ? "#fff" : "#0B2A6B",
                }}
              >
                {selectedInvoice.status}
              </span>
            </div>
            <div style={{ margin: "6px 0 12px", fontSize: 12 }}>
              {selectedInvoice.invoiceNo} · {selectedInvoice.tanggal}
            </div>

            {/* Info Alamat & Petugas */}
            <div
              style={{
                background: "#F4F7FC",
                border: "1.5px solid #C5D4F5",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                fontSize: 12,
                color: "#0B2A6B",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div>
                <b>Alamat:</b> {selectedInvoice.alamat || "-"}
              </div>
              <div>
                <b>Petugas:</b> {selectedInvoice.petugas || "-"}
              </div>
            </div>

            {/* List Detail */}
            <div>
              {[
                { label: "Layanan", val: selectedInvoice.layanan },
                { label: "Jumlah", val: selectedInvoice.jumlah },
                { label: "Status pesanan", val: selectedInvoice.statusPesanan },
                { label: "Dibayar", val: selectedInvoice.dibayar },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "2px dashed #C9B98F",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#4A5A80" }}>{r.label}</span>
                  <b style={{ textAlign: "right" }}>{r.val}</b>
                </div>
              ))}
            </div>

            <h3
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 16,
                margin: "20px 0 0",
                color: "#1457D6",
              }}
            >
              Rincian tagihan
            </h3>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>
                  {selectedInvoice.layanan} · {selectedInvoice.jumlah}
                </span>
                <b>{formatRupiah(selectedInvoice.rincianLayanan)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Antar jemput</span>
                <b>{formatRupiah(selectedInvoice.ongkir)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13, fontWeight: 700 }}>
                <span>Total dibayar</span>
                <b>{formatRupiah(selectedInvoice.total)}</b>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <Button variant="yellow" size="sm" onClick={() => setSelectedInvoice(null)}>
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const alamat = selectedInvoice.alamat || "-";
                  const petugas = selectedInvoice.petugas || "-";
                  const content = [
                    "====================================",
                    "INVOICE RESMI - LAUNDYKU",
                    "====================================",
                    `Invoice     : ${selectedInvoice.invoiceNo}`,
                    `Pesanan     : ${selectedInvoice.kode}`,
                    `Tanggal     : ${selectedInvoice.tanggal}`,
                    `Alamat      : ${alamat}`,
                    `Petugas     : ${petugas}`,
                    `Layanan     : ${selectedInvoice.layanan} (${selectedInvoice.jumlah})`,
                    `Status      : ${selectedInvoice.statusPesanan}`,
                    `Dibayar     : ${selectedInvoice.dibayar}`,
                    "------------------------------------",
                    `Rincian Layanan: ${formatRupiah(selectedInvoice.rincianLayanan)}`,
                    `Antar Jemput   : ${formatRupiah(selectedInvoice.ongkir)}`,
                    `TOTAL          : ${formatRupiah(selectedInvoice.total)}`,
                    "====================================",
                    `Status: ${selectedInvoice.status.toUpperCase()}`,
                    "Terima kasih telah menggunakan Laundyku!",
                  ].join("\n");
                  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Invoice-${selectedInvoice.kode}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Unduh invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}