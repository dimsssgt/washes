"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DataInputManual } from "./FormInputManual";
import {
  keRiwayat,
  serahTerima,
  serahkanKePelanggan,
  terimaDariPelanggan,
  verifikasiSelisih,
  type Bagian,
  type PesananAlur,
} from "@/lib/petugas/alur";
import { NAMA_DEMO } from "@/lib/petugas/alur-tiruan";
import type { RiwayatPenyerahan } from "@/lib/petugas/riwayat";
import type { MetodeBayar } from "@/lib/petugas/pengerjaan";
import type { HasilPenimbangan, PesananMasuk } from "@/lib/petugas/types";

interface Nilai {
  pengguna: { nama: string; bagian: Bagian };
  /** Hanya untuk demo. TODO: hapus setelah bagian diambil dari akun yang login. */
  gantiBagianDemo: (b: Bagian) => void;
  antrian: PesananMasuk[];
  kerja: PesananAlur[];
  riwayatBaru: RiwayatPenyerahan[];
  tambahManual: (data: DataInputManual) => void;
  terimaPesanan: (p: PesananMasuk, h: HasilPenimbangan) => void;
  /** Mengembalikan teks galat, atau null kalau berhasil. */
  hitungSerahTerima: (kode: string, jumlahDihitung: number, catatan: string) => string | null;
  verifikasi: (kode: string, jejakId: string, catatan: string, jumlahAcuanBaru: number) => string | null;
  serahkan: (
    kode: string,
    d: { penerima: string; metodeBayar: MetodeBayar | null; jumlahDiserahkan: number; catatan: string },
  ) => string | null;
}

const Konteks = createContext<Nilai | null>(null);

const idBaru = () => `j-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function nomorTerbesar(kode: string[]): number {
  return kode.reduce((maks, k) => {
    const m = /LDY-(\d+)/.exec(k);
    return m ? Math.max(maks, Number(m[1])) : maks;
  }, 0);
}

/**
 * Satu sumber data untuk seluruh halaman petugas (Dashboard, Pengerjaan, Riwayat),
 * jadi pesanan yang diterima di Dashboard langsung muncul di Pengerjaan.
 * Setiap fungsi di sini nantinya diganti dengan server action ke Supabase.
 */
export function PetugasProvider({
  antrianAwal,
  kerjaAwal,
  children,
}: {
  antrianAwal: PesananMasuk[];
  kerjaAwal: PesananAlur[];
  children: ReactNode;
}) {
  const [bagian, setBagian] = useState<Bagian>("front_office");
  const [antrian, setAntrian] = useState<PesananMasuk[]>(antrianAwal);
  const [kerja, setKerja] = useState<PesananAlur[]>(kerjaAwal);
  const [nomorTerakhir, setNomorTerakhir] = useState(() =>
    nomorTerbesar([...antrianAwal.map((p) => p.kode), ...kerjaAwal.map((p) => p.kode)]),
  );

  const pengguna = useMemo(() => ({ nama: NAMA_DEMO[bagian], bagian }), [bagian]);

  const tambahManual = useCallback(
    (data: DataInputManual) => {
      const nomor = nomorTerakhir + 1;
      setNomorTerakhir(nomor);
      // TODO (Supabase): simpan pesanan manual ke database.
      setAntrian((a) => [
        ...a,
        {
          kode: `LDY-${String(nomor).padStart(3, "0")}`,
          pelanggan: data.nama,
          noWa: data.noWa,
          alamatJemput: "—",
          layanan: data.layanan,
          waktuCuci: data.waktuCuci,
          jamJemput: "—",
          catatan: "Input manual petugas.",
        },
      ]);
    },
    [nomorTerakhir],
  );

  const terimaPesanan = useCallback(
    (p: PesananMasuk, h: HasilPenimbangan) => {
      // TODO (Supabase): simpan penimbangan dan jumlah acuan, status "diterima", dan jejak, dalam satu server action.
      const baru = terimaDariPelanggan(p, h, {
        petugas: pengguna.nama,
        waktu: new Date().toISOString(),
        id: idBaru(),
      });
      setAntrian((a) => a.filter((x) => x.kode !== p.kode));
      setKerja((k) => [...k, baru]);
    },
    [pengguna.nama],
  );

  function terapkan(kode: string, hitung: (p: PesananAlur) => ReturnType<typeof serahTerima>): string | null {
    const p = kerja.find((x) => x.kode === kode);
    if (!p) return "Pesanan tidak ditemukan.";
    const hasil = hitung(p);
    if ("galat" in hasil) return hasil.galat;
    setKerja((k) => k.map((x) => (x.kode === kode ? hasil.pesanan : x)));
    return null;
  }

  const nilai: Nilai = {
    pengguna,
    gantiBagianDemo: setBagian,
    antrian,
    kerja,
    riwayatBaru: kerja.map(keRiwayat).filter((r): r is RiwayatPenyerahan => r !== null),
    tambahManual,
    terimaPesanan,
    // TODO (Supabase): tiga fungsi berikut menjadi server action yang menulis jejak dan memperbarui status.
    hitungSerahTerima: (kode, jumlahDihitung, catatan) =>
      terapkan(kode, (p) =>
        serahTerima(p, { petugas: pengguna.nama, bagian: pengguna.bagian, jumlahDihitung, catatan }, new Date().toISOString(), idBaru()),
      ),
    verifikasi: (kode, jejakId, catatan, jumlahAcuanBaru) =>
      terapkan(kode, (p) =>
        verifikasiSelisih(p, jejakId, { petugas: pengguna.nama, bagian: pengguna.bagian, catatan, jumlahAcuanBaru }, new Date().toISOString()),
      ),
    serahkan: (kode, d) =>
      terapkan(kode, (p) =>
        serahkanKePelanggan(p, { petugas: pengguna.nama, bagian: pengguna.bagian, ...d }, new Date().toISOString(), idBaru()),
      ),
  };

  const nilaiStabil = useMemo(() => nilai, [nilai]);
  return <Konteks.Provider value={nilaiStabil}>{children}</Konteks.Provider>;
}

export function usePetugas(): Nilai {
  const nilai = useContext(Konteks);
  if (!nilai) throw new Error("usePetugas harus dipakai di dalam PetugasProvider.");
  return nilai;
}
