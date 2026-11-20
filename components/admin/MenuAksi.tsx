"use client";

import { useEffect, useRef, useState } from "react";
import { EditIcon, EyeIcon, TrashIcon } from "./Icons";

export interface ItemAksi {
  label: string;
  ikon: "lihat" | "edit" | "hapus";
  bahaya?: boolean;
  onKlik: () => void;
}

const IKON = { lihat: EyeIcon, edit: EditIcon, hapus: TrashIcon };

export default function MenuAksi({ label, items }: { label: string; items: ItemAksi[] }) {
  const [buka, setBuka] = useState(false);
  const [posisi, setPosisi] = useState({ top: 0, right: 0 });
  const tombolRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hitung posisi dropdown dari posisi tombol. Dipanggil saat dibuka dan saat halaman di-scroll.
  function hitungPosisi() {
    if (!tombolRef.current) return;
    const r = tombolRef.current.getBoundingClientRect();
    setPosisi({ top: r.bottom + 6, right: window.innerWidth - r.right });
  }

  function toggle() {
    if (!buka) hitungPosisi();
    setBuka(!buka);
  }

  useEffect(() => {
    if (!buka) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || tombolRef.current?.contains(target)) return;
      setBuka(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setBuka(false);
    }
    function onScroll() {
      hitungPosisi();
    }
    function onResize() {
      setBuka(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [buka]);

  return (
    <>
      <button
        ref={tombolRef}
        type="button"
        className="ad-ikon ad-titik-tiga"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={buka}
        onClick={toggle}
      >
        ⋮
      </button>
      {buka && (
        <div ref={menuRef} role="menu" className="ad-dropdown" style={{ top: posisi.top, right: posisi.right }}>
          {items.map((it) => {
            const Ikon = IKON[it.ikon];
            return (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                className={`ad-dropdown-item${it.bahaya ? " bahaya" : ""}`}
                onClick={() => {
                  setBuka(false);
                  it.onKlik();
                }}
              >
                <Ikon size={14} />
                {it.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}