"use client";

import { use, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  dummyPesanan,
  StatusChip,
  BayarChip,
  formatRupiah,
  ModalQRIS,
  PesananAktif,
} from "@/components/pelanggan/PesananAktifClient";

export default function DetailPesananPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const resolvedParams = use(params);
  const kode = decodeURIComponent(resolvedParams.kode);

  const [showQRIS, setShowQRIS] = useState(false);

  // Ambil data pesanan sesuai kode di URL, atau fallback ke data pertama
  const pesanan: PesananAktif =
    dummyPesanan.find((p) => p.kode.toLowerCase() === kode.toLowerCase()) ||
    dummyPesanan[0];

  return (
    <>
      {/* Tombol kembali & judul */}
      <div>
        <Link
          href="/pelanggan/aktif"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: "#1457D6",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          ← Kembali ke daftar pesanan aktif
        </Link>
        <h1
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
            fontSize: 36,
            color: "#1457D6",
          }}
        >
          Detail pesanan
        </h1>
      </div>

      {/* Kontainer utama Detail Pesanan */}
      <div
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 18,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 32,
          color: "#0B2A6B",
          maxWidth: 720,
        }}
      >
        {/* Header pesanan */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            borderBottom: "2px solid #0B2A6B",
            paddingBottom: 16,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 22,
                color: "#0B2A6B",
              }}
            >
              {pesanan.kode}
            </span>
            <div style={{ fontSize: 13, color: "#4A5A80", marginTop: 4 }}>
              {pesanan.layanan} · {pesanan.kecepatan} · {pesanan.estimasi}
            </div>
          </div>
          <StatusChip status={pesanan.status} />
        </div>

        {/* Section: Status Pengerjaan (Timeline 7 Tahap) */}
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              textTransform: "uppercase",
              fontSize: 18,
              color: "#1457D6",
              margin: "0 0 16px",
            }}
          >
            Status pengerjaan
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pesanan.riwayatStatus.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  background: item.aktif ? "#FFF4DE" : "transparent",
                  padding: item.aktif ? "8px 12px" : "4px 0",
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    border: "2px solid #0B2A6B",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                    background: item.selesai ? "#12805C" : item.aktif ? "#1457D6" : "#fff",
                    color: item.selesai || item.aktif ? "#fff" : "#0B2A6B",
                  }}
                >
                  {item.selesai ? "✔" : item.aktif ? "●" : "○"}
                </span>
                <div>
                  <b style={{ fontSize: 14 }}>{item.label}</b>
                  <div style={{ fontSize: 12, color: "#4A5A80" }}>{item.waktu ?? "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Tagihan / Invoice */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "2px dashed #C9B98F",
          }}
        >
          <h2
            style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              textTransform: "uppercase",
              fontSize: 18,
              color: "#1457D6",
              margin: "0 0 12px",
            }}
          >
            Tagihan / Invoice
          </h2>

          {pesanan.total !== null && pesanan.invoiceNo ? (
            <>
              <div style={{ fontSize: 13, marginBottom: 14, color: "#4A5A80" }}>
                {pesanan.invoiceNo} · {pesanan.estimasi}
              </div>

              <div
                style={{
                  background: "#EEF2F7",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                    borderBottom: "2px dashed #C9B98F",
                    fontSize: 13,
                  }}
                >
                  <span>{pesanan.layanan} ({pesanan.detail})</span>
                  <b>{formatRupiah(pesanan.total)}</b>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  <span>Total Tagihan</span>
                  <b style={{ color: "#1457D6", fontSize: 16 }}>{formatRupiah(pesanan.total)}</b>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <BayarChip status={pesanan.statusBayar} />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <Button
                  variant="yellow"
                  size="sm"
                  onClick={() => {
                    const content = `====================================\nINVOICE RESMI - LAUNDYKU\n====================================\nInvoice: ${pesanan.invoiceNo ?? "-"}\nPesanan: ${pesanan.kode}\nLayanan: ${pesanan.layanan} (${pesanan.detail})\nEstimasi: ${pesanan.estimasi}\nStatus Bayar: ${pesanan.statusBayar === "lunas" ? "LUNAS" : "BELUM DIBAYAR"}\nTotal: ${pesanan.total ? formatRupiah(pesanan.total) : "-"}\n====================================\nTerima kasih telah mempercayakan cucianmu kepada Laundyku!`;
                    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Invoice-${pesanan.kode}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Unduh invoice
                </Button>

                {pesanan.statusBayar === "belum_bayar" && (
                  <Button size="sm" onClick={() => setShowQRIS(true)}>
                    Bayar via QRIS
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#4A5A80", margin: "12px 0 0" }}>
              Detail rincian dan tagihan pembayaran baru tersedia setelah cucian selesai ditimbang oleh petugas.
            </p>
          )}
        </div>
      </div>

      {/* Modal QRIS (Hanya ada tombol Unduh QRIS dan Tutup, tombol Sudah Bayar dihapus) */}
      {showQRIS && (
        <ModalQRIS
          pesanan={pesanan}
          onClose={() => setShowQRIS(false)}
          onKonfirmasi={() => setShowQRIS(false)}
        />
      )}
    </>
  );
}
