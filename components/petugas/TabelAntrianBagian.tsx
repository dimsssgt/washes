import { LABEL_BAGIAN, PENYERAH_SAAT_INI, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  daftar: PesananAlur[];
  onTerima: (p: PesananAlur) => void;
}

/** Cucian yang menunggu diterima bagian ini. Menerima = menghitung ulang jumlah pakaian. */
export default function TabelAntrianBagian({ daftar, onTerima }: Props) {
  if (daftar.length === 0) return <p className="pt-kosong">Tidak ada cucian yang menunggu diterima di bagian Anda.</p>;
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Jumlah tercatat</th>
            <th>Dari</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftar.map((p) => {
            const asal = PENYERAH_SAAT_INI[p.tahap];
            return (
              <tr key={p.kode}>
                <td>{p.kode}</td>
                <td>{p.pelanggan}</td>
                <td>{p.layanan}</td>
                <td>{p.jumlahAcuan} pcs</td>
                <td>{asal ? LABEL_BAGIAN[asal] : "—"}</td>
                <td>
                  <button type="button" className="btn y s" onClick={() => onTerima(p)} aria-label={`Terima dan hitung pesanan ${p.kode}`}>
                    Terima &amp; hitung
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
