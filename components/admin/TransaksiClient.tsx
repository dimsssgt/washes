"use client";

import { useState } from "react";
import { Konfirmasi } from "./Modal";
import { TrashIcon } from "./Icons";
import { formatRupiah, formatTanggalPendek, urutkan } from "@/lib/admin/rekap";
import type { Transaksi } from "@/lib/admin/types";

export default function TransaksiClient({ transaksiAwal }: { transaksiAwal: Transaksi[] }) {
  const [daftar, setDaftar] = useState(transaksiAwal);
  const [hapus, setHapus] = useState<Transaksi | null>(null);

  // TODO (Supabase): hapus baris pesanan/pembayaran terkait, bukan hanya dari state.
  const tampil = urutkan(daftar, "terbaru");

  return (
    <>
      <div className="ad-kepala">
        <h1 className="ad-d" style={{ fontSize: 40, color: "var(--b)" }}>
          Transaksi
        </h1>
      </div>

      <section className="ad-kartu">
        <h2 className="ad-d">Daftar transaksi</h2>
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
                  <td>{formatRupiah(t.total)}</td>
                  <td>
                    <span className="ad-chip">{t.pembayaran}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ad-btn r icon"
                      onClick={() => setHapus(t)}
                      title="Hapus transaksi"
                      aria-label="Hapus transaksi"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tampil.length === 0 && <p className="ad-kosong">Belum ada transaksi.</p>}
        <p className="ad-hint">Hapus transaksi akan meminta konfirmasi terlebih dahulu.</p>
      </section>

      {hapus && (
        <Konfirmasi
          judul="Hapus transaksi?"
          pesan={`Transaksi ${hapus.kode} akan dihapus dari daftar.`}
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
