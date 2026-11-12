"use client";

import { useState } from "react";
import Popup from "./Popup";
import {
  LABEL_TAHAP,
  URUTAN_TAHAP,
  bolehPindahTahap,
  type PesananKerja,
  type Tahap,
} from "@/lib/petugas/pengerjaan";

interface Props {
  pesanan: PesananKerja;
  tujuanAwal: Tahap;
  onBatal: () => void;
  onLanjut: (tujuan: Tahap) => void;
}

export default function PopupUpdateTahap({ pesanan, tujuanAwal, onBatal, onLanjut }: Props) {
  const [tujuan, setTujuan] = useState<Tahap>(tujuanAwal);
  const [galat, setGalat] = useState("");

  function simpan() {
    if (!bolehPindahTahap(pesanan.tahap, tujuan)) {
      setGalat("Tahap hanya boleh maju satu langkah.");
      return;
    }
    onLanjut(tujuan);
  }

  return (
    <Popup judul="Update tahap" lebar={360} kecil onTutup={onBatal}>
      <p style={{ margin: "14px 0 4px", fontWeight: 700 }}>
        {pesanan.kode} · {pesanan.pelanggan}
      </p>
      <p style={{ margin: "0 0 12px", fontSize: 13 }}>
        Tahap sekarang: <b>{LABEL_TAHAP[pesanan.tahap]}</b>
      </p>

      <label htmlFor="ut-tahap">Pindah ke tahap</label>
      <select
        id="ut-tahap"
        value={tujuan}
        onChange={(e) => {
          setTujuan(e.target.value as Tahap);
          setGalat("");
        }}
        aria-describedby="ut-hint"
      >
        {URUTAN_TAHAP.map((t) => (
          <option key={t} value={t} disabled={!bolehPindahTahap(pesanan.tahap, t)}>
            {LABEL_TAHAP[t]}
          </option>
        ))}
      </select>
      <p id="ut-hint" className="pt-hint" style={{ marginTop: 8 }}>
        Tahap hanya bisa maju satu langkah. Status Selesai diisi lewat penyerahan.
      </p>
      {galat && <p role="alert" className="pt-galat">{galat}</p>}

      <div className="pt-aksi tumpuk">
        <button type="button" className="btn" onClick={simpan}>Simpan tahap</button>
        <button type="button" className="btn y" onClick={onBatal}>Batal</button>
      </div>
    </Popup>
  );
}
