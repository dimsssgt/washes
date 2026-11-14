import type { RiwayatPenyerahan } from "./riwayat";

// Data tiruan. TODO: ganti dengan pesanan berstatus "selesai" dari Supabase
// (gabungan tabel pesanan, pembayaran, dan data penyerahan).
export const riwayatTiruan: RiwayatPenyerahan[] = [
  { kode: "LDY-0B1", diserahkan: "2026-10-26", pelanggan: "Sari Wulandari", layanan: "Kiloan", total: 29000, metodeSerah: "Diantar", metodeBayar: "QRIS" },
  { kode: "LDY-007", diserahkan: "2026-10-26", pelanggan: "Hendra Saputra", layanan: "Linen", total: 40000, metodeSerah: "Ambil sendiri", metodeBayar: "Tunai" },
  { kode: "LDY-006", diserahkan: "2026-10-25", pelanggan: "Lina Marlina", layanan: "Satuan", total: 60000, metodeSerah: "Diantar", metodeBayar: "QRIS" },
  { kode: "LDY-005", diserahkan: "2026-10-24", pelanggan: "Fajar Nugroho", layanan: "Kiloan", total: 53000, metodeSerah: "Ambil sendiri", metodeBayar: "Tunai" },
  { kode: "LDY-004", diserahkan: "2026-10-23", pelanggan: "Maya Lestari", layanan: "Kiloan", total: 35000, metodeSerah: "Diantar", metodeBayar: "QRIS" },
  { kode: "LDY-003", diserahkan: "2026-10-22", pelanggan: "Dedi Kurniawan", layanan: "Satuan", total: 45000, metodeSerah: "Ambil sendiri", metodeBayar: "Tunai" },
  { kode: "LDY-002", diserahkan: "2026-10-21", pelanggan: "Rina Putri", layanan: "Linen", total: 20000, metodeSerah: "Diantar", metodeBayar: "QRIS" },
  { kode: "LDY-001", diserahkan: "2026-10-20", pelanggan: "Budi Santoso", layanan: "Kiloan", total: 25000, metodeSerah: "Ambil sendiri", metodeBayar: "Tunai" },
  { kode: "LDY-0A9", diserahkan: "2026-10-19", pelanggan: "Siti Aminah", layanan: "Kiloan", total: 30000, metodeSerah: "Diantar", metodeBayar: "Tunai" },
  { kode: "LDY-0A8", diserahkan: "2026-10-18", pelanggan: "Andi Wijaya", layanan: "Linen", total: 40000, metodeSerah: "Diantar", metodeBayar: "QRIS" },
  { kode: "LDY-0A7", diserahkan: "2026-10-17", pelanggan: "Rina Putri", layanan: "Satuan", total: 30000, metodeSerah: "Ambil sendiri", metodeBayar: "QRIS" },
  { kode: "LDY-0A6", diserahkan: "2026-10-16", pelanggan: "Dedi Kurniawan", layanan: "Kiloan", total: 42000, metodeSerah: "Diantar", metodeBayar: "Tunai" },
];
