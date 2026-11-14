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
}

const dummyRiwayat: RiwayatItem[] = [
  {
    kode: "LDY-20261015-009",
    tanggal: "15 Okt 2026",
    layanan: "Cuci Linen",
    jumlah: "2 pcs",
    total: 40000,
    status: "Lunas",
    invoiceNo: "INV-20261015-009",
    statusPesanan: "Selesai · diantar 18 Okt",
    dibayar: "16 Okt 2026 · QRIS",
    rincianLayanan: 40000,
    ongkir: 0,
  },
  {
    kode: "LDY-20261002-021",
    tanggal: "2 Okt 2026",
    layanan: "Cuci Satuan",
    jumlah: "3 pcs",
    total: 36000,
    status: "Lunas",
    invoiceNo: "INV-20261002-021",
    statusPesanan: "Selesai · diambil 5 Okt",
    dibayar: "3 Okt 2026 · QRIS",
    rincianLayanan: 36000,
    ongkir: 0,
  },
  {
    kode: "LDY-20260920-003",
    tanggal: "20 Sep 2026",
    layanan: "Cuci Kiloan",
    jumlah: "4 kg",
    total: 24000,
    status: "Lunas",
    invoiceNo: "INV-20260920-003",
    statusPesanan: "Selesai · diantar 23 Sep",
    dibayar: "21 Sep 2026 · QRIS",
    rincianLayanan: 24000,
    ongkir: 0,
  },
  {
    kode: "LDY-20260908-011",
    tanggal: "8 Sep 2026",
    layanan: "Cuci Kiloan",
    jumlah: "5 kg",
    total: 30000,
    status: "Lunas",
    invoiceNo: "INV-20260908-011",
    statusPesanan: "Selesai · diantar 11 Sep",
    dibayar: "9 Sep 2026 · QRIS",
    rincianLayanan: 30000,
    ongkir: 0,
  },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function RiwayatPesananClient() {
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
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
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
              {dummyRiwayat.map((item) => (
                <tr key={item.kode}>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                    {item.kode}
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                    {item.tanggal}
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                    {item.layanan}
                  </td>
                  <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                    {formatRupiah(item.total)}
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
                        background: "#12805C",
                        color: "#fff",
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

        <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, margin: "16px 0 0", color: "#4A5A80" }}>
          Klik Lihat detail untuk melihat rincian tagihan & bukti pembayaran resmi.
        </p>
      </section>

      {/* Popup Invoice Riwayat */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(51,71,126,0.85)" }}
          onClick={(e) => e.target === e.currentTarget && setSelectedInvoice(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 28,
              boxSizing: "border-box",
              color: "#0B2A6B",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            }}
          >
            {/* Header Popup */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6", margin: 0 }}>
                Invoice pesanan
              </h2>
              <button
                onClick={() => setSelectedInvoice(null)}
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
              <span style={{ display: "inline-block", border: "2px solid #0B2A6B", borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 700, background: "#12805C", color: "#fff" }}>
                Lunas
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
              <div>📍 <b>Alamat:</b> Jl. Mawar No. 12, Sukolilo, Surabaya</div>
              <div>👤 <b>Petugas:</b> Gilang Pratama (Staff Operasional)</div>
            </div>

            {/* List Detail */}
            <div>
              {[
                { label: "Layanan", val: selectedInvoice.layanan },
                { label: "Jumlah", val: selectedInvoice.jumlah },
                { label: "Status pesanan", val: selectedInvoice.statusPesanan },
                { label: "Dibayar", val: selectedInvoice.dibayar },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                  <span style={{ color: "#4A5A80" }}>{r.label}</span>
                  <b style={{ textAlign: "right" }}>{r.val}</b>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 16, margin: "20px 0 0", color: "#1457D6" }}>
              Rincian tagihan
            </h3>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>{selectedInvoice.layanan} · {selectedInvoice.jumlah}</span>
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
                  const content = `====================================\nINVOICE RESMI - LAUNDYKU\n====================================\nInvoice     : ${selectedInvoice.invoiceNo}\nPesanan     : ${selectedInvoice.kode}\nTanggal     : ${selectedInvoice.tanggal}\nAlamat      : Jl. Mawar No. 12, Sukolilo, Surabaya\nPetugas     : Gilang Pratama (Staff Operasional)\nLayanan     : ${selectedInvoice.layanan} (${selectedInvoice.jumlah})\nStatus      : ${selectedInvoice.statusPesanan}\nDibayar     : ${selectedInvoice.dibayar}\n------------------------------------\nRincian Layanan: ${formatRupiah(selectedInvoice.rincianLayanan)}\nAntar Jemput: ${formatRupiah(selectedInvoice.ongkir)}\nTOTAL: ${formatRupiah(selectedInvoice.total)}\n====================================\nStatus: LUNAS\nTerima kasih telah menggunakan Laundyku!`;
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
