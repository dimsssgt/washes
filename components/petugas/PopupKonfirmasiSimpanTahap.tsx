"use client";

import Popup from "./Popup";
import { LABEL_TAHAP, type PesananKerja, type Tahap } from "@/lib/petugas/pengerjaan";

interface Props {
  pesanan: PesananKerja;
  tujuan: Tahap;
  onYa: () => void;
  onKembali: () => void;
}

export default function PopupKonfirmasiSimpanTahap({ pesanan, tujuan, onYa, onKembali }: Props) {
  return (
    <Popup judul="Simpan tahap?" lebar={380} kecil tampilTutup={false} onTutup={onKembali}>
      <p style={{ margin: "12px 0 0" }}>
        Tahap pengerjaan akan berubah. Pelanggan akan melihat perubahan ini di status pesanan.
      </p>
      <div style={{ marginTop: 14 }}>
        <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
        <div className="pt-baris"><span>Dari</span><b>{LABEL_TAHAP[pesanan.tahap]}</b></div>
        <div className="pt-baris"><span>Menjadi</span><b>{LABEL_TAHAP[tujuan]}</b></div>
      </div>
      <div className="pt-aksi tumpuk">
        <button type="button" className="btn" onClick={onYa}>Ya, simpan</button>
        <button type="button" className="btn y" onClick={onKembali}>Kembali</button>
      </div>
    </Popup>
  );
}
