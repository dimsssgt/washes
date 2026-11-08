"use client";

import { useState, type FormEvent } from "react";
import type { Harga, Layanan, PeranPengguna, Pengguna } from "@/lib/admin/types";

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function angka(s: string): number {
  return Number(s.replace(/\D/g, ""));
}

function Galat({ pesan }: { pesan?: string }) {
  return pesan ? (
    <p className="ad-galat" role="alert">
      {pesan}
    </p>
  ) : null;
}

function TombolAksi({ onBatal, label }: { onBatal: () => void; label: string }) {
  return (
    <div className="ad-aksi">
      <button type="button" className="ad-btn y" onClick={onBatal}>
        Batal
      </button>
      <button type="submit" className="ad-btn">
        {label}
      </button>
    </div>
  );
}

/* ---------- Layanan ---------- */

interface FormLayananProps {
  awal: Layanan | null;
  onSimpan: (data: Omit<Layanan, "id">) => void;
  onBatal: () => void;
}

export function FormLayanan({ awal, onSimpan, onBatal }: FormLayananProps) {
  const [nama, setNama] = useState(awal?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(awal?.deskripsi ?? "");
  const [aktif, setAktif] = useState(awal?.aktif ?? true);
  const [galat, setGalat] = useState("");

  function kirim(e: FormEvent) {
    e.preventDefault();
    if (!nama.trim()) {
      setGalat("Nama layanan wajib diisi.");
      return;
    }
    onSimpan({ nama: nama.trim(), deskripsi: deskripsi.trim(), aktif });
  }

  return (
    <form onSubmit={kirim} noValidate>
      <label htmlFor="layanan-nama">Nama layanan</label>
      <input
        id="layanan-nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        aria-invalid={!!galat}
      />
      <Galat pesan={galat} />

      <label htmlFor="layanan-deskripsi">Deskripsi</label>
      <input id="layanan-deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />

      <label htmlFor="layanan-status">Status</label>
      <select
        id="layanan-status"
        value={aktif ? "aktif" : "nonaktif"}
        onChange={(e) => setAktif(e.target.value === "aktif")}
      >
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Nonaktif</option>
      </select>

      <TombolAksi onBatal={onBatal} label="Simpan" />
    </form>
  );
}

/* ---------- Harga ---------- */

interface FormHargaProps {
  awal: Harga;
  onSimpan: (
    reguler: number,
    oneDay: number | null,
    express: number | null,
    quick: number | null
  ) => void;
  onBatal: () => void;
}

export function FormHarga({ awal, onSimpan, onBatal }: FormHargaProps) {
  const [reguler, setReguler] = useState(String(awal.reguler));
  const [oneDay, setOneDay] = useState(awal.oneDay === null || awal.oneDay === undefined ? "" : String(awal.oneDay));
  const [express, setExpress] = useState(awal.express === null ? "" : String(awal.express));
  const [quick, setQuick] = useState(awal.quick === null || awal.quick === undefined ? "" : String(awal.quick));
  const [galat, setGalat] = useState<{ reguler?: string; oneDay?: string; express?: string; quick?: string }>({});

  function kirim(e: FormEvent) {
    e.preventDefault();
    const r = angka(reguler);
    const od = oneDay.trim() === "" ? null : angka(oneDay);
    const x = express.trim() === "" ? null : angka(express);
    const q = quick.trim() === "" ? null : angka(quick);
    const g: typeof galat = {};
    if (r <= 0) g.reguler = "Harga reguler harus lebih dari 0.";
    if (od !== null && od <= 0) g.oneDay = "Harga one day harus lebih dari 0, atau dikosongkan.";
    if (x !== null && x <= 0) g.express = "Harga express harus lebih dari 0, atau dikosongkan.";
    if (q !== null && q <= 0) g.quick = "Harga quick harus lebih dari 0, atau dikosongkan.";
    setGalat(g);
    if (g.reguler || g.oneDay || g.express || g.quick) return;
    onSimpan(r, od, x, q);
  }

  return (
    <form onSubmit={kirim} noValidate>
      <label htmlFor="harga-reguler">Harga reguler (Rp)</label>
      <input
        id="harga-reguler"
        inputMode="numeric"
        value={reguler}
        onChange={(e) => setReguler(e.target.value)}
        aria-invalid={!!galat.reguler}
      />
      <Galat pesan={galat.reguler} />

      <label htmlFor="harga-oneday">Harga one day (Rp), kosongkan jika tidak ada</label>
      <input
        id="harga-oneday"
        inputMode="numeric"
        value={oneDay}
        onChange={(e) => setOneDay(e.target.value)}
        aria-invalid={!!galat.oneDay}
      />
      <Galat pesan={galat.oneDay} />

      <label htmlFor="harga-express">Harga express (Rp), kosongkan jika tidak ada</label>
      <input
        id="harga-express"
        inputMode="numeric"
        value={express}
        onChange={(e) => setExpress(e.target.value)}
        aria-invalid={!!galat.express}
      />
      <Galat pesan={galat.express} />

      <label htmlFor="harga-quick">Harga quick (Rp), kosongkan jika tidak ada</label>
      <input
        id="harga-quick"
        inputMode="numeric"
        value={quick}
        onChange={(e) => setQuick(e.target.value)}
        aria-invalid={!!galat.quick}
      />
      <Galat pesan={galat.quick} />

      <TombolAksi onBatal={onBatal} label="Simpan harga" />
    </form>
  );
}

/* ---------- Pengguna ---------- */

interface FormPenggunaProps {
  awal: Pengguna | null;
  onSimpan: (data: Omit<Pengguna, "id">) => void;
  onBatal: () => void;
}

export function FormPengguna({ awal, onSimpan, onBatal }: FormPenggunaProps) {
  const [nama, setNama] = useState(awal?.nama ?? "");
  const [email, setEmail] = useState(awal?.email ?? "");
  const [peran, setPeran] = useState<PeranPengguna>(awal?.peran ?? "Pelanggan");
  const [aktif, setAktif] = useState(awal?.aktif ?? true);
  const [galat, setGalat] = useState<{ nama?: string; email?: string }>({});

  function kirim(e: FormEvent) {
    e.preventDefault();
    const g: typeof galat = {};
    if (!nama.trim()) g.nama = "Nama wajib diisi.";
    if (!POLA_EMAIL.test(email.trim())) g.email = "Format email tidak valid.";
    setGalat(g);
    if (g.nama || g.email) return;
    onSimpan({ nama: nama.trim(), email: email.trim(), peran, aktif });
  }

  return (
    <form onSubmit={kirim} noValidate>
      <label htmlFor="pengguna-nama">Nama</label>
      <input id="pengguna-nama" value={nama} onChange={(e) => setNama(e.target.value)} aria-invalid={!!galat.nama} />
      <Galat pesan={galat.nama} />

      <label htmlFor="pengguna-email">Email</label>
      <input
        id="pengguna-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!galat.email}
      />
      <Galat pesan={galat.email} />

      <label htmlFor="pengguna-peran">Peran</label>
      <select id="pengguna-peran" value={peran} onChange={(e) => setPeran(e.target.value as PeranPengguna)}>
        <option value="Admin">Admin</option>
        <option value="Petugas">Petugas</option>
        <option value="Pelanggan">Pelanggan</option>
      </select>

      <label htmlFor="pengguna-status">Status</label>
      <select
        id="pengguna-status"
        value={aktif ? "aktif" : "nonaktif"}
        onChange={(e) => setAktif(e.target.value === "aktif")}
      >
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Nonaktif</option>
      </select>

      <TombolAksi onBatal={onBatal} label="Simpan" />
    </form>
  );
}
