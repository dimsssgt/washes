/** Satu notifikasi untuk petugas. */
export interface NotifikasiPetugas {
  id: string;
  judul: string;
  isi: string;
  /** Waktu kejadian dalam format ISO (UTC), misalnya "2026-11-12T09:58:00.000Z". */
  waktu: string;
  dibaca: boolean;
}

export type ModeNotifikasi = "semua" | "belum";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Semua tanggal dan jam selalu dihitung dalam zona WIB. Dengan begitu hasil di server
// (Vercel, zona UTC) dan di browser sama persis, sehingga tidak terjadi hydration error.
const FORMAT_WIB = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

interface BagianWaktu {
  tahun: number;
  bulan: number;
  hari: number;
  jam: string;
  menit: string;
}

function bagianWIB(d: Date): BagianWaktu {
  const p: Record<string, string> = {};
  for (const bagian of FORMAT_WIB.formatToParts(d)) p[bagian.type] = bagian.value;
  return {
    tahun: Number(p.year),
    bulan: Number(p.month),
    hari: Number(p.day),
    jam: p.hour.padStart(2, "0"),
    menit: p.minute.padStart(2, "0"),
  };
}

/** Selisih hari kalender (WIB) antara dua waktu: 0 = hari yang sama, 1 = kemarin. */
function selisihHariKalender(a: Date, b: Date): number {
  const x = bagianWIB(a);
  const y = bagianWIB(b);
  const ax = Date.UTC(x.tahun, x.bulan - 1, x.hari);
  const by = Date.UTC(y.tahun, y.bulan - 1, y.hari);
  return Math.round((ax - by) / 86_400_000);
}

/**
 * Teks waktu seperti di desain: "2 menit lalu", "1 jam lalu",
 * "Kemarin, 16.30", atau "9 Nov 2026, 09.10".
 */
export function waktuRelatif(iso: string, sekarang: Date): string {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;

  const menit = Math.floor((sekarang.getTime() - t.getTime()) / 60_000);
  if (menit < 1) return "Baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  if (menit < 24 * 60) return `${Math.floor(menit / 60)} jam lalu`;

  const w = bagianWIB(t);
  const jam = `${w.jam}.${w.menit}`;
  if (selisihHariKalender(sekarang, t) === 1) return `Kemarin, ${jam}`;
  return `${w.hari} ${BULAN[w.bulan - 1]} ${w.tahun}, ${jam}`;
}

/** Membuat waktu ISO untuk "n hari lalu pukul jam:menit WIB". Dipakai untuk data tiruan. */
export function waktuWIB(sekarang: Date, hariLalu: number, jam: number, menit: number): string {
  const { tahun, bulan, hari } = bagianWIB(sekarang);
  // WIB = UTC+7, jadi jam WIB dikurangi 7 untuk mendapat UTC.
  return new Date(Date.UTC(tahun, bulan - 1, hari - hariLalu, jam - 7, menit)).toISOString();
}

export function urutkanTerbaru(daftar: NotifikasiPetugas[]): NotifikasiPetugas[] {
  return [...daftar].sort((a, b) => b.waktu.localeCompare(a.waktu));
}

export function hitungBelumDibaca(daftar: NotifikasiPetugas[]): number {
  return daftar.filter((n) => !n.dibaca).length;
}

export function saring(daftar: NotifikasiPetugas[], mode: ModeNotifikasi): NotifikasiPetugas[] {
  return mode === "belum" ? daftar.filter((n) => !n.dibaca) : daftar;
}

export function tandaiDibaca(daftar: NotifikasiPetugas[], id: string): NotifikasiPetugas[] {
  return daftar.map((n) => (n.id === id ? { ...n, dibaca: true } : n));
}

export function tandaiSemuaDibaca(daftar: NotifikasiPetugas[]): NotifikasiPetugas[] {
  return daftar.map((n) => (n.dibaca ? n : { ...n, dibaca: true }));
}
