import type { PesananKerja } from "./pengerjaan";

// Data tiruan dari contoh di desain. TODO: ganti dengan data dari Supabase
// (pesanan dengan status diterima/diproses/siap_diambil).
export const pesananKerjaTiruan: PesananKerja[] = [
  { kode: "LDY-014", pelanggan: "Rina Putri", layanan: "Kiloan", beratJumlah: "4 kg", tahap: "ditimbang", metodeSerah: "Diantar", total: 40000, lunas: false, metodeBayar: null, penerima: null },
  { kode: "LDY-013", pelanggan: "Dedi Kurniawan", layanan: "Linen", beratJumlah: "2 pcs", tahap: "dicuci", metodeSerah: "Ambil sendiri", total: 40000, lunas: true, metodeBayar: "QRIS", penerima: null },
  { kode: "LDY-012", pelanggan: "Maya Lestari", layanan: "Kiloan", beratJumlah: "6 kg", tahap: "disetrika", metodeSerah: "Diantar", total: 30000, lunas: false, metodeBayar: null, penerima: null },
  { kode: "LDY-011", pelanggan: "Fajar Nugroho", layanan: "Satuan", beratJumlah: "5 pcs", tahap: "dicuci", metodeSerah: "Ambil sendiri", total: 75000, lunas: false, metodeBayar: null, penerima: null },
  { kode: "LDY-010", pelanggan: "Lina Marlina", layanan: "Kiloan", beratJumlah: "4 kg", tahap: "siap", metodeSerah: "Diantar", total: 28000, lunas: true, metodeBayar: "QRIS", penerima: null },
  { kode: "LDY-009", pelanggan: "Hendra Saputra", layanan: "Kiloan", beratJumlah: "6 kg", tahap: "siap", metodeSerah: "Ambil sendiri", total: 36000, lunas: false, metodeBayar: null, penerima: null },
  { kode: "LDY-008", pelanggan: "Sari Wulandari", layanan: "Linen", beratJumlah: "1 pcs", tahap: "siap", metodeSerah: "Diantar", total: 20000, lunas: true, metodeBayar: "Tunai", penerima: null },
];
