"use client";

import Popup from "./Popup";
import { formatRupiah, ringkasBeratJumlah } from "@/lib/petugas/hitung";
import type { HasilPenimbangan, PesananMasuk } from "@/lib/petugas/types";

interface Props {
  pesanan: PesananMasuk;
  hasil: HasilPenimbangan;
  onYa: () => void;
  onKembali: () => void;
}

export default function PopupKonfirmasiTerima({ pesanan, hasil, onYa, onKembali }: Props) {
  return (
    <Popup judul="Terima pesanan?" lebar={380} kecil tampilTutup={false} onTutup={onKembali}>
      <p style={{ margin: "12px 0 0" }}>
        Pesanan akan masuk ke tahap diterima setelah berat dan harga disimpan.
      </p>
      <div style={{ marginTop: 14 }}>
        <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
        <div className="pt-baris"><span>Berat / jumlah</span><b>{ringkasBeratJumlah(pesanan.layanan, hasil)}</b></div>
        <div className="pt-baris"><span>Total</span><b>{formatRupiah(hasil.subtotal)}</b></div>
      </div>
      <div className="pt-aksi tumpuk">
        <button type="button" className="btn" onClick={onYa}>Ya, terima</button>
        <button type="button" className="btn y" onClick={onKembali}>Kembali</button>
      </div>
    </Popup>
  );
}
