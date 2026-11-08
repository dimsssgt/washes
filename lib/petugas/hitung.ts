import type { HasilPenimbangan, JenisLayanan } from "./types";

/** Aturan dari desain: kiloan dihitung per kg, minimal 3 kg. */
export const BERAT_MINIMAL_KG = 3;

/** Isi form penimbangan (semua masih berupa teks dari input). */
export interface DrafPenimbangan {
  berat: string;
  jumlah: string;
  harga: string;
  catatan: string;
}

export type GalatPenimbangan = Partial<Record<"berat" | "jumlah" | "harga", string>>;

export function formatRupiah(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

/** Angka desimal; koma dan titik sama-sama diterima ("4,5" atau "4.5"). */
export function parseDesimal(s: string): number {
  const t = s.trim().replace(",", ".");
  return t === "" ? NaN : Number(t);
}

/** Rupiah: semua selain angka dibuang ("10.000" menjadi 10000). */
export function parseRupiah(s: string): number {
  const d = s.replace(/\D/g, "");
  return d === "" ? NaN : Number(d);
}

/** Subtotal untuk ditampilkan langsung saat petugas mengetik. 0 jika belum lengkap. */
export function hitungSubtotal(layanan: JenisLayanan, d: DrafPenimbangan): number {
  const harga = parseRupiah(d.harga);
  const dasar = layanan === "Kiloan" ? parseDesimal(d.berat) : parseDesimal(d.jumlah);
  if (!Number.isFinite(dasar) || !Number.isFinite(harga)) return 0;
  return Math.round(dasar * harga);
}

export function validasiPenimbangan(
  layanan: JenisLayanan,
  d: DrafPenimbangan,
): { galat: GalatPenimbangan; hasil: HasilPenimbangan | null } {
  const galat: GalatPenimbangan = {};
  const kiloan = layanan === "Kiloan";

  let berat: number | null = null;
  if (kiloan) {
    const b = parseDesimal(d.berat);
    if (!Number.isFinite(b) || b <= 0) galat.berat = "Berat harus lebih dari 0.";
    else if (b < BERAT_MINIMAL_KG) galat.berat = `Minimal ${BERAT_MINIMAL_KG} kg.`;
    else berat = b;
  }

  // Kiloan: jumlah item hanya catatan (boleh kosong). Satuan dan Linen: wajib minimal 1.
  const minimalJumlah = kiloan ? 0 : 1;
  let jumlah = 0;
  if (d.jumlah.trim() === "") {
    if (!kiloan) galat.jumlah = "Jumlah item wajib diisi.";
  } else {
    jumlah = parseDesimal(d.jumlah);
    if (!Number.isInteger(jumlah) || jumlah < minimalJumlah) {
      galat.jumlah = `Isi bilangan bulat minimal ${minimalJumlah}.`;
    }
  }

  const harga = parseRupiah(d.harga);
  if (!Number.isFinite(harga) || harga <= 0) galat.harga = "Harga harus lebih dari 0.";

  if (Object.keys(galat).length > 0) return { galat, hasil: null };

  const dasar = kiloan ? (berat as number) : jumlah;
  return {
    galat,
    hasil: {
      beratKg: berat,
      jumlahItem: jumlah,
      hargaSatuan: harga,
      subtotal: Math.round(dasar * harga),
      catatanKondisi: d.catatan.trim(),
    },
  };
}

export function ringkasBeratJumlah(layanan: JenisLayanan, h: HasilPenimbangan): string {
  if (layanan === "Kiloan") {
    return h.jumlahItem > 0 ? `${h.beratKg} kg · ${h.jumlahItem} pcs` : `${h.beratKg} kg`;
  }
  return `${h.jumlahItem} pcs`;
}
