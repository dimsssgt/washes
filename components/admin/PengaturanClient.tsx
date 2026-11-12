"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Tipe ─────────────────────────────────────────────── */
interface DataStruk {
  namaToko: string;
  alamat: string;
  noWhatsapp: string;
  footerUcapan: string;
}

interface Promo {
  id: number;
  namaDiskon: string;
  persentase: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  aktif: boolean;
}

/* ─── Dummy data awal ───────────────────────────────────── */
const dataStrukAwal: DataStruk = {
  namaToko: "Laundyku",
  alamat: "Jl. Contoh No. 1, Kota, Provinsi",
  noWhatsapp: "08123456789",
  footerUcapan: "Terima kasih telah menggunakan layanan kami!",
};

const promoAwal: Promo[] = [
  {
    id: 1,
    namaDiskon: "Diskon Lebaran",
    persentase: 20,
    tanggalMulai: "2026-03-28",
    tanggalSelesai: "2026-04-05",
    aktif: false,
  },
  {
    id: 2,
    namaDiskon: "Promo Akhir Tahun",
    persentase: 15,
    tanggalMulai: "2026-12-20",
    tanggalSelesai: "2026-12-31",
    aktif: true,
  },
];

/* ─── Komponen utama ────────────────────────────────────── */
export default function PengaturanClient() {
  /* -- State Struk -- */
  const [struk, setStruk] = useState<DataStruk>(dataStrukAwal);
  const [strukTersimpan, setStrukTersimpan] = useState(false);

  /* -- State Promo -- */
  const [daftarPromo, setDaftarPromo] = useState<Promo[]>(promoAwal);
  const [showFormPromo, setShowFormPromo] = useState(false);
  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [formPromo, setFormPromo] = useState<Omit<Promo, "id" | "aktif">>({
    namaDiskon: "",
    persentase: 0,
    tanggalMulai: "",
    tanggalSelesai: "",
  });
  const [hapusPromo, setHapusPromo] = useState<Promo | null>(null);

  /* ── Handler Struk ── */
  function simpanStruk(e: React.FormEvent) {
    e.preventDefault();
    // TODO: simpan ke Supabase
    setStrukTersimpan(true);
    setTimeout(() => setStrukTersimpan(false), 2500);
  }

  /* ── Handler Promo ── */
  function bukaFormTambah() {
    setEditPromo(null);
    setFormPromo({ namaDiskon: "", persentase: 0, tanggalMulai: "", tanggalSelesai: "" });
    setShowFormPromo(true);
  }

  function bukaFormEdit(p: Promo) {
    setEditPromo(p);
    setFormPromo({
      namaDiskon: p.namaDiskon,
      persentase: p.persentase,
      tanggalMulai: p.tanggalMulai,
      tanggalSelesai: p.tanggalSelesai,
    });
    setShowFormPromo(true);
  }

  function simpanPromo(e: React.FormEvent) {
    e.preventDefault();
    if (editPromo) {
      setDaftarPromo((prev) =>
        prev.map((p) => (p.id === editPromo.id ? { ...editPromo, ...formPromo } : p))
      );
    } else {
      const idBaru = Date.now();
      setDaftarPromo((prev) => [...prev, { id: idBaru, aktif: true, ...formPromo }]);
    }
    setShowFormPromo(false);
    setEditPromo(null);
  }

  function toggleAktif(id: number) {
    setDaftarPromo((prev) =>
      prev.map((p) => (p.id === id ? { ...p, aktif: !p.aktif } : p))
    );
  }

  function konfirmasiHapus(p: Promo) {
    setHapusPromo(p);
  }

  function hapusKonfirmasi() {
    if (!hapusPromo) return;
    setDaftarPromo((prev) => prev.filter((p) => p.id !== hapusPromo.id));
    setHapusPromo(null);
  }

  /* ── Render ── */
  return (
    <div style={{ padding: "24px 32px", fontFamily: "var(--font-mono, monospace)" }}>
      {/* Tombol kembali */}
      <Link
        href="/admin"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20,
          color: "#1a3353",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        ← Kembali ke Dashboard
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a3353", marginBottom: 32 }}>
        Pengaturan
      </h1>

      {/* ══════════════ SEKSI 1: STRUK ══════════════ */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 28,
          marginBottom: 32,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a3353", marginBottom: 20 }}>
          🧾 Pengaturan Struk
        </h2>
        <form onSubmit={simpanStruk} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={gFieldStyle}>
            <label style={gLabelStyle}>Nama Toko</label>
            <input
              style={gInputStyle}
              value={struk.namaToko}
              onChange={(e) => setStruk({ ...struk, namaToko: e.target.value })}
              required
              placeholder="Nama toko pada struk"
            />
          </div>
          <div style={gFieldStyle}>
            <label style={gLabelStyle}>Alamat Toko</label>
            <input
              style={gInputStyle}
              value={struk.alamat}
              onChange={(e) => setStruk({ ...struk, alamat: e.target.value })}
              required
              placeholder="Alamat lengkap toko"
            />
          </div>
          <div style={gFieldStyle}>
            <label style={gLabelStyle}>Nomor WhatsApp</label>
            <input
              style={gInputStyle}
              value={struk.noWhatsapp}
              onChange={(e) => setStruk({ ...struk, noWhatsapp: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div style={gFieldStyle}>
            <label style={gLabelStyle}>Ucapan Footer Struk</label>
            <textarea
              style={{ ...gInputStyle, minHeight: 80, resize: "vertical" }}
              value={struk.footerUcapan}
              onChange={(e) => setStruk({ ...struk, footerUcapan: e.target.value })}
              placeholder="Contoh: Terima kasih atas kepercayaan Anda!"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button type="submit" style={gBtnPrimaryStyle}>
              Simpan Pengaturan Struk
            </button>
            {strukTersimpan && (
              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 14 }}>
                ✓ Tersimpan!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* ══════════════ SEKSI 2: PROMO/DISKON ══════════════ */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a3353" }}>
            🏷️ CMS Promo &amp; Diskon
          </h2>
          <button onClick={bukaFormTambah} style={gBtnPrimaryStyle}>
            + Tambah Promo
          </button>
        </div>

        {/* Tabel Promo */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f0f4f8" }}>
                {["Nama Diskon", "Diskon", "Tanggal Mulai", "Tanggal Selesai", "Status", "Aksi"].map((h) => (
                  <th key={h} style={gThStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daftarPromo.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                    Belum ada promo
                  </td>
                </tr>
              ) : (
                daftarPromo.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={gTdStyle}>{p.namaDiskon}</td>
                    <td style={gTdStyle}>{p.persentase}%</td>
                    <td style={gTdStyle}>{p.tanggalMulai}</td>
                    <td style={gTdStyle}>{p.tanggalSelesai}</td>
                    <td style={gTdStyle}>
                      <button
                        onClick={() => toggleAktif(p.id)}
                        style={{
                          padding: "3px 12px",
                          borderRadius: 20,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 12,
                          background: p.aktif ? "#dcfce7" : "#fee2e2",
                          color: p.aktif ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {p.aktif ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td style={{ ...gTdStyle, display: "flex", gap: 8 }}>
                      <button onClick={() => bukaFormEdit(p)} style={gBtnEditStyle}>Edit</button>
                      <button onClick={() => konfirmasiHapus(p)} style={gBtnHapusStyle}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════ MODAL FORM PROMO ══════════════ */}
      {showFormPromo && (
        <div style={gOverlayStyle}>
          <div style={gModalStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a3353", marginBottom: 20 }}>
              {editPromo ? "Edit Promo" : "Tambah Promo Baru"}
            </h3>
            <form onSubmit={simpanPromo} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={gFieldStyle}>
                <label style={gLabelStyle}>Nama Diskon</label>
                <input
                  style={gInputStyle}
                  value={formPromo.namaDiskon}
                  onChange={(e) => setFormPromo({ ...formPromo, namaDiskon: e.target.value })}
                  required
                  placeholder="Contoh: Promo Hari Kemerdekaan"
                />
              </div>
              <div style={gFieldStyle}>
                <label style={gLabelStyle}>Persentase Diskon (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  style={gInputStyle}
                  value={formPromo.persentase}
                  onChange={(e) => setFormPromo({ ...formPromo, persentase: Number(e.target.value) })}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={gFieldStyle}>
                  <label style={gLabelStyle}>Tanggal Mulai</label>
                  <input
                    type="date"
                    style={gInputStyle}
                    value={formPromo.tanggalMulai}
                    onChange={(e) => setFormPromo({ ...formPromo, tanggalMulai: e.target.value })}
                    required
                  />
                </div>
                <div style={gFieldStyle}>
                  <label style={gLabelStyle}>Tanggal Selesai</label>
                  <input
                    type="date"
                    style={gInputStyle}
                    value={formPromo.tanggalSelesai}
                    onChange={(e) => setFormPromo({ ...formPromo, tanggalSelesai: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="submit" style={gBtnPrimaryStyle}>
                  {editPromo ? "Simpan Perubahan" : "Tambah Promo"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowFormPromo(false); setEditPromo(null); }}
                  style={gBtnCancelStyle}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL KONFIRMASI HAPUS ══════════════ */}
      {hapusPromo && (
        <div style={gOverlayStyle}>
          <div style={{ ...gModalStyle, maxWidth: 400 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a3353", marginBottom: 12 }}>
              Hapus Promo?
            </h3>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
              Promo <strong>{hapusPromo.namaDiskon}</strong> akan dihapus secara permanen.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={hapusKonfirmasi} style={gBtnHapusStyle}>Ya, Hapus</button>
              <button onClick={() => setHapusPromo(null)} style={gBtnCancelStyle}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Style helpers ─────────────────────────────────────── */
const gFieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const gLabelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151" };
const gInputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1.5px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};
const gBtnPrimaryStyle: React.CSSProperties = {
  padding: "8px 20px",
  borderRadius: 8,
  border: "none",
  background: "#1a3353",
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
const gBtnEditStyle: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "1.5px solid #1a3353",
  background: "#fff",
  color: "#1a3353",
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
};
const gBtnHapusStyle: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 6,
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
};
const gBtnCancelStyle: React.CSSProperties = {
  padding: "8px 20px",
  borderRadius: 8,
  border: "1.5px solid #d1d5db",
  background: "#fff",
  color: "#555",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
const gThStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontWeight: 700,
  color: "#374151",
  fontSize: 13,
};
const gTdStyle: React.CSSProperties = {
  padding: "12px 14px",
  color: "#374151",
  fontSize: 14,
  verticalAlign: "middle",
};
const gOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};
const gModalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: 28,
  width: "100%",
  maxWidth: 520,
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
};
