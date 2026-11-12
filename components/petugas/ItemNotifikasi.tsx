import { waktuRelatif, type NotifikasiPetugas } from "@/lib/petugas/notifikasi";

interface Props {
  notifikasi: NotifikasiPetugas;
  sekarang: Date;
  onKlik: () => void;
}

/** Satu baris notifikasi. Diklik = ditandai sudah dibaca. */
export default function ItemNotifikasi({ notifikasi: n, sekarang, onKlik }: Props) {
  return (
    <button type="button" className="pt-notif" onClick={onKlik}>
      <span className="pt-notif-titik" style={{ opacity: n.dibaca ? 0 : 1 }} aria-hidden="true" />
      <span className="pt-notif-isi">
        <span className="pt-notif-baris">
          <b>{n.judul}</b>
          <span className="pt-notif-waktu">{waktuRelatif(n.waktu, sekarang)}</span>
        </span>
        <span className="pt-notif-teks">{n.isi}</span>
      </span>
      {!n.dibaca && <span className="pt-sr">Belum dibaca</span>}
    </button>
  );
}
