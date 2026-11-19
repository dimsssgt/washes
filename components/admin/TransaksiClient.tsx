"use client";

import { useMemo, useState } from "react";
import Modal, { Konfirmasi } from "./Modal";
import { Donut, Pill } from "./Grafik";
import MenuAksi from "./MenuAksi";
import {
  awalMinggu,
  formatRupiah,
  formatTanggalLengkap,
  formatTanggalPendek,
  geserHari,
  tanggalTerbaru,
  totalDari,
  urutkan,
} from "@/lib/admin/rekap";
import { formatRibu, ringkasLayanan, unduhCsv } from "@/lib/admin/ringkasan";
import type { Transaksi } from "@/lib/admin/types";

type Rentang = "semua" | "hari" | "minggu" | "bulan";

const RENTANG: { nilai: Rentang; label: string }[] = [
  { nilai: "semua", label: "Semua" },
  { nilai: "hari", label: "Hari ini" },
  { nilai: "minggu", label: "Minggu ini" },
  { nilai: "bulan", label: "Bulan ini" },
];

export default function TransaksiClient({ transaksiAwal }: { transaksiAwal: Transaksi[] }) {
  const [daftar, setDaftar] = useState(transaksiAwal);
  const [hapus, setHapus] = useState<Transaksi | null>(null);
  const [lihat, setLihat] = useState<Transaksi | null>(null);
  const [edit, setEdit] = useState<Transaksi | null>(null);
  const [editPembayaran, setEditPembayaran] = useState("");

  const [rentang, setRentang] = useState<Rentang>("semua");
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  // Tanggal acuan untuk "hari ini", "minggu ini", dan "bulan ini" (data tiruan).
  const acuan = tanggalTerbaru(transaksiAwal);
  const awalAcuan = awalMinggu(acuan);
  const akhirAcuan = geserHari(awalAcuan, 6);

  const daftarKategori = useMemo(() => Array.from(new Set(daftar.map((t) => t.kategori))), [daftar]);

  // Data sesuai rentang waktu (dipakai untuk KPI dan donut).
  const perRentang = useMemo(
    () =>
      daftar.filter((t) => {
        const tgl = t.selesai.slice(0, 10);
        if (rentang === "hari") return tgl === acuan;
        if (rentang === "minggu") return tgl >= awalAcuan && tgl <= akhirAcuan;
        if (rentang === "bulan") return tgl.slice(0, 7) === acuan.slice(0, 7);
        return true;
      }),
    [daftar, rentang, acuan, awalAcuan, akhirAcuan],
  );

  // Data untuk tabel, ditambah filter pencarian.
  const hasilFilter = useMemo(() => {
    const kunci = filterNama.toLowerCase();
    return perRentang.filter((t) => {
      const matchNama =
        filterNama === "" || t.pelanggan.toLowerCase().includes(kunci) || t.kode.toLowerCase().includes(kunci);
      const matchTanggal = filterTanggal === "" || t.selesai.startsWith(filterTanggal);
      const matchKategori = filterKategori === "" || t.kategori.toLowerCase() === filterKategori.toLowerCase();
      return matchNama && matchTanggal && matchKategori;
    });
  }, [perRentang, filterNama, filterTanggal, filterKategori]);

  const tampil = urutkan(hasilFilter, "terbaru");
  const adaFilter = filterNama || filterTanggal || filterKategori;

  const total = totalDari(perRentang);
  const qris = perRentang.filter((t) => t.pembayaran === "QRIS");
  const tunai = perRentang.filter((t) => t.pembayaran === "Tunai");
  const rataRata = perRentang.length ? Math.round(total / perRentang.length) : 0;
  const layanan = ringkasLayanan(perRentang);

  function simpanEdit() {
    if (!edit) return;
    setDaftar((prev) => prev.map((t) => (t.kode === edit.kode ? { ...t, pembayaran: editPembayaran as any } : t)));
    setEdit(null);
  }

  return (
    <>
      <div className="ad-kepala">
        <div>
          <p className="ad-hint ad-crumb">Laundyku · Transaksi & Report</p>
          <h1 className="ad-d">Transaksi & Report</h1>
        </div>
        <div className="ad-baris-aksi">
          <div className="ad-seg" role="group" aria-label="Rentang waktu">
            {RENTANG.map((r) => (
              <button key={r.nilai} type="button" aria-pressed={rentang === r.nilai} onClick={() => setRentang(r.nilai)}>
                {r.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => unduhCsv(tampil, "Laporan_Transaksi_Laundyku")}>
            Unduh CSV
          </button>
        </div>
      </div>

      <div className="ad-kpi-grid">
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Total pendapatan</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{formatRupiah(total)}</div>
          <div>
            <Pill tone="naik">↗ {perRentang.length} pesanan selesai</Pill>
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Pembayaran QRIS</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{formatRupiah(qris.reduce((s, t) => s + t.total, 0))}</div>
          <div>
            <Pill tone="naik">↗ {qris.length} transaksi</Pill>
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Pembayaran tunai</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{formatRupiah(tunai.reduce((s, t) => s + t.total, 0))}</div>
          <div>
            <Pill tone="naik">↗ {tunai.length} transaksi</Pill>
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Rata-rata per pesanan</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{formatRupiah(rataRata)}</div>
          <div>
            <Pill tone="netral">{rentang === "semua" ? "seluruh riwayat" : "sesuai rentang"}</Pill>
          </div>
        </div>
      </div>

      <div className="ad-split">
        <section className="ad-kartu">
          <div className="ad-kepala-kartu">
            <h2 className="ad-d">Riwayat pesanan selesai</h2>
            <p className="ad-hint" style={{ margin: 0 }}>
              {tampil.length} transaksi
            </p>
          </div>

          <div className="ad-kolom-cari" style={{ marginTop: 14 }}>
            <input
              type="text"
              placeholder="Cari nama atau kode..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              aria-label="Cari nama pelanggan atau kode"
            />
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              aria-label="Filter tanggal selesai"
            />
            <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} aria-label="Filter layanan">
              <option value="">Semua layanan</option>
              {daftarKategori.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            {adaFilter && (
              <button
                type="button"
                className="ad-btn ghost s"
                onClick={() => {
                  setFilterNama("");
                  setFilterTanggal("");
                  setFilterKategori("");
                }}
              >
                Reset
              </button>
            )}
          </div>

          <div className="ad-tabel-scroll" style={{ marginTop: 10 }}>
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Bayar</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((t) => (
                  <tr key={t.kode}>
                    <td>{t.kode}</td>
                    <td>{formatTanggalPendek(t.selesai.slice(0, 10))}</td>
                    <td>{t.pelanggan}</td>
                    <td>{t.kategori}</td>
                    <td>
                      <span className={`ad-chip ${t.pembayaran === "QRIS" ? "g" : ""}`}>{t.pembayaran}</span>
                    </td>
                    <td>
                      <strong>{formatRupiah(t.total)}</strong>
                    </td>
                                        <td>
                      <MenuAksi
                        label={`Aksi untuk transaksi ${t.kode}`}
                        items={[
                          { label: "Lihat detail", ikon: "lihat", onKlik: () => setLihat(t) },
                          {
                            label: "Edit",
                            ikon: "edit",
                            onKlik: () => {
                              setEdit(t);
                              setEditPembayaran(t.pembayaran);
                            },
                          },
                          { label: "Hapus", ikon: "hapus", bahaya: true, onKlik: () => setHapus(t) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tampil.length === 0 && <p className="ad-kosong">Tidak ada transaksi yang cocok dengan filter.</p>}
        </section>

        <section className="ad-kartu">
          <h2 className="ad-d">Pendapatan per layanan</h2>
          <p className="ad-hint">Perbandingan dari rentang yang dipilih</p>
          <div className="ad-donut-wrap">
            <Donut irisan={layanan} pusat={formatRibu(total)} sub="Total" />
          </div>
          <div className="ad-legenda">
            {layanan.map((i) => (
              <div key={i.label} className="ad-legenda-baris">
                <span className="ad-titik" style={{ background: i.warna }} />
                <span>{i.label}</span>
                <strong>{formatRupiah(i.nilai)}</strong>
              </div>
            ))}
          </div>
          {layanan.length === 0 && <p className="ad-kosong">Belum ada data.</p>}
        </section>
      </div>

      {/* Modal Baca / Lihat Detail */}
      {lihat && (
        <Modal judul={`Detail Transaksi ${lihat.kode}`} onTutup={() => setLihat(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#F4F5F8", padding: "14px 18px", borderRadius: 12, border: "1px solid #DFE3EB" }}>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>KODE TRANSAKSI</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1457D6" }}>{lihat.kode}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Selesai: {formatTanggalLengkap(lihat.selesai)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>PELANGGAN</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{lihat.pelanggan}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>LAYANAN</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{lihat.kategori}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>METODE BAYAR</div>
                <span className={`ad-chip ${lihat.pembayaran === "QRIS" ? "g" : ""}`} style={{ marginTop: 4 }}>
                  {lihat.pembayaran}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>TOTAL BIAYA</div>
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
              <label htmlFor="edit-pelanggan">Pelanggan</label>
              <input id="edit-pelanggan" type="text" value={edit.pelanggan} readOnly style={{ background: "#F4F5F8" }} />
            </div>

            <div>
              <label htmlFor="edit-pembayaran">Metode pembayaran</label>
              <select id="edit-pembayaran" value={editPembayaran} onChange={(e) => setEditPembayaran(e.target.value)}>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer Bank">Transfer Bank</option>
              </select>
            </div>

            <div className="ad-aksi">
              <button className="ad-btn y s" onClick={() => setEdit(null)}>
                Batal
              </button>
              <button className="ad-btn s" onClick={simpanEdit}>
                Simpan perubahan
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