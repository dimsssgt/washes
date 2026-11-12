"use client";

import { useMemo, useState } from "react";
import { formatRupiah } from "@/lib/petugas/hitung";
import {
  FILTER_KOSONG,
  UKURAN_HALAMAN,
  filterRiwayat,
  formatTanggal,
  jumlahHalaman,
  potongHalaman,
  urutkanTerbaru,
  type FilterRiwayat,
  type RiwayatPenyerahan,
} from "@/lib/petugas/riwayat";

export default function RiwayatPetugas({ awal }: { awal: RiwayatPenyerahan[] }) {
  const [filter, setFilter] = useState<FilterRiwayat>(FILTER_KOSONG);
  const [halaman, setHalaman] = useState(1);

  const hasil = useMemo(() => filterRiwayat(urutkanTerbaru(awal), filter), [awal, filter]);
  const totalHalaman = jumlahHalaman(hasil.length);
  const halamanAktif = Math.min(halaman, totalHalaman);
  const tampil = potongHalaman(hasil, halamanAktif);
  const awalNomor = hasil.length === 0 ? 0 : (halamanAktif - 1) * UKURAN_HALAMAN + 1;
  const akhirNomor = (halamanAktif - 1) * UKURAN_HALAMAN + tampil.length;
  const adaFilter =
    filter.kata.trim() !== "" ||
    filter.layanan !== "semua" ||
    filter.metodeBayar !== "semua" ||
    filter.metodeSerah !== "semua";

  function ubah(perubahan: Partial<FilterRiwayat>) {
    setFilter((f) => ({ ...f, ...perubahan }));
    setHalaman(1);
  }

  return (
    <>
      <div className="pt-kepala">
        <span className="pt-lonceng" role="img" aria-label="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="pt-titik" />
        </span>
        <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Riwayat</h1>
      </div>

      <section id="riwayat-serah" className="pt-kartu">
        <h2 className="pt-d">Penyerahan cucian selesai</h2>
        <p className="pt-hint">Daftar cucian yang sudah diserahkan ke pelanggan, urut dari yang terbaru.</p>

        <div className="pt-filter" role="search">
          <div>
            <label htmlFor="rw-cari">Cari kode atau pelanggan</label>
            <input
              id="rw-cari"
              type="search"
              placeholder="Cth: LDY-005 atau Sari"
              value={filter.kata}
              onChange={(e) => ubah({ kata: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="rw-layanan">Layanan</label>
            <select id="rw-layanan" value={filter.layanan} onChange={(e) => ubah({ layanan: e.target.value as FilterRiwayat["layanan"] })}>
              <option value="semua">Semua</option>
              <option value="Kiloan">Kiloan</option>
              <option value="Satuan">Satuan</option>
              <option value="Linen">Linen</option>
            </select>
          </div>
          <div>
            <label htmlFor="rw-bayar">Pembayaran</label>
            <select id="rw-bayar" value={filter.metodeBayar} onChange={(e) => ubah({ metodeBayar: e.target.value as FilterRiwayat["metodeBayar"] })}>
              <option value="semua">Semua</option>
              <option value="Tunai">Tunai</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>
          <div>
            <label htmlFor="rw-metode">Metode serah</label>
            <select id="rw-metode" value={filter.metodeSerah} onChange={(e) => ubah({ metodeSerah: e.target.value as FilterRiwayat["metodeSerah"] })}>
              <option value="semua">Semua</option>
              <option value="Diantar">Diantar</option>
              <option value="Ambil sendiri">Ambil sendiri</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="btn y s"
              disabled={!adaFilter}
              onClick={() => {
                setFilter(FILTER_KOSONG);
                setHalaman(1);
              }}
            >
              Reset filter
            </button>
          </div>
        </div>

        <p className="pt-info" aria-live="polite">
          {hasil.length === 0
            ? "Tidak ada riwayat yang cocok."
            : `Menampilkan ${awalNomor}–${akhirNomor} dari ${hasil.length} riwayat.`}
        </p>

        {hasil.length === 0 ? (
          <p className="pt-kosong">
            {adaFilter ? "Coba ubah kata kunci atau reset filter." : "Belum ada cucian yang diserahkan."}
          </p>
        ) : (
          <div className="pt-gulung">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Diserahkan</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((r) => (
                  <tr key={r.kode}>
                    <td>{r.kode}</td>
                    <td>{formatTanggal(r.diserahkan)}</td>
                    <td>{r.pelanggan}</td>
                    <td>{r.layanan}</td>
                    <td>{formatRupiah(r.total)}</td>
                    <td>{r.metodeSerah}</td>
                    <td><span className="chip y">{r.metodeBayar}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasil.length > UKURAN_HALAMAN && (
          <nav className="pt-halaman" aria-label="Navigasi halaman">
            <button type="button" className="btn y s" disabled={halamanAktif <= 1} onClick={() => setHalaman(halamanAktif - 1)}>
              ‹ Sebelumnya
            </button>
            <span>Halaman {halamanAktif} dari {totalHalaman}</span>
            <button type="button" className="btn y s" disabled={halamanAktif >= totalHalaman} onClick={() => setHalaman(halamanAktif + 1)}>
              Berikutnya ›
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
