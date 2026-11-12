"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  hitungBelumDibaca,
  tandaiDibaca,
  tandaiSemuaDibaca,
  urutkanTerbaru,
  type NotifikasiPetugas,
} from "@/lib/petugas/notifikasi";

interface NilaiNotifikasi {
  /** Sudah diurutkan dari yang terbaru. */
  daftar: NotifikasiPetugas[];
  /** Acuan "sekarang" dari server, supaya teks waktu sama di server dan browser. */
  sekarang: Date;
  belumDibaca: number;
  tandaiDibaca: (id: string) => void;
  tandaiSemuaDibaca: () => void;
}

const Konteks = createContext<NilaiNotifikasi | null>(null);

/**
 * Satu sumber data notifikasi untuk seluruh halaman petugas, jadi tanda "sudah dibaca"
 * di pop-up dan di halaman Notifikasi selalu sama.
 */
export function NotifikasiProvider({
  awal,
  sekarangIso,
  children,
}: {
  awal: NotifikasiPetugas[];
  sekarangIso: string;
  children: ReactNode;
}) {
  const [daftar, setDaftar] = useState<NotifikasiPetugas[]>(awal);

  const nilai = useMemo<NilaiNotifikasi>(
    () => ({
      daftar: urutkanTerbaru(daftar),
      sekarang: new Date(sekarangIso),
      belumDibaca: hitungBelumDibaca(daftar),
      // TODO (Supabase): simpan status dibaca ke database, bukan hanya di state.
      tandaiDibaca: (id) => setDaftar((d) => tandaiDibaca(d, id)),
      tandaiSemuaDibaca: () => setDaftar((d) => tandaiSemuaDibaca(d)),
    }),
    [daftar, sekarangIso],
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useNotifikasi(): NilaiNotifikasi {
  const nilai = useContext(Konteks);
  if (!nilai) throw new Error("useNotifikasi harus dipakai di dalam NotifikasiProvider.");
  return nilai;
}
