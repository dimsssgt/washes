export type JenisLayanan = "Kiloan" | "Satuan" | "Linen";

export type WaktuCuci =
  | "Express 6 jam"
  | "Quick 3 jam"
  | "One Day 24 jam"
  | "Reguler 3 hari";

/** Pesanan yang sudah masuk dari pelanggan dan menunggu diterima petugas. */
export interface PesananMasuk {
  kode: string;
  pelanggan: string;
  noWa: string;
  alamatJemput: string;
  layanan: JenisLayanan;
  waktuCuci: WaktuCuci;
  jamJemput: string;
  catatan: string;
}

/** Hasil penimbangan yang sudah lolos validasi. */
export interface HasilPenimbangan {
  /** Hanya terisi untuk layanan Kiloan. */
  beratKg: number | null;
  jumlahItem: number;
  /** Harga per kg (Kiloan) atau per item (Satuan dan Linen). */
  hargaSatuan: number;
  subtotal: number;
  catatanKondisi: string;
}

export type TahapPopup = "tutup" | "terima" | "konfirmasi" | "ringkasan";
