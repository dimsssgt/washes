import { ringkasBeratJumlah } from "./hitung";
import { tahapBerikutnya, type MetodeBayar, type PesananKerja, type Tahap } from "./pengerjaan";
import type { RiwayatPenyerahan } from "./riwayat";
import type { HasilPenimbangan, PesananMasuk } from "./types";

/**
 * Alur anti-kehilangan:
 * setiap kali cucian pindah bagian, bagian PENERIMA menghitung ulang jumlah pakaian.
 * Kalau tidak sama dengan jumlah acuan, catatan wajib diisi dan pesanan ditahan
 * sampai Front Office memverifikasi.
 */

export type Bagian = "front_office" | "pencuci" | "penyetrika";

export const DAFTAR_BAGIAN: Bagian[] = ["front_office", "pencuci", "penyetrika"];

export const LABEL_BAGIAN: Record<Bagian, string> = {
  front_office: "Front Office",
  pencuci: "Pencuci",
  penyetrika: "Penyetrika",
};

/** Tahap sekarang menentukan bagian mana yang menerima pesanan berikutnya. */
export const PENERIMA_BERIKUTNYA: Partial<Record<Tahap, Bagian>> = {
  ditimbang: "pencuci",
  dicuci: "penyetrika",
  disetrika: "front_office",
};

/** Bagian yang menyerahkan pesanan pada tahap tersebut. */
export const PENYERAH_SAAT_INI: Partial<Record<Tahap, Bagian>> = {
  ditimbang: "front_office",
  dicuci: "pencuci",
  disetrika: "penyetrika",
};

export const LABEL_POSISI: Record<Tahap, string> = {
  ditimbang: "Front Office, menunggu Pencuci",
  dicuci: "Pencuci",
  disetrika: "Penyetrika",
  siap: "Front Office, siap diserahkan",
  selesai: "Sudah diserahkan",
};

export type JenisJejak = "penerimaan" | "serah_terima" | "penyerahan";

export interface Verifikasi {
  petugas: string;
  waktu: string;
  catatan: string;
  /** Jumlah acuan yang berlaku setelah Front Office memverifikasi. */
  jumlahAcuanBaru: number;
}

/** Satu catatan jejak: siapa yang menghitung, kapan, berapa, dan sesuai atau tidak. */
export interface Jejak {
  id: string;
  jenis: JenisJejak;
  bagian: Bagian;
  petugas: string;
  /** ISO UTC. */
  waktu: string;
  ke: Tahap;
  jumlahTercatat: number;
  jumlahDihitung: number;
  sesuai: boolean;
  catatan: string;
  verifikasi: Verifikasi | null;
}

export interface PesananAlur extends PesananKerja {
  jumlahAcuan: number;
  jejak: Jejak[];
  /** ISO UTC, terisi saat diserahkan. */
  diserahkanPada: string | null;
}

export type HasilAksi = { galat: string } | { pesanan: PesananAlur };

// ---------- Pemeriksaan ----------

export function selisihTerbuka(p: PesananAlur): Jejak[] {
  return p.jejak.filter((j) => !j.sesuai && j.verifikasi === null);
}

export const adaSelisihTerbuka = (p: PesananAlur) => selisihTerbuka(p).length > 0;

export function adaSelisihTerverifikasi(p: PesananAlur): boolean {
  return p.jejak.some((j) => !j.sesuai && j.verifikasi !== null);
}

export function bolehTerima(p: PesananAlur, bagian: Bagian): boolean {
  return PENERIMA_BERIKUTNYA[p.tahap] === bagian && !adaSelisihTerbuka(p);
}

export function bolehDiserahkan(p: PesananAlur): boolean {
  return p.tahap === "siap" && !adaSelisihTerbuka(p);
}

function bilanganBulat(n: number): boolean {
  return Number.isInteger(n) && n >= 0;
}

/** Ubah teks input menjadi bilangan bulat >= 0, atau NaN kalau tidak valid. */
export function parseJumlah(s: string): number {
  return /^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN;
}

// ---------- Aksi ----------

export function terimaDariPelanggan(
  masuk: PesananMasuk,
  h: HasilPenimbangan,
  d: { petugas: string; waktu: string; id: string },
): PesananAlur {
  return {
    kode: masuk.kode,
    pelanggan: masuk.pelanggan,
    layanan: masuk.layanan,
    beratJumlah: ringkasBeratJumlah(masuk.layanan, h),
    tahap: "ditimbang",
    metodeSerah: masuk.alamatJemput === "—" ? "Ambil sendiri" : "Diantar",
    total: h.subtotal,
    lunas: false,
    metodeBayar: null,
    penerima: null,
    jumlahAcuan: h.jumlahItem,
    diserahkanPada: null,
    jejak: [
      {
        id: d.id,
        jenis: "penerimaan",
        bagian: "front_office",
        petugas: d.petugas,
        waktu: d.waktu,
        ke: "ditimbang",
        jumlahTercatat: h.jumlahItem,
        jumlahDihitung: h.jumlahItem,
        sesuai: true,
        catatan: h.catatanKondisi,
        verifikasi: null,
      },
    ],
  };
}

export interface DataSerahTerima {
  petugas: string;
  bagian: Bagian;
  jumlahDihitung: number;
  catatan: string;
}

