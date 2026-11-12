"use client";

import { useState } from "react";
import Popup from "./Popup";
import { formatRupiah } from "@/lib/petugas/hitung";
import { bolehDiserahkan, type MetodeBayar, type PesananKerja } from "@/lib/petugas/pengerjaan";

export interface DataPenyerahan {
  metodeBayar: MetodeBayar | null;
  penerima: string;
}

interface Props {
  pesanan: PesananKerja;
  onBatal: () => void;
  onSerahkan: (data: DataPenyerahan) => void;
}

export default function PopupKonfirmasiPenyerahan({ pesanan, onBatal, onSerahkan }: Props) {
  const [metode, setMetode] = useState<MetodeBayar>("Tunai");
  const [penerima, setPenerima] = useState("");
  const [galat, setGalat] = useState("");

  function kirim() {
    if (!bolehDiserahkan(pesanan)) {
      setGalat("Pesanan belum siap diantar/diambil.");
      return;
    }
    if (penerima.trim() === "") {
      setGalat("Nama penerima wajib diisi.");
      return;
    }
    onSerahkan({
      metodeBayar: pesanan.lunas ? pesanan.metodeBayar : metode,
      penerima: penerima.trim(),
    });
  }

  return (
    <Popup judul="Konfirmasi penyerahan" lebar={420} kecil onTutup={onBatal}>
      <div style={{ marginTop: 12 }}>
        <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
        <div className="pt-baris"><span>Pelanggan</span><b>{pesanan.pelanggan}</b></div>
        <div className="pt-baris"><span>Metode</span><b>{pesanan.metodeSerah}</b></div>
        <div className="pt-baris"><span>Total</span><b>{formatRupiah(pesanan.total)}</b></div>
      </div>

      {pesanan.lunas ? (
        <p className="pt-hint" style={{ marginTop: 14 }}>Pembayaran sudah lunas.</p>
      ) : (
        <>
          <div className="pt-peringatan">
            Pembayaran belum lunas. Terima pembayaran sebelum menyerahkan cucian.
          </div>
          <label htmlFor="kp-bayar">Pembayaran diterima via</label>
          <select id="kp-bayar" value={metode} onChange={(e) => setMetode(e.target.value as MetodeBayar)}>
            <option value="Tunai">Tunai</option>
            <option value="QRIS">QRIS</option>
          </select>
        </>
      )}

      <label htmlFor="kp-penerima">Nama penerima</label>
      <input
        id="kp-penerima"
        type="text"
        placeholder="Nama penerima"
        value={penerima}
        onChange={(e) => {
          setPenerima(e.target.value);
          setGalat("");
        }}
        aria-invalid={galat ? true : undefined}
      />
      {galat && <p role="alert" className="pt-galat">{galat}</p>}

      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
        <button type="button" className="btn" onClick={kirim}>Serahkan</button>
      </div>
    </Popup>
  );
}
