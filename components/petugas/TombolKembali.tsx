"use client";

import { useRouter } from "next/navigation";

/** Kembali ke halaman sebelumnya. Kalau tidak ada riwayat (halaman dibuka langsung), pindah ke href. */
export default function TombolKembali({ href }: { href: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn y s pt-kembali"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(href);
      }}
    >
      ← Kembali
    </button>
  );
}
