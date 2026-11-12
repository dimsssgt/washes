import type { JenisLayanan } from "./types";

/** Urutan tahap pengerjaan, persis seperti pilihan di desain "Update tahap". */
export type Tahap = "ditimbang" | "dicuci" | "disetrika" | "siap" | "selesai";

export const URUTAN_TAHAP: Tahap[] = ["ditimbang", "dicuci", "disetrika", "siap", "selesai"];

export const LABEL_TAHAP: Record<Tahap, string> = {
  ditimbang: "Cucian ditimbang",
  dicuci: "Sedang dicuci",
  disetrika: "Sedang disetrika",
  siap: "Siap diantar/diambil",
  selesai: "Selesai",
};

/** Tahap yang masih tampil di tabel "Proses pengerjaan". */
export const TAHAP_PROSES: Tahap[] = ["ditimbang", "dicuci", "disetrika"];

export type MetodeSerah = "Diantar" | "Ambil sendiri";
export type MetodeBayar = "Tunai" | "QRIS";

export interface PesananKerja {
  kode: string;
  pelanggan: string;
  layanan: JenisLayanan;
  /** Teks siap tampil, misalnya "4 kg" atau "5 pcs". */
  beratJumlah: string;
  tahap: Tahap;
  metodeSerah: MetodeSerah;
  total: number;
  lunas: boolean;
  metodeBayar: MetodeBayar | null;
  penerima: string | null;
}

export function tahapBerikutnya(t: Tahap): Tahap | null {
  const i = URUTAN_TAHAP.indexOf(t);
  return i >= 0 && i < URUTAN_TAHAP.length - 1 ? URUTAN_TAHAP[i + 1] : null;
}

/** Aturan: status hanya boleh maju satu tahap, tidak boleh mundur atau melompat. */
export function bolehPindahTahap(dari: Tahap, ke: Tahap): boolean {
  return tahapBerikutnya(dari) === ke;
}

/**
 * Tahap "selesai" tidak dipilih lewat Update tahap, melainkan lewat penyerahan.
 * Jadi dari "siap" tidak ada lagi tombol Ubah.
 */
export function bisaDiubahTahapnya(p: PesananKerja): boolean {
  return TAHAP_PROSES.includes(p.tahap);
}

/** Aturan: penyerahan hanya untuk pesanan yang sudah "siap diantar/diambil". */
export function bolehDiserahkan(p: PesananKerja): boolean {
  return p.tahap === "siap";
}

export const dalamProses = (daftar: PesananKerja[]) => daftar.filter((p) => TAHAP_PROSES.includes(p.tahap));
export const siapDiserahkan = (daftar: PesananKerja[]) => daftar.filter((p) => p.tahap === "siap");
