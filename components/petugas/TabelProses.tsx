import { ChipTahap } from "./ChipStatus";
import { bisaDiubahTahapnya, type PesananKerja } from "@/lib/petugas/pengerjaan";

interface Props {
  daftar: PesananKerja[];
  onUbah: (p: PesananKerja) => void;
}

export default function TabelProses({ daftar, onUbah }: Props) {
  if (daftar.length === 0) {
    return <p className="pt-kosong">Tidak ada pesanan yang sedang diproses.</p>;
  }
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Berat/Jumlah</th>
            <th>Tahap</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => (
            <tr key={p.kode}>
              <td>{p.kode}</td>
              <td>{p.pelanggan}</td>
              <td>{p.layanan}</td>
              <td>{p.beratJumlah}</td>
              <td><ChipTahap tahap={p.tahap} /></td>
              <td>
                <button
                  type="button"
                  className="btn y s"
                  disabled={!bisaDiubahTahapnya(p)}
                  onClick={() => onUbah(p)}
                  aria-label={`Ubah tahap pesanan ${p.kode}`}
                >
                  Ubah
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
