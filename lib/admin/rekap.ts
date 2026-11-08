import type { Transaksi } from "./types";

export type ModeRekap = "harian" | "mingguan" | "bulanan" | "tahunan";
export type UrutTransaksi = "terbaru" | "terlama" | "kategori";

export const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const pad = (n: number) => String(n).padStart(2, "0");
const tanggalDari = (t: Transaksi) => t.selesai.slice(0, 10);

export function formatRupiah(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

/** Geser tanggal "YYYY-MM-DD" sebanyak n hari. */
export function geserHari(tanggal: string, n: number): string {
  const d = new Date(`${tanggal}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Tanggal Senin dari minggu yang memuat `tanggal`. */
export function awalMinggu(tanggal: string): string {
  const hari = (new Date(`${tanggal}T00:00:00`).getDay() + 6) % 7; // Senin = 0
  return geserHari(tanggal, -hari);
}

export function totalDari(daftar: Transaksi[]): number {
  return daftar.reduce((s, t) => s + t.total, 0);
}

export function tanggalTerbaru(daftar: Transaksi[]): string {
  return daftar.reduce((m, t) => (tanggalDari(t) > m ? tanggalDari(t) : m), "");
}

export function tahunTersedia(daftar: Transaksi[]): number[] {
  const tahun = new Set(daftar.map((t) => Number(t.selesai.slice(0, 4))));
  return [...tahun].sort((a, b) => b - a);
}

// ---- Filter periode ----

export function periodeHarian(daftar: Transaksi[], tanggal: string): Transaksi[] {
  return daftar.filter((t) => tanggalDari(t) === tanggal);
}

export function periodeMingguan(daftar: Transaksi[], tanggal: string): Transaksi[] {
  const awal = awalMinggu(tanggal);
  const akhir = geserHari(awal, 6);
  return daftar.filter((t) => tanggalDari(t) >= awal && tanggalDari(t) <= akhir);
}

export function periodeBulanan(daftar: Transaksi[], tahun: number, bulan: number): Transaksi[] {
  const kunci = `${tahun}-${pad(bulan)}`;
  return daftar.filter((t) => t.selesai.startsWith(kunci));
}

export function periodeTahunan(daftar: Transaksi[], tahun: number): Transaksi[] {
  return daftar.filter((t) => t.selesai.startsWith(`${tahun}-`));
}

/** Total per tahun untuk semua tahun di data, urut dari yang terlama. */
export function perTahun(daftar: Transaksi[]): { tahun: number; total: number }[] {
  return tahunTersedia(daftar)
    .slice()
    .reverse()
    .map((tahun) => ({ tahun, total: totalDari(periodeTahunan(daftar, tahun)) }));
}

// ---- Data grafik ----

/** Total per jam (indeks 0–23). */
export function perJam(daftar: Transaksi[]): number[] {
  const hasil = Array<number>(24).fill(0);
  for (const t of daftar) hasil[Number(t.selesai.slice(11, 13))] += t.total;
  return hasil;
}

/** Total per hari, Senin sampai Minggu, dari minggu yang memuat `tanggal`. */
export function perHariMinggu(daftar: Transaksi[], tanggal: string): number[] {
  const awal = awalMinggu(tanggal);
  return Array.from({ length: 7 }, (_, i) => {
    const hari = geserHari(awal, i);
    return totalDari(daftar.filter((t) => tanggalDari(t) === hari));
  });
}

/** Total per bulan (Jan–Des) untuk tahun terpilih. */
export function perBulan(daftar: Transaksi[], tahun: number): number[] {
  return Array.from({ length: 12 }, (_, i) => totalDari(periodeBulanan(daftar, tahun, i + 1)));
}

// ---- Urutan dan format ----

export function urutkan(daftar: Transaksi[], urut: UrutTransaksi): Transaksi[] {
  if (urut === "kategori") {
    return [...daftar].sort((a, b) => a.kategori.localeCompare(b.kategori, "id"));
  }
  const menaik = [...daftar].sort((a, b) => a.selesai.localeCompare(b.selesai));
  return urut === "terbaru" ? menaik.reverse() : menaik;
}

/** "28 Okt" */
export function formatTanggalPendek(tanggal: string): string {
  const d = new Date(`${tanggal}T00:00:00`);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]}`;
}

/** "28 Okt 2026" — menerima "YYYY-MM-DD" maupun "YYYY-MM-DDTHH:mm". */
export function formatTanggalLengkap(tanggal: string): string {
  const tgl = tanggal.slice(0, 10);
  return `${formatTanggalPendek(tgl)} ${tgl.slice(0, 4)}`;
}

/** "28 Okt · 17.40" */
export function formatWaktu(selesai: string): string {
  const [tgl, jam] = selesai.split("T");
  return `${formatTanggalPendek(tgl)} · ${jam.slice(0, 5).replace(":", ".")}`;
}
