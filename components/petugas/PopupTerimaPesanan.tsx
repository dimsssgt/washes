"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Popup from "./Popup";
import {
  formatRupiah,
  hitungSubtotal,
  validasiPenimbangan,
  type DrafPenimbangan,
  type GalatPenimbangan,
} from "@/lib/petugas/hitung";
import type { HasilPenimbangan, PesananMasuk } from "@/lib/petugas/types";

interface Props {
  pesanan: PesananMasuk;
  draf: DrafPenimbangan;
  setDraf: Dispatch<SetStateAction<DrafPenimbangan>>;
  onBatal: () => void;
  onLanjut: (hasil: HasilPenimbangan) => void;
}

export default function PopupTerimaPesanan({ pesanan, draf, setDraf, onBatal, onLanjut }: Props) {
  const [galat, setGalat] = useState<GalatPenimbangan>({});
  const kiloan = pesanan.layanan === "Kiloan";
  const subtotal = hitungSubtotal(pesanan.layanan, draf);

  function ubah(kolom: keyof DrafPenimbangan, nilai: string) {
    setDraf((d) => ({ ...d, [kolom]: nilai }));
  }

  function simpan() {
    const { galat: g, hasil } = validasiPenimbangan(pesanan.layanan, draf);
    setGalat(g);
    if (hasil) onLanjut(hasil);
  }

  return (
    <Popup
      judul="Terima pesanan"
      subjudul={`${pesanan.kode} · ${pesanan.layanan} · ${pesanan.waktuCuci}`}
      onTutup={onBatal}
    >
      <div className="pt-dua">
        <section className="pt-panel krem">
          <div className="pt-d pt-sub">Detail pesanan</div>
          <div className="pt-baris"><span>Kode</span><b>{pesanan.kode}</b></div>
          <div className="pt-baris"><span>Pelanggan</span><b>{pesanan.pelanggan}</b></div>
          <div className="pt-baris"><span>No. WA</span><b>{pesanan.noWa}</b></div>
          <div className="pt-baris"><span>Alamat jemput</span><b>{pesanan.alamatJemput}</b></div>
          <div className="pt-baris"><span>Layanan</span><b>{pesanan.layanan}</b></div>
          <div className="pt-baris"><span>Waktu cuci</span><b>{pesanan.waktuCuci}</b></div>
          <div className="pt-baris"><span>Jam jemput</span><b>{pesanan.jamJemput}</b></div>
          <div style={{ fontSize: 12, marginTop: 12 }}>
            Catatan pelanggan: {pesanan.catatan || "—"}
          </div>
        </section>

        <section className="pt-panel">
          <div className="pt-d pt-sub">Form penimbangan &amp; harga</div>

          {kiloan && (
            <>
              <label htmlFor="pt-berat">Berat (kg)</label>
              <input
                id="pt-berat"
                type="text"
                inputMode="decimal"
                value={draf.berat}
                onChange={(e) => ubah("berat", e.target.value)}
                aria-invalid={galat.berat ? true : undefined}
                aria-describedby={galat.berat ? "pt-berat-galat" : undefined}
              />
              {galat.berat && <p id="pt-berat-galat" role="alert" className="pt-galat">{galat.berat}</p>}
            </>
          )}

          <label htmlFor="pt-jumlah">Jumlah item (pcs){kiloan ? " — opsional" : ""}</label>
          <input
            id="pt-jumlah"
            type="text"
            inputMode="numeric"
            value={draf.jumlah}
            onChange={(e) => ubah("jumlah", e.target.value)}
            aria-invalid={galat.jumlah ? true : undefined}
            aria-describedby={galat.jumlah ? "pt-jumlah-galat" : undefined}
          />
          {galat.jumlah && <p id="pt-jumlah-galat" role="alert" className="pt-galat">{galat.jumlah}</p>}

          <label htmlFor="pt-harga">Harga per {kiloan ? "kg" : "item"} (Rp)</label>
          <input
            id="pt-harga"
            type="text"
            inputMode="numeric"
            value={draf.harga}
            onChange={(e) => ubah("harga", e.target.value)}
            aria-invalid={galat.harga ? true : undefined}
            aria-describedby={galat.harga ? "pt-harga-galat" : undefined}
          />
          {galat.harga && <p id="pt-harga-galat" role="alert" className="pt-galat">{galat.harga}</p>}

          <label htmlFor="pt-subtotal">Subtotal (otomatis)</label>
          <input id="pt-subtotal" type="text" value={formatRupiah(subtotal)} readOnly />

          <label htmlFor="pt-catatan">Catatan kondisi</label>
          <textarea
            id="pt-catatan"
            rows={2}
            placeholder="Cth: noda di kerah"
            value={draf.catatan}
            onChange={(e) => ubah("catatan", e.target.value)}
          />
        </section>
      </div>

      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
        <button type="button" className="btn" onClick={simpan}>Simpan &amp; terima</button>
      </div>
    </Popup>
  );
}
