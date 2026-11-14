"use client";

import { useState } from "react";
import Popup from "./Popup";
import { parseJumlah, type PesananAlur } from "@/lib/petugas/alur";
import { formatRupiah } from "@/lib/petugas/hitung";
import type { MetodeBayar } from "@/lib/petugas/pengerjaan";

interface Props {
  pesanan: PesananAlur;
  onBatal: () => void;
  /** Mengembalikan teks galat, atau null kalau berhasil. */
  onSerahkan: (d: { penerima: string; metodeBayar: MetodeBayar | null; jumlahDiserahkan: number; catatan: string }) => string | null;
}

export default function PopupKonfirmasiPenyerahan({ pesanan, onBatal, onSerahkan }: Props) {
  const [metode, setMetode] = useState<MetodeBayar>("Tunai");
  const [penerima, setPenerima] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [galat, setGalat] = useState("");

  const dihitung = parseJumlah(jumlah);
  const terisi = Number.isFinite(dihitung);
  const sesuai = terisi && dihitung === pesanan.jumlahAcuan;

  function kirim() {
    if (!terisi) {
      setGalat("Isi jumlah pakaian yang diserahkan (bilangan bulat).");
      return;
    }
    const hasil = onSerahkan({
      penerima,
      metodeBayar: pesanan.lunas ? pesanan.metodeBayar : metode,
      jumlahDiserahkan: dihitung,
      catatan,
    });
    if (hasil) setGalat(hasil);
  }

  return (
    <Popup judul="Konfirmasi penyerahan" lebar={440} kecil onTutup={onBatal}>
      <div style={{ marginTop: 12 }}>
        <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
        <div className="pt-baris"><span>Pelanggan</span><b>{pesanan.pelanggan}</b></div>
        <div className="pt-baris"><span>Metode</span><b>{pesanan.metodeSerah}</b></div>
        <div className="pt-baris"><span>Total</span><b>{formatRupiah(pesanan.total)}</b></div>
        <div className="pt-baris"><span>Jumlah tercatat</span><b>{pesanan.jumlahAcuan} pcs</b></div>
      </div>

      <label htmlFor="kp-jumlah">Jumlah yang diserahkan (pcs)</label>
      <input
        id="kp-jumlah"
        type="text"
        inputMode="numeric"
        placeholder="Hitung bersama pelanggan"
        value={jumlah}
        onChange={(e) => { setJumlah(e.target.value); setGalat(""); }}
      />
      <div aria-live="polite">
        {terisi && sesuai && <div className="pt-banding ok">Jumlah sesuai dengan catatan.</div>}
        {terisi && !sesuai && <div className="pt-banding selisih">Jumlah tidak sama dengan catatan. Tulis catatan selisih.</div>}
      </div>
      {terisi && !sesuai && (
        <>
          <label htmlFor="kp-catatan">Catatan selisih (wajib)</label>
          <textarea id="kp-catatan" rows={2} value={catatan} onChange={(e) => { setCatatan(e.target.value); setGalat(""); }} />
        </>
      )}

      {pesanan.lunas ? (
        <p className="pt-hint" style={{ marginTop: 14 }}>Pembayaran sudah lunas.</p>
      ) : (
        <>
          <div className="pt-peringatan">Pembayaran belum lunas. Terima pembayaran sebelum menyerahkan cucian.</div>
          <label htmlFor="kp-bayar">Pembayaran diterima via</label>
          <select id="kp-bayar" value={metode} onChange={(e) => setMetode(e.target.value as MetodeBayar)}>
            <option value="Tunai">Tunai</option>
            <option value="QRIS">QRIS</option>
          </select>
        </>
      )}

      <label htmlFor="kp-penerima">Nama penerima</label>
      <input id="kp-penerima" type="text" placeholder="Nama penerima" value={penerima} onChange={(e) => { setPenerima(e.target.value); setGalat(""); }} />

      {galat && <p role="alert" className="pt-galat">{galat}</p>}

      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
        <button type="button" className="btn" onClick={kirim}>Serahkan</button>
      </div>
    </Popup>
  );
}
