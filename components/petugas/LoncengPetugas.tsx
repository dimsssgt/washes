"use client";

import { useState } from "react";
import { useNotifikasi } from "./NotifikasiProvider";
import PopupNotifikasi from "./PopupNotifikasi";

/** Tombol lonceng di pojok kanan atas. Klik untuk membuka pop-up Notifikasi. */
export default function LoncengPetugas() {
  const { belumDibaca } = useNotifikasi();
  const [buka, setBuka] = useState(false);

  return (
    <>
      <button
        type="button"
        className="pt-lonceng"
        aria-label={belumDibaca > 0 ? `Notifikasi, ${belumDibaca} belum dibaca` : "Notifikasi"}
        aria-haspopup="dialog"
        onClick={() => setBuka(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {belumDibaca > 0 && <span className="pt-titik" />}
      </button>
      {buka && <PopupNotifikasi onTutup={() => setBuka(false)} />}
    </>
  );
}
