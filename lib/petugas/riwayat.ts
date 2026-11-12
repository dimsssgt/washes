import type { JenisLayanan } from "./types";
import type { MetodeBayar, MetodeSerah } from "./pengerjaan";

/** Satu baris riwayat: pesanan yang sudah diserahkan ke pelanggan. */
export interface RiwayatPenyerahan {
  kode: string;
  /** Tanggal serah dalam format ISO "YYYY-MM-DD". */
  diserahkan: string;
  pelanggan: string;
  layanan: JenisLayanan;
  total: number;
  metodeSerah: MetodeSerah;
  metodeBayar: MetodeBayar;
}

export interface FilterRiwayat {
  kata: string;
  layanan: JenisLayanan | "semua";
  metodeBayar: MetodeBayar | "semua";
  metodeSerah: MetodeSerah | "semua";
}

export const FILTER_KOSONG: FilterRiwayat = {
  kata: "",
  layanan: "semua",
  metodeBayar: "semua",
  metodeSerah: "semua",
};

export const UKURAN_HALAMAN = 5;

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "2026-10-26" menjadi "26 Okt 2026". */
export function formatTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || m < 1 || m > 12) return iso;
  return `${d} ${BULAN[m - 1]} ${y}`;
}

/** Urut dari yang terbaru (tanggal serah, lalu kode). */
export function urutkanTerbaru(daftar: RiwayatPenyerahan[]): RiwayatPenyerahan[] {
  return [...daftar].sort(
    (a, b) => b.diserahkan.localeCompare(a.diserahkan) || b.kode.localeCompare(a.kode),
  );
}

/** Cari berdasarkan kode atau nama pelanggan, lalu saring per layanan dan metode. */
export function filterRiwayat(daftar: RiwayatPenyerahan[], f: FilterRiwayat): RiwayatPenyerahan[] {
  const kata = f.kata.trim().toLowerCase();
  return daftar.filter(
    (r) =>
      (kata === "" || r.kode.toLowerCase().includes(kata) || r.pelanggan.toLowerCase().includes(kata)) &&
      (f.layanan === "semua" || r.layanan === f.layanan) &&
      (f.metodeBayar === "semua" || r.metodeBayar === f.metodeBayar) &&
      (f.metodeSerah === "semua" || r.metodeSerah === f.metodeSerah),
  );
}

export function jumlahHalaman(totalData: number, ukuran: number = UKURAN_HALAMAN): number {
  return Math.max(1, Math.ceil(totalData / ukuran));
}

/** Ambil satu halaman data. Nomor halaman di luar jangkauan otomatis dirapikan. */
export function potongHalaman<T>(daftar: T[], halaman: number, ukuran: number = UKURAN_HALAMAN): T[] {
  const h = Math.min(Math.max(1, halaman), jumlahHalaman(daftar.length, ukuran));
  return daftar.slice((h - 1) * ukuran, h * ukuran);
}
