import LoncengPetugas from "./LoncengPetugas";
import TombolKembali from "./TombolKembali";

/** Kepala halaman petugas: tombol kembali dan judul di kiri, lonceng di kanan (sama seperti Admin dan Pelanggan). */
export default function HeaderHalaman({ judul, hrefKembali }: { judul: string; hrefKembali: string }) {
  return (
    <div className="pt-kepala">
      <div className="pt-judul">
        <TombolKembali href={hrefKembali} />
        <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>
          {judul}
        </h1>
      </div>
      <LoncengPetugas />
    </div>
  );
}
