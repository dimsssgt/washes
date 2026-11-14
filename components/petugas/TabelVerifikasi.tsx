import { LABEL_BAGIAN, selisihTerbuka, type Jejak, type PesananAlur } from "@/lib/petugas/alur";

interface Props {
  daftar: PesananAlur[];
  onVerifikasi: (p: PesananAlur, j: Jejak) => void;
}

/** Selisih jumlah yang menunggu verifikasi Front Office. */
export default function TabelVerifikasi({ daftar, onVerifikasi }: Props) {
  const baris = daftar.flatMap((p) => selisihTerbuka(p).map((j) => ({ p, j })));
  if (baris.length === 0) return <p className="pt-kosong">Tidak ada selisih yang perlu diverifikasi.</p>;
  return (
    <div className="pt-gulung">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Pelanggan</th>
            <th>Dilaporkan oleh</th>
            <th>Tercatat</th>
            <th>Dihitung</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {baris.map(({ p, j }) => (
            <tr key={j.id}>
              <td>{p.kode}</td>
              <td>{p.pelanggan}</td>
              <td>{LABEL_BAGIAN[j.bagian]} ({j.petugas})</td>
              <td>{j.jumlahTercatat} pcs</td>
              <td>{j.jumlahDihitung} pcs</td>
              <td>{j.catatan}</td>
              <td>
                <button type="button" className="btn s" onClick={() => onVerifikasi(p, j)} aria-label={`Verifikasi selisih pesanan ${p.kode}`}>
                  Verifikasi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
