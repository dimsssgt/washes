import type { Bagian, Jejak, PesananAlur, Verifikasi } from "./alur";
import type { Tahap } from "./pengerjaan";

// Data tiruan. TODO: ganti dengan tabel pesanan dan jejak di Supabase.

/** Nama contoh untuk tiap bagian. TODO: ambil dari sesi login (kolom bagian di profil). */
export const NAMA_DEMO: Record<Bagian, string> = {
  front_office: "Rani",
  pencuci: "Joko",
  penyetrika: "Wati",
};

export function buatKerjaTiruan(sekarang: Date): PesananAlur[] {
  const t = (menit: number) => new Date(sekarang.getTime() - menit * 60_000).toISOString();
  let n = 0;
  const id = () => `j-awal-${++n}`;

  const terima = (jumlah: number, menit: number): Jejak => ({
    id: id(), jenis: "penerimaan", bagian: "front_office", petugas: NAMA_DEMO.front_office,
    waktu: t(menit), ke: "ditimbang", jumlahTercatat: jumlah, jumlahDihitung: jumlah,
    sesuai: true, catatan: "", verifikasi: null,
  });
  const serah = (
    bagian: Bagian, ke: Tahap, tercatat: number, dihitung: number, menit: number,
    catatan = "", verifikasi: Verifikasi | null = null,
  ): Jejak => ({
    id: id(), jenis: "serah_terima", bagian, petugas: NAMA_DEMO[bagian], waktu: t(menit), ke,
    jumlahTercatat: tercatat, jumlahDihitung: dihitung, sesuai: tercatat === dihitung, catatan, verifikasi,
  });

  const dasar = {
    penerima: null, diserahkanPada: null, metodeBayar: null, lunas: false,
  } as const;

  return [
    { ...dasar, kode: "LDY-014", pelanggan: "Rina Putri", layanan: "Kiloan", beratJumlah: "4 kg · 12 pcs", tahap: "ditimbang", metodeSerah: "Diantar", total: 40000, jumlahAcuan: 12, jejak: [terima(12, 50)] },
    { ...dasar, kode: "LDY-013", pelanggan: "Dedi Kurniawan", layanan: "Linen", beratJumlah: "2 pcs", tahap: "dicuci", metodeSerah: "Ambil sendiri", total: 40000, lunas: true, metodeBayar: "QRIS", jumlahAcuan: 2, jejak: [terima(2, 300), serah("pencuci", "dicuci", 2, 2, 280)] },
    { ...dasar, kode: "LDY-012", pelanggan: "Maya Lestari", layanan: "Kiloan", beratJumlah: "6 kg · 18 pcs", tahap: "disetrika", metodeSerah: "Diantar", total: 30000, jumlahAcuan: 18, jejak: [terima(18, 600), serah("pencuci", "dicuci", 18, 18, 580), serah("penyetrika", "disetrika", 18, 18, 200)] },
    {
      ...dasar, kode: "LDY-011", pelanggan: "Fajar Nugroho", layanan: "Satuan", beratJumlah: "5 pcs", tahap: "dicuci", metodeSerah: "Ambil sendiri", total: 75000, jumlahAcuan: 5,
      jejak: [terima(5, 500), serah("pencuci", "dicuci", 5, 4, 90, "1 kaos tidak ditemukan saat pencucian dimulai.")],
    },
    { ...dasar, kode: "LDY-010", pelanggan: "Lina Marlina", layanan: "Kiloan", beratJumlah: "4 kg · 10 pcs", tahap: "siap", metodeSerah: "Diantar", total: 28000, lunas: true, metodeBayar: "QRIS", jumlahAcuan: 10, jejak: [terima(10, 2000), serah("pencuci", "dicuci", 10, 10, 1900), serah("penyetrika", "disetrika", 10, 10, 1500), serah("front_office", "siap", 10, 10, 1000)] },
    {
      ...dasar, kode: "LDY-009", pelanggan: "Hendra Saputra", layanan: "Kiloan", beratJumlah: "6 kg · 14 pcs", tahap: "siap", metodeSerah: "Ambil sendiri", total: 36000, jumlahAcuan: 14,
      jejak: [
        terima(14, 2500),
        serah("pencuci", "dicuci", 14, 14, 2400),
        serah("penyetrika", "disetrika", 14, 13, 1900, "Kaus kaki kurang sepasang.", {
          petugas: NAMA_DEMO.front_office, waktu: t(1850), catatan: "Ditemukan di mesin cuci, sudah dimasukkan ke keranjang.", jumlahAcuanBaru: 14,
        }),
        serah("front_office", "siap", 14, 14, 1200),
      ],
    },
    { ...dasar, kode: "LDY-008", pelanggan: "Sari Wulandari", layanan: "Linen", beratJumlah: "1 pcs", tahap: "siap", metodeSerah: "Diantar", total: 20000, lunas: true, metodeBayar: "Tunai", jumlahAcuan: 1, jejak: [terima(1, 3000), serah("pencuci", "dicuci", 1, 1, 2900), serah("penyetrika", "disetrika", 1, 1, 2500), serah("front_office", "siap", 1, 1, 2000)] },
  ];
}
