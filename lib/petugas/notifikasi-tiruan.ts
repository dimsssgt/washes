import { waktuWIB, type NotifikasiPetugas } from "./notifikasi";

const menitLalu = (sekarang: Date, m: number) => new Date(sekarang.getTime() - m * 60_000).toISOString();

// Data tiruan. TODO: ganti dengan tabel notifikasi di Supabase (penerima = id petugas).
export function buatNotifikasiTiruan(sekarang: Date): NotifikasiPetugas[] {
  return [
    { id: "n1", judul: "Pesanan baru masuk", isi: "LDY-018 dari Budi Santoso menunggu diterima.", waktu: menitLalu(sekarang, 2), dibaca: false },
    { id: "n2", judul: "Pelanggan membatalkan pesanan", isi: "LDY-016 dibatalkan pelanggan sebelum diterima.", waktu: menitLalu(sekarang, 40), dibaca: false },
    { id: "n3", judul: "Pembayaran menunggu konfirmasi", isi: "LDY-009 ditandai sudah bayar oleh pelanggan. Cek sebelum penyerahan.", waktu: menitLalu(sekarang, 130), dibaca: true },
    { id: "n4", judul: "Cucian siap diserahkan", isi: "LDY-008 sudah siap diantar atau diambil.", waktu: waktuWIB(sekarang, 1, 16, 30), dibaca: true },
    { id: "n5", judul: "Pesanan baru masuk", isi: "LDY-014 dari Rina Putri menunggu diterima.", waktu: waktuWIB(sekarang, 1, 9, 10), dibaca: true },
    { id: "n6", judul: "Pesanan baru masuk", isi: "LDY-012 dari Maya Lestari menunggu diterima.", waktu: waktuWIB(sekarang, 3, 9, 10), dibaca: true },
  ];
}
