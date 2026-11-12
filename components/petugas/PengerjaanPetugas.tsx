"use client";

import LoncengPetugas from "./LoncengPetugas";
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
        <LoncengPetugas />
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
