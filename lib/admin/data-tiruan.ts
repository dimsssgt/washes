import type { Harga, Layanan, Pengguna, Transaksi } from "./types";

// Data tiruan untuk membangun tampilan tanpa menunggu database.
// TODO: ganti dengan pembacaan dari Supabase (server component bisa langsung query).

export const layananAwal: Layanan[] = [
  { id: "L1", nama: "Cuci Kiloan", deskripsi: "Cuci, kering, lipat", aktif: true },
  { id: "L2", nama: "Cuci Satuan", deskripsi: "Per item", aktif: true },
  { id: "L3", nama: "Cuci Linen", deskripsi: "Sprei, bed cover, selimut", aktif: true },
  { id: "L4", nama: "Self Service", deskripsi: "Cuci mandiri di outlet", aktif: true },
];

export const hargaAwal: Harga[] = [
  { id: "H1", layanan: "Cuci Kiloan", satuan: "per kg", reguler: 5000, oneDay: 7000, express: 10000, quick: 14000 },
  { id: "H2", layanan: "Cuci Satuan", satuan: "per item", reguler: 12000, oneDay: null, express: 18000, quick: null },
  { id: "H3", layanan: "Cuci Linen", satuan: "per pcs", reguler: 20000, oneDay: null, express: 28000, quick: null },
  { id: "H4", layanan: "Self Service", satuan: "per mesin", reguler: 10000, oneDay: null, express: null, quick: null },
];

export const penggunaAwal: Pengguna[] = [
  { id: "U1", nama: "Admin Laundyku", email: "admin@laundyku.id", peran: "Admin", aktif: true },
  { id: "U2", nama: "Petugas Satu", email: "petugas1@laundyku.id", peran: "Petugas", aktif: true },
  { id: "U3", nama: "Budi Santoso", email: "budi@email.com", peran: "Pelanggan", aktif: true },
  { id: "U4", nama: "Siti Aminah", email: "siti@email.com", peran: "Pelanggan", aktif: false },
];

export const transaksiTiruan: Transaksi[] = [
  { kode: "LDY-014", pelanggan: "Budi Santoso", kategori: "Cuci Kiloan", total: 29000, pembayaran: "QRIS", selesai: "2026-10-28T17:40" },
  { kode: "LDY-013", pelanggan: "Siti Aminah", kategori: "Cuci Linen", total: 40000, pembayaran: "Tunai", selesai: "2026-10-28T15:10" },
  { kode: "LDY-012", pelanggan: "Andi Wijaya", kategori: "Cuci Kiloan", total: 53000, pembayaran: "QRIS", selesai: "2026-10-27T11:25" },
  { kode: "LDY-011", pelanggan: "Rina Lestari", kategori: "Cuci Satuan", total: 60000, pembayaran: "Tunai", selesai: "2026-10-27T09:40" },
  { kode: "LDY-010", pelanggan: "Dewi Anggraini", kategori: "Self Service", total: 10000, pembayaran: "QRIS", selesai: "2026-10-26T14:05" },
  { kode: "LDY-009", pelanggan: "Hendra Pratama", kategori: "Cuci Kiloan", total: 35000, pembayaran: "Tunai", selesai: "2026-10-24T10:15" },
  { kode: "LDY-008", pelanggan: "Nur Hidayah", kategori: "Cuci Satuan", total: 48000, pembayaran: "QRIS", selesai: "2026-10-22T16:30" },
  { kode: "LDY-007", pelanggan: "Budi Santoso", kategori: "Cuci Kiloan", total: 41000, pembayaran: "QRIS", selesai: "2026-10-20T13:00" },
  { kode: "LDY-006", pelanggan: "Siti Aminah", kategori: "Cuci Linen", total: 60000, pembayaran: "Tunai", selesai: "2026-09-18T09:20" },
  { kode: "LDY-005", pelanggan: "Andi Wijaya", kategori: "Self Service", total: 10000, pembayaran: "QRIS", selesai: "2026-08-02T12:00" },
  { kode: "LDY-004", pelanggan: "Rina Lestari", kategori: "Cuci Kiloan", total: 53000, pembayaran: "Tunai", selesai: "2025-12-30T18:45" },
  { kode: "LDY-015", pelanggan: "Fitri Handayani", kategori: "Cuci Satuan", total: 36000, pembayaran: "QRIS", selesai: "2026-10-25T10:30" },
  { kode: "LDY-016", pelanggan: "Andi Wijaya", kategori: "Cuci Linen", total: 80000, pembayaran: "Tunai", selesai: "2026-10-25T16:20" },
  { kode: "LDY-017", pelanggan: "Rina Lestari", kategori: "Cuci Kiloan", total: 45000, pembayaran: "QRIS", selesai: "2026-10-23T08:50" },
  { kode: "LDY-018", pelanggan: "Yudi Prasetyo", kategori: "Self Service", total: 20000, pembayaran: "Tunai", selesai: "2026-10-21T19:10" },
  { kode: "LDY-019", pelanggan: "Dewi Anggraini", kategori: "Cuci Kiloan", total: 27000, pembayaran: "QRIS", selesai: "2026-10-19T12:40" },
  { kode: "LDY-020", pelanggan: "Fitri Handayani", kategori: "Cuci Linen", total: 60000, pembayaran: "Tunai", selesai: "2026-10-17T15:05" },
  { kode: "LDY-001", pelanggan: "Hendra Pratama", kategori: "Cuci Kiloan", total: 33000, pembayaran: "QRIS", selesai: "2026-07-14T11:00" },
  { kode: "LDY-002", pelanggan: "Nur Hidayah", kategori: "Cuci Satuan", total: 24000, pembayaran: "Tunai", selesai: "2026-07-30T14:25" },
  { kode: "LDY-003", pelanggan: "Yudi Prasetyo", kategori: "Cuci Kiloan", total: 42000, pembayaran: "QRIS", selesai: "2026-08-09T09:45" },
];
