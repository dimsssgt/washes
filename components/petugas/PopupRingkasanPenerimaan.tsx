"use client";

import Popup from "./Popup";
import { formatRupiah, ringkasBeratJumlah } from "@/lib/petugas/hitung";
import type { HasilPenimbangan, PesananMasuk } from "@/lib/petugas/types";

interface Props {
  pesanan: PesananMasuk;
  hasil: HasilPenimbangan;
  onTutup: () => void;
}

export default function PopupRingkasanPenerimaan({ pesanan, hasil, onTutup }: Props) {
  return (
    <Popup judul="Ringkasan penerimaan" lebar={420} kecil kelas="pt-ringkasan" onTutup={onTutup}>
      <div style={{ marginTop: 12 }}>
        <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
        <div className="pt-baris"><span>Pelanggan</span><b>{pesanan.pelanggan}</b></div>
        <div className="pt-baris"><span>Layanan</span><b>{pesanan.layanan} · {pesanan.waktuCuci}</b></div>
        <div className="pt-baris"><span>Berat / jumlah</span><b>{ringkasBeratJumlah(pesanan.layanan, hasil)}</b></div>
        <div className="pt-baris"><span>Subtotal</span><b>{formatRupiah(hasil.subtotal)}</b></div>
        {hasil.catatanKondisi && (
          <div className="pt-baris"><span>Catatan kondisi</span><b>{hasil.catatanKondisi}</b></div>
        )}
      </div>
      <div className="pt-peringatan pt-noprint">Pesanan sudah diterima dan masuk ke tahap diterima.</div>
      <div className="pt-aksi pt-noprint">
        <button type="button" className="btn y" onClick={onTutup}>Tutup</button>
        <button type="button" className="btn" onClick={() => window.print()}>Cetak nota</button>
      </div>
    </Popup>
  );
}
