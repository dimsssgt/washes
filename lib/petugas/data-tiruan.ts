import type { WaktuCuci } from "./types";

export const DAFTAR_WAKTU_CUCI: WaktuCuci[] = [
  "Express 6 jam",
  "Quick 3 jam",
  "One Day 24 jam",
  "Reguler 3 hari",
];

/** Harga contoh untuk form penerimaan. TODO: ambil dari tabel harga di Supabase. */
export function hargaContoh(layanan: string, waktu: WaktuCuci): number {
  if (layanan === "Satuan") return 15000;
  if (layanan === "Linen") return 20000;
  const kiloan: Record<WaktuCuci, number> = {
    "Reguler 3 hari": 5000,
    "One Day 24 jam": 7000,
    "Express 6 jam": 10000,
    "Quick 3 jam": 12000,
  };
  return kiloan[waktu];
}