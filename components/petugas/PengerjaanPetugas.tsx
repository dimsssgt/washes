"use client";

import { useState } from "react";
import PopupKonfirmasiPenyerahan, { type DataPenyerahan } from "./PopupKonfirmasiPenyerahan";
import PopupKonfirmasiSimpanTahap from "./PopupKonfirmasiSimpanTahap";
import PopupUpdateTahap from "./PopupUpdateTahap";
import TabelPenyerahan from "./TabelPenyerahan";
import TabelProses from "./TabelProses";
import {
  LABEL_TAHAP,
  bolehPindahTahap,
  dalamProses,
  siapDiserahkan,
  tahapBerikutnya,
  type PesananKerja,
  type Tahap,
} from "@/lib/petugas/pengerjaan";

type Popup = "tutup" | "update" | "konfirmasiTahap" | "serah";

export default function PengerjaanPetugas({ awal }: { awal: PesananKerja[] }) {
  const [daftar, setDaftar] = useState<PesananKerja[]>(awal);
  const [dipilih, setDipilih] = useState<PesananKerja | null>(null);
  const [tujuan, setTujuan] = useState<Tahap | null>(null);
  const [popup, setPopup] = useState<Popup>("tutup");
  const [pesan, setPesan] = useState("");

  function tutup() {
    setPopup("tutup");
    setDipilih(null);
    setTujuan(null);
  }

  function bukaUpdate(p: PesananKerja) {
    const berikut = tahapBerikutnya(p.tahap);
    if (!berikut) return;
    setDipilih(p);
    setTujuan(berikut);
    setPesan("");
    setPopup("update");
  }

  function simpanTahap() {
    if (!dipilih || !tujuan || !bolehPindahTahap(dipilih.tahap, tujuan)) return;
    // TODO (Supabase): ubah status pesanan, tulis log status, dan buat notifikasi
    // untuk pelanggan, sebaiknya dalam satu server action.
    setDaftar((d) => d.map((p) => (p.kode === dipilih.kode ? { ...p, tahap: tujuan } : p)));
    setPesan(`Tahap ${dipilih.kode} diperbarui menjadi "${LABEL_TAHAP[tujuan]}".`);
    tutup();
  }

  function bukaSerah(p: PesananKerja) {
    setDipilih(p);
    setPesan("");
    setPopup("serah");
  }

  function serahkan(data: DataPenyerahan) {
    if (!dipilih) return;
    // TODO (Supabase): catat pembayaran (metode, waktu, petugas), ubah status
    // jadi "selesai", dan simpan nama penerima.
    setDaftar((d) =>
      d.map((p) =>
        p.kode === dipilih.kode
          ? { ...p, tahap: "selesai", lunas: true, metodeBayar: data.metodeBayar, penerima: data.penerima }
          : p,
      ),
    );
    setPesan(`Pesanan ${dipilih.kode} sudah diserahkan kepada ${data.penerima}.`);
    tutup();
  }

  return (
    <>
      <div className="pt-kepala">
        <span className="pt-lonceng" role="img" aria-label="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="pt-titik" />
        </span>
        <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Pengerjaan</h1>
      </div>

      <div aria-live="polite">{pesan && <p className="pt-pesan">{pesan}</p>}</div>

      <section id="proses" className="pt-kartu">
        <h2 className="pt-d">Proses pengerjaan</h2>
        <TabelProses daftar={dalamProses(daftar)} onUbah={bukaUpdate} />
      </section>

      <section id="penyerahan" className="pt-kartu">
        <h2 className="pt-d">Penyerahan cucian</h2>
        <TabelPenyerahan daftar={siapDiserahkan(daftar)} onSerahkan={bukaSerah} />
      </section>

      {popup === "update" && dipilih && tujuan && (
        <PopupUpdateTahap
          pesanan={dipilih}
          tujuanAwal={tujuan}
          onBatal={tutup}
          onLanjut={(t) => {
            setTujuan(t);
            setPopup("konfirmasiTahap");
          }}
        />
      )}
      {popup === "konfirmasiTahap" && dipilih && tujuan && (
        <PopupKonfirmasiSimpanTahap
          pesanan={dipilih}
          tujuan={tujuan}
          onYa={simpanTahap}
          onKembali={() => setPopup("update")}
        />
      )}
      {popup === "serah" && dipilih && (
        <PopupKonfirmasiPenyerahan pesanan={dipilih} onBatal={tutup} onSerahkan={serahkan} />
      )}
    </>
  );
}
