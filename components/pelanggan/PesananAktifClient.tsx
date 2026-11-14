"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Tipe data pesanan aktif
export type StatusPesanan =
  | "menunggu_jemput"
  | "diterima"
  | "ditimbang"
  | "dicuci"
  | "disetrika"
  | "siap_diambil"
  | "selesai";

export type StatusBayar = "belum_bayar" | "lunas";

export interface PesananAktif {
  kode: string;
  layanan: string;
  detail: string; // cth: "4 kg" atau "2 pcs"
  kecepatan: string;
  estimasi: string;
  status: StatusPesanan;
  statusBayar: StatusBayar;
  total: number | null; // null = belum ditimbang
  invoiceNo: string | null;
  riwayatStatus: { label: string; waktu: string | null; selesai: boolean; aktif: boolean }[];
}

export const statusLabel: Record<StatusPesanan, string> = {
  menunggu_jemput: "Menunggu jemput",
  diterima: "Pesanan diterima",
  ditimbang: "Sudah ditimbang",
  dicuci: "Sedang dicuci",
  disetrika: "Sedang disetrika",
  siap_diambil: "Siap diantar/diambil",
  selesai: "Selesai",
};

export function StatusChip({ status }: { status: StatusPesanan }) {
  const styles: Record<StatusPesanan, { bg: string; color: string }> = {
    menunggu_jemput: { bg: "#FFD21F", color: "#0B2A6B" },
    diterima: { bg: "#FFD21F", color: "#0B2A6B" },
    ditimbang: { bg: "#FFD21F", color: "#0B2A6B" },
    dicuci: { bg: "#1457D6", color: "#fff" },
    disetrika: { bg: "#1457D6", color: "#fff" },
    siap_diambil: { bg: "#12805C", color: "#fff" },
    selesai: { bg: "#12805C", color: "#fff" },
  };
  const s = styles[status];
  return (
    <span
      style={{
        display: "inline-block",
        border: "2px solid #0B2A6B",
        borderRadius: 999,
        padding: "3px 12px",
        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        background: s.bg,
        color: s.color,
      }}
    >
      {statusLabel[status]}
    </span>
  );
}

export function BayarChip({ status }: { status: StatusBayar }) {
  return (
    <span
      style={{
        display: "inline-block",
        border: "2px solid #0B2A6B",
        borderRadius: 999,
        padding: "3px 12px",
        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        marginTop: 4,
        background: status === "lunas" ? "#12805C" : "#D42A25",
        color: "#fff",
      }}
    >
      {status === "lunas" ? "Lunas" : "Belum dibayar"}
    </span>
  );
}

