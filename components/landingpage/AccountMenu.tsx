"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSessionCookie } from "@/feat/auth/session";


export default function AccountMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function logout() {
    clearSessionCookie();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-brut bg-sun text-ink min-h-11! py-2.5! px-4! text-xs gap-2"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-white">
          {name.charAt(0).toUpperCase()}
        </span>
        {name} <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border-2 border-ink bg-white p-2 shadow-[4px_4px_0_var(--color-ink)]"
        >
          <Link
            role="menuitem"
            href="/pelanggan"
            onClick={() => setOpen(false)}
            className="block rounded-lg text-ink px-3 py-2.5 text-sm font-bold uppercase hover:bg-sun"
          >
            Dashboard Pelanggan
          </Link>
          <Link
            role="menuitem"
            href="/pelanggan/profil"
            onClick={() => setOpen(false)}
            className="block text-ink rounded-lg px-3 py-2.5 text-sm font-bold uppercase hover:bg-sun"
          >
            Profil
          </Link>
          <div className="my-1 border-t-2 border-ink" />
          <button
            role="menuitem"
            type="button"
            onClick={logout}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-bold uppercase text-red hover:bg-red hover:text-white"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}