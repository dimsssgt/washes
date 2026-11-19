"use client";
import { useMemo, useState } from "react";
import {
  NAMA_BULAN,
  formatRupiah,
  formatTanggalPendek,
  geserHari,
  perBulan,
  perHariMinggu,
  periodeBulanan,
  periodeHarian,
  periodeMingguan,
  periodeTahunan,
  tahunTersedia,
  tanggalTerbaru,
  totalDari,
  urutkan,
  type ModeRekap,
} from "@/lib/admin/rekap";
import {
  NAMA_BULAN_PENUH,
  NAMA_HARI_PENUH,
  bucketTanggal,
  indeksHari,
  jamBuka,
  perJamOperasional,
  persen,
  ringkasLayanan,
  seriBulanan,
  unduhCsv,
  formatRibu,
} from "@/lib/admin/ringkasan";
import { Donut, KartuKpi, LineChart, Pill } from "./Grafik";
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

  // Pesanan pada periode yang dipilih.
  const periode = useMemo(() => {
    if (mode === "harian") return periodeHarian(transaksi, tanggal);
    if (mode === "mingguan") return periodeMingguan(transaksi, tanggal);
    if (mode === "bulanan") return periodeBulanan(transaksi, tahun, bulan);
    return periodeTahunan(transaksi, tahun);
  }, [mode, transaksi, tanggal, tahun, bulan]);

  // Periode pembanding, untuk persentase perubahan.
  const sebelumnya = useMemo(() => {
    if (mode === "harian") return periodeHarian(transaksi, geserHari(tanggal, -1));
    if (mode === "mingguan") return periodeMingguan(transaksi, geserHari(tanggal, -7));
    if (mode === "bulanan") {
      return bulan === 1 ? periodeBulanan(transaksi, tahun - 1, 12) : periodeBulanan(transaksi, tahun, bulan - 1);
    }
    return periodeTahunan(transaksi, tahun - 1);
  }, [mode, transaksi, tanggal, tahun, bulan]);

  const total = totalDari(periode);
  const totalSebelumnya = totalDari(sebelumnya);
  const pelangganUnik = new Set(periode.map((t) => t.pelanggan)).size;
  const pelangganSebelumnya = new Set(sebelumnya.map((t) => t.pelanggan)).size;

  // Bulan dasar untuk grafik harian dan sparkline.
  const basisTahun = mode === "bulanan" ? tahun : Number(tanggal.slice(0, 4));
  const basisBulan = mode === "bulanan" ? bulan : Number(tanggal.slice(5, 7));
  const seri = useMemo(() => seriBulanan(transaksi, basisTahun, basisBulan), [transaksi, basisTahun, basisBulan]);

  const namaMode = TAB.find((t) => t.nilai === mode)?.label ?? "";
  const keterangan =
    mode === "harian"
      ? formatTanggalPendek(tanggal)
      : mode === "mingguan"
        ? "Minggu ini"
        : mode === "bulanan"
          ? `${NAMA_BULAN[bulan - 1]} ${tahun}`
          : `Tahun ${tahun}`;

  // Grafik utama: harian dalam satu bulan, atau per bulan untuk mode tahunan.
  const garis: { judul: string; nilai: number[]; label: string[] } =
    mode === "tahunan"
      ? { judul: "Pendapatan per bulan", nilai: perBulan(transaksi, tahun), label: NAMA_BULAN_PENUH }
      : mode === "bulanan"
        ? { judul: "Pendapatan per 5 tanggal", ...bucketTanggal(seri.pendapatan) }
        : mode === "mingguan"
          ? { judul: "Pendapatan Senin–Minggu", nilai: perHariMinggu(transaksi, tanggal), label: NAMA_HARI_PENUH }
          : { judul: "Pendapatan per jam", ...perJamOperasional(periode, tanggal) };
  const totalGaris = garis.nilai.reduce((s, v) => s + v, 0);

  const jb = jamBuka(tanggal);
  const subGaris =
    mode === "harian"
      ? `${NAMA_HARI_PENUH[indeksHari(tanggal)]}, buka ${jb.mulai}–${jb.selesai}`
      : mode === "tahunan"
        ? `Tahun ${tahun}`
        : mode === "mingguan"
          ? `Minggu dari ${formatTanggalPendek(tanggal)}`
          : `${NAMA_BULAN[basisBulan - 1]} ${basisTahun}, dari pesanan selesai`;

  const sparkPendapatan = mode === "tahunan" ? perBulan(transaksi, tahun) : seri.pendapatan;
  const sparkPesanan = mode === "tahunan" ? null : seri.pesanan;
  const sparkPelanggan = mode === "tahunan" ? null : seri.pelanggan;

  const layanan = ringkasLayanan(periode);
  const terbaru = urutkan(periode, "terbaru");
  const pesananTerbaru = terbaru.slice(0, 5);
  const aktivitas = terbaru.slice(0, 4);

  return (
    <>
      <div className="ad-kepala">
        <div>
          <p className="ad-hint ad-crumb">Laundyku · Ringkasan</p>
          <h1 className="ad-d">Selamat datang, Admin</h1>
        </div>
        <div className="ad-baris-aksi">
          <div className="ad-seg" role="group" aria-label="Periode rekap">
            {TAB.map((t) => (
              <button key={t.nilai} type="button" aria-pressed={mode === t.nilai} onClick={() => setMode(t.nilai)}>
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => unduhCsv(periode, `Rekap_Laundyku_${namaMode}`)}>
            Unduh laporan
          </button>
        </div>
      </div>

      <div className="ad-filter">
        <div>
          <label htmlFor="rekap-tanggal">Tanggal</label>
          <input
            id="rekap-tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => e.target.value && setTanggal(e.target.value)}
          />
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
      </div>

      <div className="ad-kpi-grid">
        <KartuKpi
          judul={`Pendapatan ${namaMode.toLowerCase()}`}
          tag="periode ini"
          nilai={formatRupiah(total)}
          delta={persen(total, totalSebelumnya)}
          spark={sparkPendapatan}
          warna="#1457d6"
        />
        <KartuKpi
          judul="Pesanan selesai"
          tag="periode ini"
          nilai={String(periode.length)}
          delta={persen(periode.length, sebelumnya.length)}
          spark={sparkPesanan}
          warna="#12805c"
        />
        <KartuKpi
          judul="Pelanggan aktif"
          tag="periode ini"
          nilai={String(pelangganUnik)}
          delta={persen(pelangganUnik, pelangganSebelumnya)}
          spark={sparkPelanggan}
          warna="#e0a800"
        />
      </div>

      <div className="ad-split">
        <section className="ad-kartu">
          <div className="ad-kepala-kartu">
            <div>
              <h2 className="ad-d">{garis.judul}</h2>
              <p className="ad-hint">{subGaris}</p>
            </div>
            <Pill tone="netral">Total {formatRupiah(totalGaris)}</Pill>
          </div>
          <div style={{ marginTop: 12 }}>
            <LineChart nilai={garis.nilai} label={garis.label} />
          </div>
        </section>

        <section className="ad-kartu">
          <h2 className="ad-d">Total pendapatan per layanan</h2>
          <p className="ad-hint">
            {keterangan} · {periode.length} pesanan selesai
          </p>
          <div className="ad-donut-wrap">
            <Donut irisan={layanan} pusat={formatRibu(total)} sub="Total" />
          </div>
          <div className="ad-legenda">
            {layanan.map((i) => (
              <div key={i.label} className="ad-legenda-baris">
                <span className="ad-titik" style={{ background: i.warna }} />
                <span>{i.label}</span>
                <strong>
                  {formatRupiah(i.nilai)}
                  <small>· {i.persen}%</small>
                </strong>
              </div>
            ))}
          </div>
          {layanan.length === 0 && <p className="ad-kosong">Belum ada pesanan selesai pada periode ini.</p>}
        </section>
      </div>

      <div className="ad-split dua">
        <section className="ad-kartu">
          <h2 className="ad-d">Pesanan terbaru</h2>
          <div className="ad-scroll" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pesananTerbaru.map((t) => (
                  <tr key={t.kode}>
                    <td>{t.kode}</td>
                    <td>{t.pelanggan}</td>
                    <td>{t.kategori}</td>
                    <td>{formatRupiah(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pesananTerbaru.length === 0 && <p className="ad-kosong">Belum ada pesanan.</p>}
        </section>

        <section className="ad-kartu">
          <h2 className="ad-d">Aktivitas terbaru</h2>
          <ul className="ad-aktivitas">
            {aktivitas.map((t) => (
              <li key={t.kode}>
                <strong>{t.pelanggan}</strong>
                <time>
                  {formatTanggalPendek(t.selesai.slice(0, 10))} · {t.selesai.slice(11, 16).replace(":", ".")}
                </time>
                <span>menyelesaikan {t.kode}</span>
              </li>
            ))}
          </ul>
          {aktivitas.length === 0 && <p className="ad-kosong">Belum ada aktivitas.</p>}
        </section>
      </div>
    </>
  );
}