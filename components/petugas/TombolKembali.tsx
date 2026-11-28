"use client";

import { useRouter } from "next/navigation";

export default function TombolKembali({ href }: { href: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn y s pt-kembali"
      aria-label="Kembali"
      title="Kembali"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(href);
      }}
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}