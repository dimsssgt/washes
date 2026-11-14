"use client";

import { useState } from "react";
import Popup from "./Popup";
import { LABEL_BAGIAN, PENYERAH_SAAT_INI, parseJumlah, type Bagian, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  pesanan: PesananAlur;
  bagian: Bagian;
  onBatal: () => void;
  /** Mengembalikan teks galat, atau null kalau berhasil. */
  onKonfirmasi: (jumlahDihitung: number, catatan: string) => string | null;
}

export default function PopupSerahTerima({ pesanan, bagian, onBatal, onKonfirmasi }: Props) {
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [galat, setGalat] = useState("");

  const dihitung = parseJumlah(jumlah);
  const terisi = Number.isFinite(dihitung);
  const sesuai = terisi && dihitung === pesanan.jumlahAcuan;
  const selisih = terisi ? dihitung - pesanan.jumlahAcuan : 0;
  const asal = PENYERAH_SAAT_INI[pesanan.tahap];

  function kirim() {
    if (!terisi) {
      setGalat("Isi jumlah pakaian yang Anda hitung (bilangan bulat).");
      return;
    }
    const hasil = onKonfirmasi(dihitung, catatan);
    if (hasil) setGalat(hasil);
  }

  return (
    <Popup judul={`Terima di ${LABEL_BAGIAN[bagian]}`} subjudul={`${pesanan.kode} · ${pesanan.pelanggan} · ${pesanan.layanan}`} lebar={460} kecil onTutup={onBatal}>
      <div style={{ marginTop: 12 }}>
        <div className="pt-baris"><span>Diterima dari</span><b>{asal ? LABEL_BAGIAN[asal] : "—"}</b></div>
        <div className="pt-baris"><span>Jumlah tercatat</span><b>{pesanan.jumlahAcuan} pcs</b></div>
      </div>

      <label htmlFor="st-jumlah">Jumlah yang Anda hitung (pcs)</label>
      <input
        id="st-jumlah"
        type="text"
        inputMode="numeric"
        placeholder="Hitung satu per satu, lalu isi"
        value={jumlah}
        onChange={(e) => {
          setJumlah(e.target.value);
          setGalat("");
        }}
        aria-describedby="st-banding"
      />

      <div id="st-banding" aria-live="polite">
        {terisi && sesuai && <div className="pt-banding ok">Jumlah sesuai dengan catatan.</div>}
        {terisi && !sesuai && (
          <div className="pt-banding selisih">
            Selisih {selisih > 0 ? "+" : ""}{selisih} pcs dari catatan. Tulis catatan di bawah; Front Office akan memverifikasi.
          </div>
        )}
      </div>

      {terisi && !sesuai && (
        <>
          <label htmlFor="st-catatan">Catatan selisih (wajib)</label>
          <textarea
            id="st-catatan"
            rows={3}
            placeholder="Cth: 1 kaos tidak ditemukan saat dihitung"
            value={catatan}
            onChange={(e) => {
              setCatatan(e.target.value);
              setGalat("");
            }}
          />
        </>
      )}

      {galat && <p role="alert" className="pt-galat">{galat}</p>}

      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
        <button type="button" className="btn" onClick={kirim}>Konfirmasi terima</button>
      </div>
    </Popup>
  );
}
