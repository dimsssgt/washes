"use client";

import { useState } from "react";
import Popup from "./Popup";
import { LABEL_BAGIAN, parseJumlah, type Jejak, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  pesanan: PesananAlur;
  jejak: Jejak;
  onBatal: () => void;
  /** Mengembalikan teks galat, atau null kalau berhasil. */
  onVerifikasi: (catatan: string, jumlahAcuanBaru: number) => string | null;
}

export default function PopupVerifikasiSelisih({ pesanan, jejak, onBatal, onVerifikasi }: Props) {
  const [catatan, setCatatan] = useState("");
  const [jumlah, setJumlah] = useState(String(jejak.jumlahDihitung));
  const [galat, setGalat] = useState("");

  function kirim() {
    const baru = parseJumlah(jumlah);
    if (!Number.isFinite(baru)) {
      setGalat("Jumlah acuan harus bilangan bulat, minimal 0.");
      return;
    }
    const hasil = onVerifikasi(catatan, baru);
    if (hasil) setGalat(hasil);
  }

  return (
    <Popup judul="Verifikasi selisih" subjudul={`${pesanan.kode} · ${pesanan.pelanggan}`} lebar={480} kecil onTutup={onBatal}>
      <div style={{ marginTop: 12 }}>
        <div className="pt-baris"><span>Dilaporkan oleh</span><b>{LABEL_BAGIAN[jejak.bagian]} ({jejak.petugas})</b></div>
        <div className="pt-baris"><span>Jumlah tercatat</span><b>{jejak.jumlahTercatat} pcs</b></div>
        <div className="pt-baris"><span>Jumlah dihitung</span><b>{jejak.jumlahDihitung} pcs</b></div>
        <div className="pt-baris"><span>Catatan petugas</span><b>{jejak.catatan}</b></div>
      </div>

      <p className="pt-hint" style={{ marginTop: 14 }}>
        Periksa cucian secara langsung, lalu tentukan jumlah yang berlaku. Pesanan baru bisa dilanjutkan setelah diverifikasi.
      </p>

      <label htmlFor="vs-jumlah">Jumlah acuan setelah verifikasi (pcs)</label>
      <input id="vs-jumlah" type="text" inputMode="numeric" value={jumlah} onChange={(e) => { setJumlah(e.target.value); setGalat(""); }} />

      <label htmlFor="vs-catatan">Catatan verifikasi (wajib)</label>
      <textarea
        id="vs-catatan"
        rows={3}
        placeholder="Cth: Sudah dicek ulang bersama, pelanggan konfirmasi 4 pcs."
        value={catatan}
        onChange={(e) => { setCatatan(e.target.value); setGalat(""); }}
      />

      {galat && <p role="alert" className="pt-galat">{galat}</p>}

      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
        <button type="button" className="btn" onClick={kirim}>Verifikasi</button>
      </div>
    </Popup>
  );
}
