"use client";

import { useEffect, type ReactNode } from "react";
import { TrashIcon } from "./Icons";

interface ModalProps {
  judul: string;
  onTutup: () => void;
  children: ReactNode;
}

export default function Modal({ judul, onTutup, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onTutup();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTutup]);

  return (
    <div className="ad-ov" onClick={onTutup}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-modal-judul"
        className="ad-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ad-modal-judul" className="ad-d" style={{ fontSize: 24, color: "var(--b)", marginBottom: 12 }}>
          {judul}
        </h2>
        {children}
      </div>
    </div>
  );
}

interface KonfirmasiProps {
  judul: string;
  pesan: string;
  label: string;
  onYa: () => void;
  onBatal: () => void;
}

export function Konfirmasi({ judul, pesan, label, onYa, onBatal }: KonfirmasiProps) {
  return (
    <Modal judul={judul} onTutup={onBatal}>
      <p style={{ margin: 0 }}>{pesan}</p>
      <div className="ad-aksi">
        <button type="button" className="ad-btn y" onClick={onBatal}>
          Batal
        </button>
        <button
          type="button"
          className="ad-btn r"
          onClick={onYa}
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <TrashIcon size={14} />
          {label}
        </button>
      </div>
    </Modal>
  );
}