export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Modal Detail Pesanan ──────────────────────────────────────────────────────
function ModalDetailPesanan({
  pesanan,
  onClose,
  onBayar,
}: {
  pesanan: PesananAktif;
  onClose: () => void;
  onBayar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(51,71,126,0.85)", overflowY: "auto" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
          fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          color: "#0B2A6B",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6", margin: 0 }}>
            Detail pesanan
          </h2>
          <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#FFD21F", color: "#0B2A6B", border: "none", borderRadius: 999, minHeight: 40, width: 44, cursor: "pointer", fontFamily: "'Archivo Black', sans-serif", fontSize: 13, boxShadow: "inset 0 0 0 2px #0B2A6B" }}>✕</button>
        </div>

        {/* Kode & status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 15 }}>{pesanan.kode}</span>
          <StatusChip status={pesanan.status} />
        </div>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          {pesanan.layanan} · {pesanan.kecepatan} · {pesanan.estimasi}
        </div>

        {/* Timeline status */}
        <h3 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 16, margin: "20px 0 0", color: "#1457D6" }}>
          Status pengerjaan
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "14px 0 6px" }}>
          {pesanan.riwayatStatus.map((item) => (
            <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: "2px solid #0B2A6B",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  background: item.selesai ? "#12805C" : item.aktif ? "#1457D6" : "#FFF4DE",
                  color: item.selesai || item.aktif ? "#fff" : "#0B2A6B",
                }}
              >
                {item.selesai ? "✔" : item.aktif ? "●" : "○"}
              </span>
              <div>
                <b style={{ fontSize: 13 }}>{item.label}</b>
                <div style={{ fontSize: 12, color: "#4A5A80" }}>{item.waktu ?? "—"}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice */}
        {pesanan.total !== null && pesanan.invoiceNo ? (
          <>
            <h3 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 16, margin: "20px 0 0", color: "#1457D6" }}>
              Tagihan / Invoice
            </h3>
            <div style={{ fontSize: 12, marginTop: 6 }}>{pesanan.invoiceNo} · {pesanan.estimasi}</div>
            
            {/* Info Alamat & Petugas */}
            <div
              style={{
                background: "#F4F7FC",
                border: "1.5px solid #C5D4F5",
                borderRadius: 10,
                padding: "8px 12px",
                margin: "10px 0",
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
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>{pesanan.layanan} · {pesanan.detail}</span>
                <b>{formatRupiah(pesanan.total)}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13, fontWeight: 700 }}>
                <span>Total</span>
                <b>{formatRupiah(pesanan.total)}</b>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <BayarChip status={pesanan.statusBayar} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => {
                  const content = `====================================\nINVOICE RESMI - LAUNDYKU\n====================================\nInvoice     : ${pesanan.invoiceNo ?? "-"}\nPesanan     : ${pesanan.kode}\nAlamat      : Jl. Mawar No. 12, Sukolilo, Surabaya\nPetugas     : Gilang Pratama (Staff Operasional)\nLayanan     : ${pesanan.layanan} (${pesanan.detail})\nEstimasi    : ${pesanan.estimasi}\nStatus Bayar: ${pesanan.statusBayar === "lunas" ? "LUNAS" : "BELUM DIBAYAR"}\nTotal       : ${pesanan.total ? formatRupiah(pesanan.total) : "-"}\n====================================\nTerima kasih telah menggunakan Laundyku!`;
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
                <Button size="sm" onClick={onBayar}>Bayar via QRIS</Button>
              )}
            </div>
          </>
        ) : (
          <p style={{ marginTop: 16, fontSize: 12, color: "#4A5A80" }}>
            Detail dan tagihan baru tersedia setelah cucian ditimbang petugas.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Modal QRIS ───────────────────────────────────────────────────────────────
export function ModalQRIS({
  pesanan,
  onClose,
  onKonfirmasi,
}: {
  pesanan: PesananAktif;
  onClose: () => void;
  onKonfirmasi: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(51,71,126,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
          fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          color: "#0B2A6B",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6", margin: 0 }}>Bayar via QRIS</h2>
          <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#FFD21F", color: "#0B2A6B", border: "none", borderRadius: 999, minHeight: 40, width: 44, cursor: "pointer", boxShadow: "inset 0 0 0 2px #0B2A6B" }}>✕</button>
        </div>

        {/* Placeholder QRIS */}
        <div style={{ width: 200, height: 200, margin: "16px auto", border: "2px dashed #0B2A6B", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12 }}>
          [KODE QRIS]<br />
          <span style={{ fontSize: 11, color: "#4A5A80" }}>Tersedia saat backend aktif</span>
        </div>

        <div style={{ marginTop: 12 }}>
          {[
            { label: "Invoice", value: pesanan.invoiceNo ?? "-" },
            { label: "Total bayar", value: pesanan.total ? formatRupiah(pesanan.total) : "-" },
            { label: "Batas bayar", value: "24 jam setelah tagihan diterbitkan" },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
              <span>{r.label}</span>
              <b style={{ textAlign: "right" }}>{r.value}</b>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFD21F", border: "2px solid #0B2A6B", borderRadius: 12, padding: "12px 14px", marginTop: 14, fontSize: 12 }}>
          Silakan scan kode QRIS di atas untuk melakukan pembayaran melalui aplikasi m-banking atau e-wallet pilihanmu.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Button
            variant="ghost"
            style={{ flex: 1 }}
            onClick={() => alert("Mengunduh gambar QRIS...")}
          >
            Unduh QRIS
          </Button>
          <Button
            variant="yellow"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Konfirmasi Bayar ────────────────────────────────────────────────────
function ModalKonfirmasiBayar({
  pesanan,
  onClose,
  onBerhasil,
}: {
  pesanan: PesananAktif;
  onClose: () => void;
  onBerhasil: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleKonfirmasi() {
    setLoading(true);
    // TODO: POST ke /api/pesanan/:kode/konfirmasi-bayar
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onBerhasil();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(51,71,126,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
          fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          color: "#0B2A6B",
        }}
      >
        <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6" }}>
          Konfirmasi pembayaran?
        </h2>
        <p style={{ fontSize: 14, margin: "12px 0 0", lineHeight: 1.5 }}>
          Pastikan kamu sudah membayar tagihan via QRIS. Status akan diperbarui setelah dicek.
        </p>
        <div style={{ marginTop: 14 }}>
          {[
            { label: "Invoice", value: pesanan.invoiceNo ?? "-" },
            { label: "Total", value: pesanan.total ? formatRupiah(pesanan.total) : "-" },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
              <span style={{ color: "#4A5A80" }}>{r.label}</span>
              <b style={{ textAlign: "right" }}>{r.value}</b>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
          <Button fullWidth onClick={handleKonfirmasi} loading={loading}>Ya, sudah bayar</Button>
          <Button fullWidth variant="yellow" onClick={onClose}>Belum</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Komponen utama ────────────────────────────────────────────────────────────
export const dummyPesanan: PesananAktif[] = [
  {
    kode: "LDY-20261028-014",
    layanan: "Cuci Kiloan",
    detail: "4 kg",
    kecepatan: "Reguler 3 hari",
    estimasi: "estimasi selesai 30 Okt",
    status: "dicuci",
    statusBayar: "belum_bayar",
    total: 29000,
    invoiceNo: "INV-20261028-014",
    riwayatStatus: [
      { label: "Menunggu jemput", waktu: "28 Okt, 09.00", selesai: true, aktif: false },
      { label: "Pesanan diterima", waktu: "28 Okt, 09.10", selesai: true, aktif: false },
      { label: "Cucian ditimbang · 4 kg", waktu: "28 Okt, 10.05", selesai: true, aktif: false },
      { label: "Sedang dicuci", waktu: "28 Okt, 13.30", selesai: false, aktif: true },
      { label: "Sedang disetrika", waktu: null, selesai: false, aktif: false },
      { label: "Siap diantar/diambil", waktu: null, selesai: false, aktif: false },
      { label: "Selesai", waktu: null, selesai: false, aktif: false },
    ],
  },
  {
    kode: "LDY-20261029-017",
    layanan: "Cuci Linen",
    detail: "2 pcs",
    kecepatan: "Reguler 3 hari",
    estimasi: "Jemput 30 Okt, 10.00",
    status: "menunggu_jemput",
    statusBayar: "belum_bayar",
    total: null,
    invoiceNo: null,
    riwayatStatus: [
      { label: "Menunggu jemput", waktu: "29 Okt, 14.00", selesai: false, aktif: true },
      { label: "Pesanan diterima", waktu: null, selesai: false, aktif: false },
      { label: "Cucian ditimbang", waktu: null, selesai: false, aktif: false },
      { label: "Sedang dicuci", waktu: null, selesai: false, aktif: false },
      { label: "Sedang disetrika", waktu: null, selesai: false, aktif: false },
      { label: "Siap diantar/diambil", waktu: null, selesai: false, aktif: false },
      { label: "Selesai", waktu: null, selesai: false, aktif: false },
    ],
  },
];

type ModalState =
  | { type: "none" }
  | { type: "detail"; pesanan: PesananAktif }
  | { type: "qris"; pesanan: PesananAktif }
  | { type: "konfirmasi_bayar"; pesanan: PesananAktif };

export default function PesananAktifClient() {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [pesananList] = useState(dummyPesanan);

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

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, margin: 0, fontSize: 40, color: "#1457D6" }}>
          Pesanan aktif
        </h1>
      </div>

      {/* Daftar pesanan */}
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
        <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 24, color: "#1457D6", marginBottom: 20 }}>
          Daftar pesanan aktif
        </h2>

        {pesananList.length === 0 ? (
          <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>Belum ada pesanan aktif.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {pesananList.map((p) => (
              <div
                key={p.kode}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: 16,
                  alignItems: "center",
                  background: "#fff",
                  border: "2px solid #0B2A6B",
                  borderRadius: 18,
                  boxShadow: "4px 4px 0 #0B2A6B",
                  padding: "20px 24px",
                }}
              >
                {/* Info pesanan */}
                <div>
                  <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 16 }}>{p.kode}</div>
                  <div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12 }}>{p.layanan} · {p.detail}</div>
                </div>

                {/* Status pengerjaan */}
                <div><StatusChip status={p.status} /></div>

                {/* Estimasi */}
                <div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12 }}>{p.estimasi}</div>

                {/* Tagihan */}
                <div>
                  {p.total !== null ? (
                    <>
                      <b style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>{formatRupiah(p.total)}</b>
                      <br />
                      <BayarChip status={p.statusBayar} />
                    </>
                  ) : (
                    <>
                      <b style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 13 }}>Harga belum tersedia</b>
                      <br />
                      <span style={{ display: "inline-block", border: "2px solid #0B2A6B", borderRadius: 999, padding: "3px 12px", fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, fontWeight: 700, background: "#FFF4DE", marginTop: 4 }}>Menunggu penimbangan</span>
                    </>
                  )}
                </div>

                {/* Tombol detail ke halaman tersendiri */}
                {p.total !== null ? (
                  <Link href={`/pelanggan/aktif/${p.kode}`} style={{ justifySelf: "end" }}>
                    <Button
                      variant="yellow"
                      size="sm"
                    >
                      Lihat detail →
                    </Button>
                  </Link>
                ) : (
                  <span style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, color: "#4A5A80", justifySelf: "end" }}>
                    Detail muncul setelah penimbangan
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif", fontSize: 12, margin: "16px 0 0", color: "#4A5A80" }}>
          Klik Lihat detail untuk melihat status pengerjaan dan tagihan. Detail baru tersedia setelah cucian ditimbang petugas.
        </p>
      </section>

      {/* Modals */}
      {modal.type === "detail" && (
        <ModalDetailPesanan
          pesanan={modal.pesanan}
          onClose={() => setModal({ type: "none" })}
          onBayar={() => setModal({ type: "qris", pesanan: modal.pesanan })}
        />
      )}
      {modal.type === "qris" && (
        <ModalQRIS
          pesanan={modal.pesanan}
          onClose={() => setModal({ type: "none" })}
          onKonfirmasi={() => setModal({ type: "konfirmasi_bayar", pesanan: modal.pesanan })}
        />
      )}
      {modal.type === "konfirmasi_bayar" && (
        <ModalKonfirmasiBayar
          pesanan={modal.pesanan}
          onClose={() => setModal({ type: "qris", pesanan: modal.pesanan })}
          onBerhasil={() => setModal({ type: "none" })}
        />
      )}
    </>
  );
}
