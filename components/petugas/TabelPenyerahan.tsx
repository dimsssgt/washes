import { ChipBayar } from "./ChipStatus";
import { adaSelisihTerbuka, bolehDiserahkan, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  daftar: PesananAlur[];
  onSerahkan: (p: PesananAlur) => void;
}

export default function TabelPenyerahan({ daftar, onSerahkan }: Props) {
  if (daftar.length === 0) return <p className="pt-kosong">Belum ada cucian yang siap diserahkan.</p>;
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Jumlah</th>
            <th>Metode</th>
            <th>Pembayaran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => (
            <tr key={p.kode}>
              <td>{p.kode}</td>
              <td>{p.pelanggan}</td>
              <td>{p.jumlahAcuan} pcs</td>
              <td>{p.metodeSerah}</td>
              <td><ChipBayar lunas={p.lunas} /></td>
              <td>
                <button
                  type="button"
                  className="btn s"
                  disabled={!bolehDiserahkan(p)}
                  title={adaSelisihTerbuka(p) ? "Selisih belum diverifikasi" : undefined}
                  onClick={() => onSerahkan(p)}
                  aria-label={`Serahkan pesanan ${p.kode}`}
                >
                  Serahkan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
