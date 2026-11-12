"use client";

import { use, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  dummyPesanan,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Link Kembali */}
      <div>
        <Link
          href="/pelanggan/aktif"
          style={{
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: "#0B2A6B",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke pesanan aktif
        </Link>
      </div>

      {/* Header Judul */}
      <div>
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
          Pesanan {pesanan.kode}
        </h1>
      </div>

      {/* Grid 2 Kolom: Status Pengerjaan & Tagihan/Invoice */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 28,
        }}
      >
        {/* Card 1: Status pengerjaan */}
        <section
          id="status"
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
              marginBottom: 16,
            }}
          >
            Status pengerjaan
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {pesanan.riwayatStatus.map((item) => {
              const bg = item.selesai ? "#12805C" : item.aktif ? "#1457D6" : "#FFF4DE";
              const color = item.selesai || item.aktif ? "#fff" : "#0B2A6B";
              const icon = item.selesai ? "✔" : item.aktif ? "●" : "○";

              return (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #0B2A6B",
                      borderRadius: 999,
                      fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      background: bg,
                      color: color,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <b style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, color: "#0B2A6B" }}>
                      {item.label}
                    </b>
                    <div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, color: "#4A5A80" }}>
                      {item.waktu ?? "-"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, margin: "20px 0 0", color: "#0B2A6B" }}>
            Estimasi selesai: 30 Okt 2026
          </p>
        </section>

        {/* Card 2: Tagihan / Invoice */}
        <section
          id="invoice"
          style={{
            background: "#fff",
            border: "2px solid #0B2A6B",
            borderRadius: 18,
            boxShadow: "5px 5px 0 #0B2A6B",
            padding: 28,
            color: "#0B2A6B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 24,
                color: "#1457D6",
                marginBottom: 16,
              }}
            >
              Tagihan / Invoice
            </h2>

            <div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, marginBottom: 12, color: "#0B2A6B" }}>
              No. {pesanan.invoiceNo ?? "INV-20261028-014"} · 28 Okt 2026
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "100%" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "12px 10px",
                        borderBottom: "2px dashed #C9B98F",
                        textAlign: "left",
                        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                        fontSize: 11,
                        textTransform: "uppercase",
                        color: "#0B2A6B",
                      }}
                    >
                      Rincian
                    </th>
                    <th
                      style={{
                        padding: "12px 10px",
                        borderBottom: "2px dashed #C9B98F",
                        textAlign: "left",
                        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                        fontSize: 11,
                        textTransform: "uppercase",
                        color: "#0B2A6B",
                      }}
                    >
                      Jumlah
                    </th>
                    <th
                      style={{
                        padding: "12px 10px",
                        borderBottom: "2px dashed #C9B98F",
                        textAlign: "left",
                        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                        fontSize: 11,
                        textTransform: "uppercase",
                        color: "#0B2A6B",
                      }}
                    >
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      Cuci Kiloan Reguler
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      4 kg
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      Rp 24.000
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      Antar jemput
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      1 trip
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>
                      Rp 5.000
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, fontWeight: 700 }}>
                      Total
                    </td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}></td>
                    <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13, fontWeight: 700, color: "#1457D6" }}>
                      Rp 29.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                display: "inline-block",
                border: "2px solid #0B2A6B",
                borderRadius: 999,
                padding: "3px 12px",
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                background: "#D42A25",
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Belum dibayar
            </span>
            <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => {
                  const content = `====================================\nINVOICE RESMI - LAUNDYKU\n====================================\nNo. Invoice: ${pesanan.invoiceNo ?? "INV-20261028-014"}\nTanggal: 28 Okt 2026\nPesanan: ${pesanan.kode}\n\nRINCIAN BIAYA:\n1. Cuci Kiloan Reguler (4 kg) : Rp 24.000\n2. Antar jemput (1 trip)       : Rp 5.000\n------------------------------------\nTOTAL: Rp 29.000\nSTATUS: BELUM DIBAYAR\n====================================\nTerima kasih telah mempercayakan cucianmu kepada Laundyku!`;
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
              <Button size="sm" onClick={() => setShowQRIS(true)}>
                Bayar via QRIS
              </Button>
            </span>
          </div>
        </section>
      </div>

      {/* Card 3: Informasi pesanan */}
      <section
        id="info"
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
            marginBottom: 16,
          }}
        >
          Informasi pesanan
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                margin: "14px 0 6px",
                textTransform: "uppercase",
                color: "#0B2A6B",
              }}
            >
              Layanan
            </label>
            <input
              type="text"
              readOnly
              value="Cuci Kiloan · Reguler 3 hari"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #0B2A6B",
                borderRadius: 12,
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 13,
                background: "#fff",
                boxSizing: "border-box",
                minHeight: 44,
                color: "#0B2A6B",
              }}
            />

            <label
              style={{
                display: "block",
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                margin: "14px 0 6px",
                textTransform: "uppercase",
                color: "#0B2A6B",
              }}
            >
              Jadwal jemput
            </label>
            <input
              type="text"
              readOnly
              value="28 Okt 2026, 09.00"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #0B2A6B",
                borderRadius: 12,
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 13,
                background: "#fff",
                boxSizing: "border-box",
                minHeight: 44,
                color: "#0B2A6B",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                margin: "14px 0 6px",
                textTransform: "uppercase",
                color: "#0B2A6B",
              }}
            >
              Alamat
            </label>
            <input
              type="text"
              readOnly
              value="[Alamat pelanggan]"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #0B2A6B",
                borderRadius: 12,
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 13,
                background: "#fff",
                boxSizing: "border-box",
                minHeight: 44,
                color: "#0B2A6B",
              }}
            />

            <label
              style={{
                display: "block",
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                margin: "14px 0 6px",
                textTransform: "uppercase",
                color: "#0B2A6B",
              }}
            >
              Catatan
            </label>
            <input
              type="text"
              readOnly
              value="Tanpa parfum"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #0B2A6B",
                borderRadius: 12,
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                fontSize: 13,
                background: "#fff",
                boxSizing: "border-box",
                minHeight: 44,
                color: "#0B2A6B",
              }}
            />
          </div>
        </div>
      </section>

      <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, margin: 0, color: "#4A5A80" }}>
        Data pada tampilan ini hanya contoh.
      </p>

      {/* Modal QRIS (Hanya ada tombol Unduh QRIS dan Tutup, tombol Sudah Bayar dihapus) */}
      {showQRIS && (
        <ModalQRIS
          pesanan={pesanan}
          onClose={() => setShowQRIS(false)}
          onKonfirmasi={() => setShowQRIS(false)}
        />
      )}
    </div>
  );
}
