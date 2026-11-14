import { ChipJumlah, ChipTahap } from "./ChipStatus";
import { LABEL_POSISI, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  daftar: PesananAlur[];
  onJejak: (p: PesananAlur) => void;
}

/** Pemantauan semua pesanan yang belum selesai, bisa dilihat semua bagian. */
export default function TabelPemantauan({ daftar, onJejak }: Props) {
  if (daftar.length === 0) return <p className="pt-kosong">Tidak ada pesanan yang sedang berjalan.</p>;
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Jumlah</th>
            <th>Tahap</th>
            <th>Posisi cucian</th>
            <th>Pengecekan</th>
            <th>Jejak</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => (
            <tr key={p.kode}>
              <td>{p.kode}</td>
              <td>{p.pelanggan}</td>
              <td>{p.jumlahAcuan} pcs</td>
              <td><ChipTahap tahap={p.tahap} /></td>
              <td>{LABEL_POSISI[p.tahap]}</td>
              <td><ChipJumlah pesanan={p} /></td>
              <td>
                <button type="button" className="btn y s" onClick={() => onJejak(p)} aria-label={`Lihat jejak pesanan ${p.kode}`}>
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
