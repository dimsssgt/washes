import type { JenisLayanan, PesananMasuk, WaktuCuci } from "./types";

// Data tiruan untuk membangun tampilan tanpa menunggu database.
// TODO: ganti dengan pembacaan dari Supabase setelah tabel pesanan siap.

export const DAFTAR_WAKTU_CUCI: WaktuCuci[] = [
  "Express 6 jam",
  "Quick 3 jam",
  "One Day 24 jam",
  "Reguler 3 hari",
];

export const pesananMasukTiruan: PesananMasuk[] = [
  {
    kode: "LDY-015",
    pelanggan: "Budi Santoso",
    noWa: "0812-1111-2222",
    alamatJemput: "Jl. Contoh No. 1, Semarang",
    layanan: "Kiloan",
    waktuCuci: "Express 6 jam",
    jamJemput: "09.00 – 10.00",
    catatan: "Tolong dipisah baju putih.",
  },
  {
    kode: "LDY-016",
    pelanggan: "Siti Aminah",
    noWa: "0813-3333-4444",
    alamatJemput: "Jl. Contoh No. 2, Semarang",
    layanan: "Satuan",
    waktuCuci: "Reguler 3 hari",
    jamJemput: "13.00 – 14.00",
    catatan: "",
  },
  {
    kode: "LDY-017",
    pelanggan: "Andi Wijaya",
    noWa: "0857-5555-6666",
    alamatJemput: "Jl. Contoh No. 3, Semarang",
    layanan: "Linen",
    waktuCuci: "One Day 24 jam",
    jamJemput: "16.00 – 17.00",
    catatan: "Sprei dan sarung bantal.",
  },
];

/**
 * Harga contoh saja. Angkanya BELUM tentu sama dengan data Admin.
 * TODO: ambil dari tabel harga milik halaman Admin (layanan + waktu cuci).
 */
export function hargaContoh(layanan: JenisLayanan, waktu: WaktuCuci): number {
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
