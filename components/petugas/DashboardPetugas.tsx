"use client";

import Link from "next/link";
import { useState } from "react";
import FormInputManual from "./FormInputManual";
import HeaderHalaman from "./HeaderHalaman";
import PopupKonfirmasiTerima from "./PopupKonfirmasiTerima";
import PopupRingkasanPenerimaan from "./PopupRingkasanPenerimaan";
import PopupTerimaPesanan from "./PopupTerimaPesanan";
import { usePetugas } from "./PetugasProvider";
import TabelPesananMasuk from "./TabelPesananMasuk";
import { LABEL_BAGIAN, PENERIMA_BERIKUTNYA, adaSelisihTerbuka } from "@/lib/petugas/alur";
import { hargaContoh } from "@/lib/petugas/data-tiruan";
import type { DrafPenimbangan } from "@/lib/petugas/hitung";
import type { HasilPenimbangan, PesananMasuk, TahapPopup } from "@/lib/petugas/types";

function Kartu({ judul, nilai }: { judul: string; nilai: number }) {
  return (
    <div className="pt-kartu kecil">
      <div style={{ fontSize: 12 }}>{judul}</div>
      <div className="pt-d" style={{ fontSize: 28, marginTop: 8 }}>{nilai}</div>
    </div>
  );
}

export default function DashboardPetugas() {
  const { pengguna, antrian, kerja, terimaPesanan, tambahManual } = usePetugas();
  const [terpilih, setTerpilih] = useState<PesananMasuk | null>(null);
  const [tahap, setTahap] = useState<TahapPopup>("tutup");
  const [draf, setDraf] = useState<DrafPenimbangan>({ berat: "", jumlah: "", harga: "", catatan: "" });
  const [hasil, setHasil] = useState<HasilPenimbangan | null>(null);

  const dalamProses = kerja.filter((p) => p.tahap === "ditimbang" || p.tahap === "dicuci" || p.tahap === "disetrika").length;
  const siapSerah = kerja.filter((p) => p.tahap === "siap").length;
  const perluVerifikasi = kerja.filter(adaSelisihTerbuka).length;
  const frontOffice = pengguna.bagian === "front_office";
  const antrianBagian = kerja.filter((p) => PENERIMA_BERIKUTNYA[p.tahap] === pengguna.bagian && !adaSelisihTerbuka(p)).length;

  function bukaTerima(p: PesananMasuk) {
    setTerpilih(p);
    setDraf({ berat: "", jumlah: "", harga: hargaContoh(p.layanan, p.waktuCuci).toLocaleString("id-ID"), catatan: "" });
    setHasil(null);
    setTahap("terima");
  }

  function tutupSemua() {
    setTahap("tutup");
    setTerpilih(null);
    setHasil(null);
  }

  function terimaSekarang() {
    if (!terpilih || !hasil) return;
    terimaPesanan(terpilih, hasil);
    setTahap("ringkasan");
  }

  return (
    <>
      <HeaderHalaman judul="Dashboard petugas" hrefKembali="/" />

      {frontOffice ? (
        <div className="pt-g4">
          <Kartu judul="Perlu diterima" nilai={antrian.length} />
          <Kartu judul="Sedang diproses" nilai={dalamProses} />
          <Kartu judul="Siap diserahkan" nilai={siapSerah} />
          <Kartu judul="Perlu verifikasi" nilai={perluVerifikasi} />
        </div>
      ) : (
        <div className="pt-g4">
          <Kartu judul={`Menunggu diterima ${LABEL_BAGIAN[pengguna.bagian]}`} nilai={antrianBagian} />
          <Kartu judul="Semua yang sedang diproses" nilai={dalamProses} />
        </div>
      )}

      {frontOffice ? (
        <>
          <section id="pesanan" className="pt-kartu">
            <div className="pt-kepala-kartu">
              <h2 className="pt-d">Pesanan perlu diterima</h2>
              <a className="btn y" href="#input-manual">+ Input manual</a>
            </div>
            <p className="pt-hint">Klik Terima, lalu timbang dan hitung seluruh pakaian bersama pelanggan. Jumlah ini menjadi acuan pengecekan di setiap bagian.</p>
            <TabelPesananMasuk daftar={antrian} onTerima={bukaTerima} />
          </section>

          <div className="pt-g2">
            <FormInputManual onSimpan={tambahManual} />
          </div>
        </>
      ) : (
        <section className="pt-kartu">
          <h2 className="pt-d">Bagian {LABEL_BAGIAN[pengguna.bagian]}</h2>
          <p className="pt-hint">
            Tugas Anda: menerima cucian dari bagian sebelumnya dan menghitung ulang jumlah pakaiannya. Kalau tidak sama dengan catatan, tulis catatan selisih, lalu Front Office akan memverifikasi.
          </p>
          <Link className="btn" href="/petugas/pengerjaan">Buka halaman Pengerjaan</Link>
        </section>
      )}

      {tahap === "terima" && terpilih && (
        <PopupTerimaPesanan
          pesanan={terpilih}
          draf={draf}
          setDraf={setDraf}
          onBatal={tutupSemua}
          onLanjut={(h) => {
            setHasil(h);
            setTahap("konfirmasi");
          }}
        />
      )}
      {tahap === "konfirmasi" && terpilih && hasil && (
        <PopupKonfirmasiTerima pesanan={terpilih} hasil={hasil} onYa={terimaSekarang} onKembali={() => setTahap("terima")} />
      )}
      {tahap === "ringkasan" && terpilih && hasil && (
        <PopupRingkasanPenerimaan pesanan={terpilih} hasil={hasil} onTutup={tutupSemua} />
      )}
    </>
  );
}
