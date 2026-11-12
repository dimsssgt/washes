"use client";

import Link from "next/link";
import ItemNotifikasi from "./ItemNotifikasi";
import Popup from "./Popup";
import { useNotifikasi } from "./NotifikasiProvider";

const JUMLAH_DI_POPUP = 4;

export default function PopupNotifikasi({ onTutup }: { onTutup: () => void }) {
  const { daftar, sekarang, tandaiDibaca } = useNotifikasi();

  return (
    <Popup judul="Notifikasi" lebar={440} kecil onTutup={onTutup}>
      <div style={{ marginTop: 8 }}>
        {daftar.length === 0 ? (
          <p className="pt-kosong">Belum ada notifikasi.</p>
        ) : (
          daftar.slice(0, JUMLAH_DI_POPUP).map((n) => (
            <ItemNotifikasi key={n.id} notifikasi={n} sekarang={sekarang} onKlik={() => tandaiDibaca(n.id)} />
          ))
        )}
      </div>
      <div className="pt-aksi">
        <Link href="/petugas/notifikasi" className="btn" onClick={onTutup}>
          Lihat semua →
        </Link>
      </div>
    </Popup>
  );
}
