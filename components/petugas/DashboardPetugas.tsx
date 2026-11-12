"use client";

import LoncengPetugas from "./LoncengPetugas";
import { useState } from "react";
import FormInputManual, { type DataInputManual } from "./FormInputManual";
import PopupKonfirmasiTerima from "./PopupKonfirmasiTerima";
import PopupRingkasanPenerimaan from "./PopupRingkasanPenerimaan";
import PopupTerimaPesanan from "./PopupTerimaPesanan";
import TabelPesananMasuk from "./TabelPesananMasuk";
import { hargaContoh } from "@/lib/petugas/data-tiruan";
import type { DrafPenimbangan } from "@/lib/petugas/hitung";
import type { HasilPenimbangan, PesananMasuk, TahapPopup } from "@/lib/petugas/types";

interface Props {
  pesananAwal: PesananMasuk[];
  sedangDiproses: number;
  siapDiserahkan: number;
}

function nomorTerbesar(daftar: PesananMasuk[]): number {
  return daftar.reduce((maks, p) => {
    const m = /LDY-(\d+)/.exec(p.kode);
    return m ? Math.max(maks, Number(m[1])) : maks;
  }, 0);
}

export default function DashboardPetugas({ pesananAwal, sedangDiproses, siapDiserahkan }: Props) {
  const [antrian, setAntrian] = useState<PesananMasuk[]>(pesananAwal);
  const [nomorTerakhir, setNomorTerakhir] = useState(() => nomorTerbesar(pesananAwal));
  const [terpilih, setTerpilih] = useState<PesananMasuk | null>(null);
  const [tahap, setTahap] = useState<TahapPopup>("tutup");
  const [draf, setDraf] = useState<DrafPenimbangan>({ berat: "", jumlah: "", harga: "", catatan: "" });
  const [hasil, setHasil] = useState<HasilPenimbangan | null>(null);

  function bukaTerima(p: PesananMasuk) {
    setTerpilih(p);
    setDraf({
      berat: "",
      jumlah: "",
      harga: hargaContoh(p.layanan, p.waktuCuci).toLocaleString("id-ID"),
      catatan: "",
    });
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
    // TODO (Supabase): simpan penimbangan, ubah status pesanan jadi "diterima",
    // dan catat perubahan di log status, idealnya dalam satu server action.
    setAntrian((a) => a.filter((x) => x.kode !== terpilih.kode));
    setTahap("ringkasan");
  }

  function tambahManual(data: DataInputManual) {
    const nomor = nomorTerakhir + 1;
    setNomorTerakhir(nomor);
    // TODO (Supabase): simpan pesanan manual ke database.
    setAntrian((a) => [
      ...a,
      {
        kode: `LDY-${String(nomor).padStart(3, "0")}`,
        pelanggan: data.nama,
        noWa: data.noWa,
        alamatJemput: "—",
        layanan: data.layanan,
        waktuCuci: data.waktuCuci,
        jamJemput: "—",
        catatan: "Input manual petugas.",
      },
    ]);
  }

  return (
    <>
      <div className="pt-kepala">
        <LoncengPetugas />
        <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Dashboard petugas</h1>
      </div>

      <div className="pt-g4">
        <div className="pt-kartu kecil"><div style={{ fontSize: 12 }}>Perlu diterima</div><div className="pt-d" style={{ fontSize: 28, marginTop: 8 }}>{antrian.length}</div></div>
        <div className="pt-kartu kecil"><div style={{ fontSize: 12 }}>Sedang diproses</div><div className="pt-d" style={{ fontSize: 28, marginTop: 8 }}>{sedangDiproses}</div></div>
        <div className="pt-kartu kecil"><div style={{ fontSize: 12 }}>Siap diserahkan</div><div className="pt-d" style={{ fontSize: 28, marginTop: 8 }}>{siapDiserahkan}</div></div>
      </div>

      <section id="pesanan" className="pt-kartu">
        <div className="pt-kepala-kartu">
          <h2 className="pt-d">Pesanan perlu diterima</h2>
          <a className="btn y" href="#input-manual">+ Input manual</a>
        </div>
        <p className="pt-hint">Klik Terima untuk membuka detail pesanan dan form penimbangan.</p>
        <TabelPesananMasuk daftar={antrian} onTerima={bukaTerima} />
      </section>

      <div className="pt-g2">
        <FormInputManual onSimpan={tambahManual} />
      </div>

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
        <PopupKonfirmasiTerima
          pesanan={terpilih}
          hasil={hasil}
          onYa={terimaSekarang}
          onKembali={() => setTahap("terima")}
        />
      )}
      {tahap === "ringkasan" && terpilih && hasil && (
        <PopupRingkasanPenerimaan pesanan={terpilih} hasil={hasil} onTutup={tutupSemua} />
      )}
    </>
  );
}
