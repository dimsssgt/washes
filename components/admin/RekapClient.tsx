"use client";

import { useMemo, useState } from "react";
import {
  NAMA_BULAN,
  NAMA_HARI,
  awalMinggu,
  formatRupiah,
  formatTanggalLengkap,
  formatWaktu,
  geserHari,
  pad,
  perBulan,
  perHariMinggu,
  perJam,
  perTahun,
  periodeBulanan,
  periodeHarian,
  periodeMingguan,
  periodeTahunan,
  tahunTersedia,
  tanggalTerbaru,
  totalDari,
  urutkan,
  type ModeRekap,
  type UrutTransaksi,
} from "@/lib/admin/rekap";
import type { Transaksi } from "@/lib/admin/types";

const TAB: { nilai: ModeRekap; label: string }[] = [
  { nilai: "harian", label: "Harian" },
  { nilai: "mingguan", label: "Mingguan" },
  { nilai: "bulanan", label: "Bulanan" },
  { nilai: "tahunan", label: "Tahunan" },
];

export default function RekapClient({ transaksi }: { transaksi: Transaksi[] }) {
  const daftarTahun = tahunTersedia(transaksi);
  const tanggalAwal = tanggalTerbaru(transaksi);

  const [mode, setMode] = useState<ModeRekap>("harian");
  const [tanggal, setTanggal] = useState(tanggalAwal);
  const [tahun, setTahun] = useState(daftarTahun[0] ?? new Date().getFullYear());
  const [bulan, setBulan] = useState(Number(tanggalAwal.slice(5, 7)) || 1);
  const [urut, setUrut] = useState<UrutTransaksi>("terbaru");

  const periode = useMemo(() => {
    if (mode === "harian") return periodeHarian(transaksi, tanggal);
    if (mode === "mingguan") return periodeMingguan(transaksi, tanggal);
    if (mode === "bulanan") return periodeBulanan(transaksi, tahun, bulan);
    return periodeTahunan(transaksi, tahun);
  }, [mode, transaksi, tanggal, tahun, bulan]);

  const tabel = urutkan(periode, urut);
  const total = totalDari(periode);

  // Batang grafik sesuai mode.
  const { judulGrafik, batang } = useMemo(() => {
    if (mode === "harian") {
      return {
        judulGrafik: "Pendapatan per jam",
        batang: perJam(periode)
          .slice(7, 22)
          .map((v, i) => ({ label: pad(i + 7), nilai: v })),
      };
    }
    if (mode === "mingguan") {
      return {
        judulGrafik: "Pendapatan Senin – Minggu",
        batang: perHariMinggu(transaksi, tanggal).map((v, i) => ({ label: NAMA_HARI[i], nilai: v })),
      };
    }
    if (mode === "bulanan") {
      return {
        judulGrafik: "Pendapatan per bulan (tahun terpilih)",
        batang: perBulan(transaksi, tahun).map((v, i) => ({ label: NAMA_BULAN[i], nilai: v })),
      };
    }
    return {
      judulGrafik: "Pendapatan per tahun",
      batang: perTahun(transaksi).map((t) => ({ label: String(t.tahun), nilai: t.total })),
    };
  }, [mode, periode, transaksi, tanggal, tahun]);

  const maks = Math.max(1, ...batang.map((b) => b.nilai));

  const keterangan =
    mode === "harian"
      ? formatTanggalLengkap(tanggal)
      : mode === "mingguan"
        ? `${formatTanggalLengkap(awalMinggu(tanggal))} – ${formatTanggalLengkap(geserHari(awalMinggu(tanggal), 6))}`
        : mode === "bulanan"
          ? `${NAMA_BULAN[bulan - 1]} ${tahun}`
          : `Tahun ${tahun}`;

  return (
    <>
      <div className="ad-kepala">
        <h1 className="ad-d" style={{ fontSize: 40, color: "var(--b)" }}>
          Rekap pendapatan
        </h1>
        <div className="ad-seg" role="group" aria-label="Periode rekap">
          {TAB.map((t) => (
            <button
              key={t.nilai}
              type="button"
              aria-pressed={mode === t.nilai}
              onClick={() => setMode(t.nilai)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="ad-kartu">
        <div className="ad-kepala-kartu">
          <div>
            <h2 className="ad-d">{judulGrafik}</h2>
            <p className="ad-hint">{keterangan}</p>
          </div>

          {mode === "harian" && (
            <div>
              <label htmlFor="rekap-tanggal">Tanggal</label>
              <input
                id="rekap-tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => e.target.value && setTanggal(e.target.value)}
              />
            </div>
          )}
          {mode === "mingguan" && (
            <div>
              <label htmlFor="rekap-minggu">Pilih hari dalam minggu</label>
              <input
                id="rekap-minggu"
                type="date"
                value={tanggal}
                onChange={(e) => e.target.value && setTanggal(e.target.value)}
              />
            </div>
          )}
          {mode === "bulanan" && (
            <div style={{ display: "flex", gap: 12 }}>
              <div>
                <label htmlFor="rekap-tahun">Tahun</label>
                <select id="rekap-tahun" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
                  {daftarTahun.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rekap-bulan">Bulan</label>
                <select id="rekap-bulan" value={bulan} onChange={(e) => setBulan(Number(e.target.value))}>
                  {NAMA_BULAN.map((n, i) => (
                    <option key={n} value={i + 1}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {mode === "tahunan" && (
            <div>
              <label htmlFor="rekap-tahun-saja">Tahun</label>
              <select
                id="rekap-tahun-saja"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
              >
                {daftarTahun.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="ad-g4" style={{ marginTop: 24 }}>
          <div className="ad-kartu kecil">
            <div style={{ fontSize: 12 }}>Total pendapatan</div>
            <div className="ad-d" style={{ fontSize: 28, marginTop: 8 }}>
              {formatRupiah(total)}
            </div>
          </div>
          <div className="ad-kartu kecil">
            <div style={{ fontSize: 12 }}>Pesanan selesai</div>
            <div className="ad-d" style={{ fontSize: 28, marginTop: 8 }}>
              {periode.length}
            </div>
          </div>
        </div>

        <div role="img" aria-label={judulGrafik} className="ad-grafik" style={{ marginTop: 28 }}>
          {batang.map((b) => (
            <div key={b.label} className="ad-kolom">
              <div
                className="ad-batang"
                style={{ height: `${(b.nilai / maks) * 100}%` }}
                title={formatRupiah(b.nilai)}
              />
              <span className="ad-label">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ad-kartu">
        <div className="ad-kepala-kartu">
          <h2 className="ad-d">Riwayat pesanan selesai</h2>
          <div>
            <label htmlFor="rekap-urut">Urutkan</label>
            <select id="rekap-urut" value={urut} onChange={(e) => setUrut(e.target.value as UrutTransaksi)}>
              <option value="terbaru">Terbaru ke terlama</option>
              <option value="terlama">Terlama ke terbaru</option>
              <option value="kategori">Kategori (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="ad-scroll">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>{mode === "harian" ? "Waktu selesai" : "Tanggal selesai"}</th>
                <th>Pelanggan</th>
                <th>Kategori</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tabel.map((t) => (
                <tr key={t.kode}>
                  <td>{t.kode}</td>
                  <td>{mode === "harian" ? formatWaktu(t.selesai) : formatTanggalLengkap(t.selesai)}</td>
                  <td>{t.pelanggan}</td>
                  <td>{t.kategori}</td>
                  <td>{formatRupiah(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tabel.length === 0 && <p className="ad-kosong">Belum ada pesanan selesai pada periode ini.</p>}
      </section>
    </>
  );
}