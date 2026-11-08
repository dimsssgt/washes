"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface Props {
  judul: string;
  subjudul?: string;
  /** Lebar maksimum panel dalam px. */
  lebar?: number;
  /** Dipanggil saat tombol Tutup atau tombol Esc ditekan. */
  onTutup: () => void;
  tampilTutup?: boolean;
  kecil?: boolean;
  kelas?: string;
  children: ReactNode;
}

export default function Popup({
  judul,
  subjudul,
  lebar = 960,
  onTutup,
  tampilTutup = true,
  kecil = false,
  kelas = "",
  children,
}: Props) {
  const idJudul = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
  }, []);

  useEffect(() => {
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") onTutup();
    };
    document.addEventListener("keydown", tekan);
    return () => document.removeEventListener("keydown", tekan);
  }, [onTutup]);

  return (
    <div className="pt-ov">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idJudul}
        tabIndex={-1}
        className={`pt-pop${kecil ? " kecil" : ""} ${kelas}`}
        style={{ maxWidth: lebar }}
      >
        <div className="pt-kepala-kartu" style={{ alignItems: "flex-start" }}>
          <div>
            <h2 id={idJudul} className="pt-d" style={{ fontSize: kecil ? 22 : 28, marginBottom: 0 }}>
              {judul}
            </h2>
            {subjudul && <p style={{ margin: "8px 0 0", fontSize: 12 }}>{subjudul}</p>}
          </div>
          {tampilTutup && (
            <button type="button" className="btn y s pt-noprint" onClick={onTutup}>
              Tutup ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
