"use client";

import { useState } from "react";
import HeaderHalaman from "./HeaderHalaman";
import { usePetugas } from "./PetugasProvider";
import PopupJejak from "./PopupJejak";
import PopupKonfirmasiPenyerahan from "./PopupKonfirmasiPenyerahan";
import PopupSerahTerima from "./PopupSerahTerima";
import PopupVerifikasiSelisih from "./PopupVerifikasiSelisih";
import TabelAntrianBagian from "./TabelAntrianBagian";
import TabelPemantauan from "./TabelPemantauan";
import TabelPenyerahan from "./TabelPenyerahan";
import TabelVerifikasi from "./TabelVerifikasi";
import { LABEL_BAGIAN, PENERIMA_BERIKUTNYA, adaSelisihTerbuka, type Jejak, type PesananAlur } from "@/lib/petugas/alur";

type Popup = "tutup" | "terima" | "verifikasi" | "serah" | "jejak";

export default function PengerjaanPetugas() {
  const { pengguna, kerja, hitungSerahTerima, verifikasi, serahkan } = usePetugas();
  const [popup, setPopup] = useState<Popup>("tutup");
  const [kodeDipilih, setKodeDipilih] = useState<string | null>(null);
  const [jejakId, setJejakId] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");

  const bagian = pengguna.bagian;
  const frontOffice = bagian === "front_office";
  const dipilih = kerja.find((p) => p.kode === kodeDipilih) ?? null;
  const jejakDipilih = dipilih?.jejak.find((j) => j.id === jejakId) ?? null;

  const antrianBagian = kerja.filter((p) => PENERIMA_BERIKUTNYA[p.tahap] === bagian && !adaSelisihTerbuka(p));
  const siapSerah = kerja.filter((p) => p.tahap === "siap");
  const berjalan = kerja.filter((p) => p.tahap !== "selesai");

  function buka(jenis: Popup, p: PesananAlur, j?: Jejak) {
    setKodeDipilih(p.kode);
    setJejakId(j?.id ?? null);
    setPesan("");
    setPopup(jenis);
  }

  function tutup() {
    setPopup("tutup");
    setKodeDipilih(null);
    setJejakId(null);
  }

  return (
    <>
      <HeaderHalaman judul="Pengerjaan" hrefKembali="/petugas" />

      <p className="pt-hint" style={{ margin: 0 }}>
        Masuk sebagai <b>{pengguna.nama}</b>, bagian <b>{LABEL_BAGIAN[bagian]}</b>.
      </p>

      <div aria-live="polite">{pesan && <p className="pt-pesan">{pesan}</p>}</div>

      <section id="antrian" className="pt-kartu">
        <h2 className="pt-d">Perlu diterima di {LABEL_BAGIAN[bagian]}</h2>
        <p className="pt-hint">Hitung ulang jumlah pakaian saat menerima. Kalau tidak sama dengan catatan, tulis catatan selisih.</p>
        <TabelAntrianBagian daftar={antrianBagian} onTerima={(p) => buka("terima", p)} />
      </section>

      {frontOffice && (
        <>
          <section id="verifikasi" className="pt-kartu">
            <h2 className="pt-d">Perlu verifikasi</h2>
            <p className="pt-hint">Pesanan dengan selisih ditahan sampai Front Office memverifikasi.</p>
            <TabelVerifikasi daftar={kerja} onVerifikasi={(p, j) => buka("verifikasi", p, j)} />
          </section>

          <section id="penyerahan" className="pt-kartu">
            <h2 className="pt-d">Penyerahan cucian</h2>
            <TabelPenyerahan daftar={siapSerah} onSerahkan={(p) => buka("serah", p)} />
          </section>
        </>
      )}

      <section id="pemantauan" className="pt-kartu">
        <h2 className="pt-d">Pemantauan semua pesanan</h2>
        <p className="pt-hint">Posisi cucian dan status pengecekan jumlah. Klik Lihat untuk jejak lengkap.</p>
        <TabelPemantauan daftar={berjalan} onJejak={(p) => buka("jejak", p)} />
      </section>

      {popup === "terima" && dipilih && (
        <PopupSerahTerima
          pesanan={dipilih}
          bagian={bagian}
          onBatal={tutup}
          onKonfirmasi={(jumlah, catatan) => {
            const galat = hitungSerahTerima(dipilih.kode, jumlah, catatan);
            if (galat) return galat;
            setPesan(
              jumlah === dipilih.jumlahAcuan
                ? `Pesanan ${dipilih.kode} diterima, jumlah sesuai.`
                : `Pesanan ${dipilih.kode} diterima dengan selisih. Menunggu verifikasi Front Office.`,
            );
            tutup();
            return null;
          }}
        />
      )}
      {popup === "verifikasi" && dipilih && jejakDipilih && (
        <PopupVerifikasiSelisih
          pesanan={dipilih}
          jejak={jejakDipilih}
          onBatal={tutup}
          onVerifikasi={(catatan, jumlahBaru) => {
            const galat = verifikasi(dipilih.kode, jejakDipilih.id, catatan, jumlahBaru);
            if (galat) return galat;
            setPesan(`Selisih pesanan ${dipilih.kode} sudah diverifikasi. Pesanan bisa dilanjutkan.`);
            tutup();
            return null;
          }}
        />
      )}
      {popup === "serah" && dipilih && (
        <PopupKonfirmasiPenyerahan
          pesanan={dipilih}
          onBatal={tutup}
          onSerahkan={(d) => {
            const galat = serahkan(dipilih.kode, d);
            if (galat) return galat;
            setPesan(`Pesanan ${dipilih.kode} sudah diserahkan kepada ${d.penerima.trim()}.`);
            tutup();
            return null;
          }}
        />
      )}
      {popup === "jejak" && dipilih && <PopupJejak pesanan={dipilih} onTutup={tutup} />}
    </>
  );
}
