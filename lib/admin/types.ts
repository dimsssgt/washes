export type MetodeBayar = "QRIS" | "Tunai";
export type PeranPengguna = "Admin" | "Petugas" | "Pelanggan";

export interface Layanan {
  id: string;
  nama: string;
  deskripsi: string;
  aktif: boolean;
}

/** Harga per layanan. `express` null berarti layanan itu tidak punya waktu express. */
export interface Harga {
  id: string;
  layanan: string;
  satuan: string;
  reguler: number;
  oneDay: number | null;
  express: number | null;
  quick: number | null;
}

export interface Pengguna {
  id: string;
  nama: string;
  email: string;
  peran: PeranPengguna;
  aktif: boolean;
}

/** `selesai` berformat "YYYY-MM-DDTHH:mm" (waktu lokal, tanpa zona). */
export interface Transaksi {
  kode: string;
  pelanggan: string;
  kategori: string;
  total: number;
  pembayaran: MetodeBayar;
  selesai: string;
}
