"use client";

import Popup from "./Popup";
import { LABEL_BAGIAN, type Jejak, type PesananAlur } from "@/lib/petugas/alur";
import { waktuRelatif } from "@/lib/petugas/notifikasi";

const JUDUL: Record<Jejak["jenis"], string> = {
  penerimaan: "Diterima dari pelanggan",
  serah_terima: "Serah-terima antar bagian",
  penyerahan: "Diserahkan ke pelanggan",
};

/** Riwayat lengkap siapa yang menghitung, kapan, dan berapa jumlahnya. */
export default function PopupJejak({ pesanan, onTutup }: { pesanan: PesananAlur; onTutup: () => void }) {
  const sekarang = new Date();
  return (
    <Popup judul="Jejak cucian" subjudul={`${pesanan.kode} · ${pesanan.pelanggan} · acuan ${pesanan.jumlahAcuan} pcs`} lebar={520} kecil onTutup={onTutup}>
      <ol className="pt-jejak">
        {pesanan.jejak.map((j) => (
          <li key={j.id} className={j.sesuai ? "" : "selisih"}>
            <b>{JUDUL[j.jenis]}</b>
            <small>
              {LABEL_BAGIAN[j.bagian]} · {j.petugas} · {waktuRelatif(j.waktu, sekarang)}
            </small>
            <span>
              Tercatat {j.jumlahTercatat} pcs, dihitung {j.jumlahDihitung} pcs:{" "}
              <b>{j.sesuai ? "sesuai" : `selisih ${j.jumlahDihitung - j.jumlahTercatat}`}</b>
            </span>
            {j.catatan && <span className="pt-cat">Catatan: {j.catatan}</span>}
            {j.verifikasi && (
              <span className="pt-ver">
                Diverifikasi {j.verifikasi.petugas}: {j.verifikasi.catatan} (acuan jadi {j.verifikasi.jumlahAcuanBaru} pcs)
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="pt-aksi">
        <button type="button" className="btn y" onClick={onTutup}>Tutup</button>
      </div>
    </Popup>
  );
}
