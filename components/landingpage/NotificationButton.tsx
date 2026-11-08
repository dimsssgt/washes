"use client";

import { useRef, useState } from "react";
import NotificationModal from "./NotificationModal";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative ${open ? "z-50" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="Notifikasi"
        aria-label="Notifikasi"
        aria-expanded={open}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink transition-all duration-200 hover:scale-110 hover:bg-sun cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-ink bg-red" />
      </button>

      <NotificationModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
