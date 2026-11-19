import type { Transaksi } from "./types";
import { pad } from "./rekap";

// Warna irisan donut: biru, kuning, hijau, pink, ungu (urut dari layanan terbesar).
export const WARNA_LAYANAN = ["#1457d6", "#ffd21f", "#12805c", "#e0457b", "#7c5cff"];

/** 58000 -> "58rb", 1250000 -> "1,3jt" */
export function formatRibu(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")}jt`;
  if (n >= 1000) return `${Math.round(n / 1000)}rb`;
  return String(Math.round(n));
}

/** Persentase perubahan. null berarti pembanding 0 (tidak bisa dihitung). */
export function persen(sekarang: number, sebelumnya: number): number | null {
  if (sebelumnya === 0) return null;
  return ((sekarang - sebelumnya) / sebelumnya) * 100;
}

export function teksPersen(p: number | null): string {
  if (p === null) return "baru";
  return `${p >= 0 ? "↗" : "↘"} ${Math.abs(p).toFixed(1).replace(".", ",")}%`;
}

export function deltaTone(p: number | null): "naik" | "turun" | "netral" {
  if (p === null) return "netral";
  return p >= 0 ? "naik" : "turun";
}

/** Batas atas sumbu grafik yang rapi, misalnya 23.000 -> 30.000. */
export function batasAtas(n: number): number {
  if (n <= 0) return 1;
  const pangkat = 10 ** Math.floor(Math.log10(n));
  return Math.ceil(n / pangkat) * pangkat;
}

/** Data harian satu bulan: pendapatan, jumlah pesanan, dan pelanggan unik kumulatif. */
export function seriBulanan(daftar: Transaksi[], tahun: number, bulan: number) {
  const jumlahHari = new Date(tahun, bulan, 0).getDate();
  const awalan = `${tahun}-${pad(bulan)}`;
  const pendapatan: number[] = Array(jumlahHari).fill(0);
  const pesanan: number[] = Array(jumlahHari).fill(0);
  const namaPerHari: Set<string>[] = Array.from({ length: jumlahHari }, () => new Set<string>());

  for (const t of daftar) {
    if (!t.selesai.startsWith(awalan)) continue;
    const d = Number(t.selesai.slice(8, 10)) - 1;
    pendapatan[d] += t.total;
    pesanan[d] += 1;
    namaPerHari[d].add(t.pelanggan);
  }

  const sudah = new Set<string>();
  const pelanggan = namaPerHari.map((s) => {
    s.forEach((n) => sudah.add(n));
    return sudah.size;
  });

  return {
    label: Array.from({ length: jumlahHari }, (_, i) => String(i + 1)),
    pendapatan,
    pesanan,
    pelanggan,
  };
}

/** Total per layanan, diurutkan dari yang terbesar, lengkap dengan warna dan persen. */
export function ringkasLayanan(daftar: Transaksi[]) {
  const peta = new Map<string, number>();
  for (const t of daftar) peta.set(t.kategori, (peta.get(t.kategori) ?? 0) + t.total);
  const total = Array.from(peta.values()).reduce((s, v) => s + v, 0);
  return Array.from(peta.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, nilai], i) => ({
      label,
      nilai,
      persen: total ? Math.round((nilai / total) * 100) : 0,
      warna: WARNA_LAYANAN[i % WARNA_LAYANAN.length],
    }));
}

/** Unduh daftar transaksi sebagai CSV. Hanya jalan di browser. */
export function unduhCsv(daftar: Transaksi[], namaDasar: string) {
  const header = ["Kode Transaksi", "Tanggal Selesai", "Nama Pelanggan", "Kategori Layanan", "Total Biaya (Rp)", "Metode Pembayaran"];
  const baris = daftar.map((t) =>
    [t.kode, t.selesai, `"${t.pelanggan}"`, `"${t.kategori}"`, String(t.total), `"${t.pembayaran}"`].join(","),
  );
  const isi = "data:text/csv;charset=utf-8," + [header.join(","), ...baris].join("\n");
  const tautan = document.createElement("a");
  tautan.setAttribute("href", encodeURI(isi));
  tautan.setAttribute("download", `${namaDasar}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);
}

export const NAMA_BULAN_PENUH = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
export const NAMA_HARI_PENUH = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

/** Indeks hari dengan Senin = 0 dan Minggu = 6. */
export function indeksHari(tanggal: string): number {
  return (new Date(`${tanggal}T00:00:00`).getDay() + 6) % 7;
}

/** Jam buka: Senin–Jumat 07–21, Sabtu 08–20, Minggu 09–17. */
export function jamBuka(tanggal: string): { mulai: number; selesai: number } {
  const hari = indeksHari(tanggal);
  if (hari === 6) return { mulai: 9, selesai: 17 };
  if (hari === 5) return { mulai: 8, selesai: 20 };
  return { mulai: 7, selesai: 21 };
}

/** Pendapatan per jam dalam jam buka pada tanggal itu. */
export function perJamOperasional(daftar: Transaksi[], tanggal: string) {
  const { mulai, selesai } = jamBuka(tanggal);
  const label: string[] = [];
  const nilai: number[] = [];
  for (let h = mulai; h <= selesai; h++) {
    label.push(String(h));
    nilai.push(
      daftar
        .filter((t) => t.selesai.slice(0, 10) === tanggal && Number(t.selesai.slice(11, 13)) === h)
        .reduce((s, t) => s + t.total, 0),
    );
  }
  return { label, nilai };
}

/** Kelompokkan pendapatan harian per 5 tanggal. Kelompok terakhir berisi sisa hari. */
export function bucketTanggal(nilaiHarian: number[]) {
  const label: string[] = [];
  const nilai: number[] = [];
  for (let awal = 0; awal < nilaiHarian.length; awal += 5) {
    const akhir = Math.min(awal + 5, nilaiHarian.length);
    label.push(akhir - awal === 1 ? `${awal + 1}` : `${awal + 1}–${akhir}`);
    nilai.push(nilaiHarian.slice(awal, akhir).reduce((s, v) => s + v, 0));
  }
  return { label, nilai };
}