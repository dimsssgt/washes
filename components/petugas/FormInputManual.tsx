"use client";

import { useState, type FormEvent } from "react";
import { DAFTAR_WAKTU_CUCI } from "@/lib/petugas/data-tiruan";
import type { JenisLayanan, WaktuCuci } from "@/lib/petugas/types";

export interface DataInputManual {
  nama: string;
  noWa: string;
  layanan: JenisLayanan;
  waktuCuci: WaktuCuci;
}

interface Props {
  onSimpan: (data: DataInputManual) => void;
}

export default function FormInputManual({ onSimpan }: Props) {
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [layanan, setLayanan] = useState<JenisLayanan>("Kiloan");
  const [waktuCuci, setWaktuCuci] = useState<WaktuCuci>("Reguler 3 hari");
  const [galat, setGalat] = useState<{ nama?: string; noWa?: string }>({});
  const [sukses, setSukses] = useState("");

  function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const g: { nama?: string; noWa?: string } = {};
    if (nama.trim() === "") g.nama = "Nama pelanggan wajib diisi.";
    if (!/^[0-9+\-\s]{9,16}$/.test(noWa.trim())) g.noWa = "Nomor WA tidak valid (9–16 angka).";
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setSukses("");
      return;
    }
    onSimpan({ nama: nama.trim(), noWa: noWa.trim(), layanan, waktuCuci });
    setSukses(`Pesanan atas nama ${nama.trim()} berhasil ditambahkan ke daftar.`);
    setNama("");
    setNoWa("");
  }

  return (
    <section id="input-manual" className="pt-kartu">
      <h2 className="pt-d">Input manual</h2>
      <p className="pt-hint">Dipakai petugas untuk mencatat pesanan yang masuk tanpa aplikasi.</p>

      <form onSubmit={kirim} noValidate>
        <label htmlFor="im-nama">Nama pelanggan</label>
        <input
          id="im-nama"
          type="text"
          placeholder="Nama lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          aria-invalid={galat.nama ? true : undefined}
          aria-describedby={galat.nama ? "im-nama-galat" : undefined}
        />
        {galat.nama && <p id="im-nama-galat" role="alert" className="pt-galat">{galat.nama}</p>}

        <label htmlFor="im-wa">No. WA</label>
        <input
          id="im-wa"
          type="text"
          inputMode="tel"
          placeholder="08xx-xxxx-xxxx"
          value={noWa}
          onChange={(e) => setNoWa(e.target.value)}
          aria-invalid={galat.noWa ? true : undefined}
          aria-describedby={galat.noWa ? "im-wa-galat" : undefined}
        />
        {galat.noWa && <p id="im-wa-galat" role="alert" className="pt-galat">{galat.noWa}</p>}

        <label htmlFor="im-layanan">Jenis layanan</label>
        <select id="im-layanan" value={layanan} onChange={(e) => setLayanan(e.target.value as JenisLayanan)}>
          <option value="Kiloan">Cuci Kiloan</option>
          <option value="Satuan">Satuan</option>
          <option value="Linen">Linen</option>
        </select>

        <label htmlFor="im-waktu">Waktu cuci</label>
        <select id="im-waktu" value={waktuCuci} onChange={(e) => setWaktuCuci(e.target.value as WaktuCuci)}>
          {DAFTAR_WAKTU_CUCI.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        <div style={{ marginTop: 20 }}>
          <button type="submit" className="btn y">Simpan pesanan</button>
        </div>
      </form>

      <div aria-live="polite">{sukses && <p className="pt-sukses">{sukses}</p>}</div>
    </section>
  );
}
