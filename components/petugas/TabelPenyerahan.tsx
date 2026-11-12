import { ChipBayar } from "./ChipStatus";
import { bolehDiserahkan, type PesananKerja } from "@/lib/petugas/pengerjaan";

interface Props {
  daftar: PesananKerja[];
  onSerahkan: (p: PesananKerja) => void;
}

export default function TabelPenyerahan({ daftar, onSerahkan }: Props) {
  if (daftar.length === 0) {
    return <p className="pt-kosong">Belum ada cucian yang siap diserahkan.</p>;
  }
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
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
              <td>{p.metodeSerah}</td>
              <td><ChipBayar lunas={p.lunas} /></td>
              <td>
                <button
                  type="button"
                  className="btn s"
                  disabled={!bolehDiserahkan(p)}
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