/** Bagian penerima menghitung ulang, lalu pesanan berpindah ke tahap berikutnya. */
export function serahTerima(p: PesananAlur, d: DataSerahTerima, waktu: string, id: string): HasilAksi {
  if (adaSelisihTerbuka(p)) return { galat: "Pesanan ini menunggu verifikasi Front Office." };
  if (PENERIMA_BERIKUTNYA[p.tahap] !== d.bagian) return { galat: "Pesanan ini bukan giliran bagian Anda." };
  if (!bilanganBulat(d.jumlahDihitung)) return { galat: "Jumlah yang dihitung harus bilangan bulat, minimal 0." };

  const ke = tahapBerikutnya(p.tahap);
  if (!ke) return { galat: "Tidak ada tahap berikutnya." };

  const sesuai = d.jumlahDihitung === p.jumlahAcuan;
  const catatan = d.catatan.trim();
  if (!sesuai && catatan === "") return { galat: "Jumlah tidak sama dengan acuan. Isi catatan selisih." };

  const jejak: Jejak = {
    id,
    jenis: "serah_terima",
    bagian: d.bagian,
    petugas: d.petugas,
    waktu,
    ke,
    jumlahTercatat: p.jumlahAcuan,
    jumlahDihitung: d.jumlahDihitung,
    sesuai,
    catatan,
    verifikasi: null,
  };
  return { pesanan: { ...p, tahap: ke, jejak: [...p.jejak, jejak] } };
}

export interface DataVerifikasi {
  petugas: string;
  bagian: Bagian;
  catatan: string;
  jumlahAcuanBaru: number;
}

/** Front Office menutup satu selisih dan menetapkan jumlah acuan yang berlaku. */
export function verifikasiSelisih(p: PesananAlur, jejakId: string, d: DataVerifikasi, waktu: string): HasilAksi {
  if (d.bagian !== "front_office") return { galat: "Hanya Front Office yang boleh memverifikasi." };
  const sasaran = p.jejak.find((j) => j.id === jejakId);
  if (!sasaran || sasaran.sesuai || sasaran.verifikasi !== null) {
    return { galat: "Selisih ini tidak ditemukan atau sudah diverifikasi." };
  }
  const catatan = d.catatan.trim();
  if (catatan === "") return { galat: "Catatan verifikasi wajib diisi." };
  if (!bilanganBulat(d.jumlahAcuanBaru)) return { galat: "Jumlah acuan harus bilangan bulat, minimal 0." };

  const verifikasi: Verifikasi = { petugas: d.petugas, waktu, catatan, jumlahAcuanBaru: d.jumlahAcuanBaru };
  return {
    pesanan: {
      ...p,
      jumlahAcuan: d.jumlahAcuanBaru,
      jejak: p.jejak.map((j) => (j.id === jejakId ? { ...j, verifikasi } : j)),
    },
  };
}

export interface DataPenyerahan {
  petugas: string;
  bagian: Bagian;
  penerima: string;
  metodeBayar: MetodeBayar | null;
  jumlahDiserahkan: number;
  catatan: string;
}

/** Front Office menghitung terakhir kali, lalu menyerahkan cucian ke pelanggan. */
export function serahkanKePelanggan(p: PesananAlur, d: DataPenyerahan, waktu: string, id: string): HasilAksi {
  if (d.bagian !== "front_office") return { galat: "Hanya Front Office yang boleh menyerahkan cucian." };
  if (adaSelisihTerbuka(p)) return { galat: "Masih ada selisih yang belum diverifikasi." };
  if (!bolehDiserahkan(p)) return { galat: "Pesanan belum siap diantar/diambil." };
  if (d.penerima.trim() === "") return { galat: "Nama penerima wajib diisi." };
  if (!bilanganBulat(d.jumlahDiserahkan)) return { galat: "Jumlah diserahkan harus bilangan bulat, minimal 0." };
  if (!p.lunas && d.metodeBayar === null) return { galat: "Pilih metode pembayaran." };

  const sesuai = d.jumlahDiserahkan === p.jumlahAcuan;
  const catatan = d.catatan.trim();
  if (!sesuai && catatan === "") return { galat: "Jumlah tidak sama dengan acuan. Isi catatan selisih." };

  const jejak: Jejak = {
    id,
    jenis: "penyerahan",
    bagian: "front_office",
    petugas: d.petugas,
    waktu,
    ke: "selesai",
    jumlahTercatat: p.jumlahAcuan,
    jumlahDihitung: d.jumlahDiserahkan,
    sesuai,
    catatan,
    // Front Office sendiri yang menghitung di tahap ini, jadi selisihnya langsung tercatat dan tidak menahan apa pun.
    verifikasi: sesuai
      ? null
      : { petugas: d.petugas, waktu, catatan: "Dicatat langsung oleh Front Office saat penyerahan.", jumlahAcuanBaru: d.jumlahDiserahkan },
  };
  return {
    pesanan: {
      ...p,
      tahap: "selesai",
      lunas: true,
      metodeBayar: p.lunas ? p.metodeBayar : d.metodeBayar,
      penerima: d.penerima.trim(),
      diserahkanPada: waktu,
      jejak: [...p.jejak, jejak],
    },
  };
}

// ---------- Riwayat ----------

const FORMAT_TANGGAL_WIB = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-11-12T20:30:00Z" menjadi "2026-11-13" (tanggal menurut WIB). */
export function tanggalIsoWIB(iso: string): string {
  return FORMAT_TANGGAL_WIB.format(new Date(iso));
}

export function keRiwayat(p: PesananAlur): RiwayatPenyerahan | null {
  if (p.tahap !== "selesai" || !p.diserahkanPada || !p.metodeBayar) return null;
  return {
    kode: p.kode,
    diserahkan: tanggalIsoWIB(p.diserahkanPada),
    pelanggan: p.pelanggan,
    layanan: p.layanan,
    total: p.total,
    metodeSerah: p.metodeSerah,
    metodeBayar: p.metodeBayar,
  };
}
