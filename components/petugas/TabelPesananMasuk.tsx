import type { PesananMasuk } from "@/lib/petugas/types";

interface Props {
  daftar: PesananMasuk[];
  onTerima: (p: PesananMasuk) => void;
}

export default function TabelPesananMasuk({ daftar, onTerima }: Props) {
  if (daftar.length === 0) {
    return <p className="pt-kosong">Tidak ada pesanan yang perlu diterima.</p>;
  }

  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>No. WA</th>
            <th>Layanan</th>
            <th>Waktu cuci</th>
            <th>Jam jemput</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => (
            <tr key={p.kode}>
              <td>{p.kode}</td>
              <td>{p.pelanggan}</td>
              <td>{p.noWa}</td>
              <td>{p.layanan}</td>
              <td>{p.waktuCuci}</td>
              <td>{p.jamJemput}</td>
              <td>
                <button
                  type="button"
                  className="btn y s"
                  onClick={() => onTerima(p)}
                  aria-label={`Terima pesanan ${p.kode}`}
                >
                  Terima
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
