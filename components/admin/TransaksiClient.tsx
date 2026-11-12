"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Modal, { Konfirmasi } from "./Modal";
import { TrashIcon, EyeIcon, EditIcon } from "./Icons";
import { formatRupiah, formatTanggalPendek, formatTanggalLengkap, urutkan } from "@/lib/admin/rekap";
import type { Transaksi } from "@/lib/admin/types";

export default function TransaksiClient({ transaksiAwal }: { transaksiAwal: Transaksi[] }) {
  const [daftar, setDaftar] = useState(transaksiAwal);
  const [hapus, setHapus] = useState<Transaksi | null>(null);
  const [lihat, setLihat] = useState<Transaksi | null>(null);
  const [edit, setEdit] = useState<Transaksi | null>(null);
  const [editPembayaran, setEditPembayaran] = useState("");

  // State Filter Pencarian
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  // Kategori unik dari data
  const daftarKategori = useMemo(() => {
    return Array.from(new Set(daftar.map((t) => t.kategori)));
  }, [daftar]);

  // Data terfilter
  const hasilFilter = useMemo(() => {
    return daftar.filter((t) => {
      const matchNama = filterNama === "" || t.pelanggan.toLowerCase().includes(filterNama.toLowerCase()) || t.kode.toLowerCase().includes(filterNama.toLowerCase());
      const matchTanggal = filterTanggal === "" || t.selesai.startsWith(filterTanggal);
      const matchKategori = filterKategori === "" || t.kategori.toLowerCase() === filterKategori.toLowerCase();
      return matchNama && matchTanggal && matchKategori;
    });
  }, [daftar, filterNama, filterTanggal, filterKategori]);

  const tampil = urutkan(hasilFilter, "terbaru");

  // Fungsi Export ke Excel (.csv)
  function handleExportExcel() {
    const header = ["Kode Transaksi", "Tanggal Selesai", "Nama Pelanggan", "Kategori Layanan", "Total Biaya (Rp)", "Metode Pembayaran"];
    const rows = tampil.map((t) => [
      t.kode,
      t.selesai,
      `"${t.pelanggan}"`,
      `"${t.kategori}"`,
      t.total,
      `"${t.pembayaran}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Transaksi_Laundyku_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function simpanEdit() {
    if (!edit) return;
    setDaftar((prev) =>
      prev.map((t) => (t.kode === edit.kode ? { ...t, pembayaran: editPembayaran as any } : t))
    );
    setEdit(null);
  }

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 700,
            fontSize: 13,
            color: "#1457D6",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke Dashboard Admin
        </Link>
      </div>

      <div className="ad-kepala" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="ad-d" style={{ fontSize: 40, color: "var(--b)", margin: 0 }}>
            Transaksi & Report
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#4A5A80" }}>
            Laporan lengkap transaksi masuk dan riwayat pembayaran pelanggan.
          </p>
        </div>

        <button
          type="button"
          className="ad-btn"
          style={{ background: "#12805C", color: "#fff", display: "inline-flex", gap: 8, alignItems: "center" }}
          onClick={handleExportExcel}
        >
          📥 Export ke Excel (.CSV)
        </button>
      </div>

      {/* Filter Pencarian (Nama, Tanggal, Kategori) */}
      <section className="ad-kartu" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="ad-d" style={{ fontSize: 16, color: "#1457D6", margin: 0 }}>
            Filter Pencarian
          </h3>
          {(filterNama || filterTanggal || filterKategori) && (
            <button
              type="button"
              className="ad-btn y s"
              style={{ fontSize: 11, padding: "4px 10px" }}
              onClick={() => {
                setFilterNama("");
                setFilterTanggal("");
                setFilterKategori("");
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Nama Pelanggan / Kode
            </label>
            <input
              type="text"
              placeholder="Cth: Asahi atau LDY..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #0B2A6B", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #0B2A6B", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Kategori Layanan
            </label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #0B2A6B", fontSize: 13 }}
            >
              <option value="">Semua Kategori</option>
              {daftarKategori.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Tabel Transaksi */}
      <section className="ad-kartu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 className="ad-d" style={{ margin: 0 }}>
            Daftar Transaksi ({tampil.length})
          </h2>
        </div>

        <div className="ad-scroll">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th style={{ textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((t) => (
                <tr key={t.kode}>
                  <td style={{ fontWeight: 700 }}>{t.kode}</td>
                  <td>{formatTanggalPendek(t.selesai.slice(0, 10))}</td>
                  <td>{t.pelanggan}</td>
                  <td>{t.kategori}</td>
                  <td style={{ fontWeight: 700, color: "#1457D6" }}>{formatRupiah(t.total)}</td>
                  <td>
                    <span className="ad-chip">{t.pembayaran}</span>
                  </td>
                  <td>
                    {/* Tiga tombol aksi langsung: Baca, Edit, Hapus */}
                    <div className="ad-baris-aksi" style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button
                        type="button"
                        className="ad-btn s"
                        style={{ padding: "6px 10px", fontSize: 11, background: "#1457D6", color: "#fff", display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => setLihat(t)}
                        title="Baca / Lihat Detail Transaksi"
                      >
                        <EyeIcon size={14} /> Baca
                      </button>
                      <button
                        type="button"
                        className="ad-btn y s"
                        style={{ padding: "6px 10px", fontSize: 11, display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => {
                          setEdit(t);
                          setEditPembayaran(t.pembayaran);
                        }}
                        title="Edit Data Transaksi"
                      >
                        <EditIcon size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="ad-btn r icon"
                        style={{ width: 32, height: 32, padding: 0 }}
                        onClick={() => setHapus(t)}
                        title="Hapus transaksi"
                        aria-label="Hapus transaksi"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tampil.length === 0 && <p className="ad-kosong">Tidak ada transaksi yang cocok dengan filter.</p>}
      </section>

      {/* Modal Baca / Lihat Detail */}
      {lihat && (
        <Modal judul={`Detail Transaksi ${lihat.kode}`} onTutup={() => setLihat(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#EEF2F7", padding: "14px 18px", borderRadius: 12, border: "2px solid #0B2A6B" }}>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>KODE TRANSAKSI</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1457D6" }}>{lihat.kode}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Selesai: {formatTanggalLengkap(lihat.selesai)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A5A80" }}>PELANGGAN</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{lihat.pelanggan}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A5A80" }}>LAYANAN</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{lihat.kategori}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A5A80" }}>METODE BAYAR</div>
                <span className="ad-chip" style={{ marginTop: 4 }}>{lihat.pembayaran}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A5A80" }}>TOTAL BIAYA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1457D6" }}>{formatRupiah(lihat.total)}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button className="ad-btn y s" onClick={() => setLihat(null)}>
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Edit Transaksi */}
      {edit && (
        <Modal judul={`Edit Transaksi ${edit.kode}`} onTutup={() => setEdit(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Pelanggan
              </label>
              <input type="text" value={edit.pelanggan} readOnly style={{ width: "100%", padding: 10, borderRadius: 8, background: "#EEF2F7" }} />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Metode Pembayaran
              </label>
              <select
                value={editPembayaran}
                onChange={(e) => setEditPembayaran(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "2px solid #0B2A6B" }}
              >
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer Bank">Transfer Bank</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="ad-btn y s" onClick={() => setEdit(null)}>
                Batal
              </button>
              <button className="ad-btn s" onClick={simpanEdit}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Hapus */}
      {hapus && (
        <Konfirmasi
          judul="Hapus transaksi?"
          pesan={`Transaksi ${hapus.kode} milik ${hapus.pelanggan} akan dihapus dari daftar.`}
          label="Hapus"
          onYa={() => {
            setDaftar((d) => d.filter((t) => t.kode !== hapus.kode));
            setHapus(null);
          }}
          onBatal={() => setHapus(null)}
        />
      )}
    </>
  );
}
