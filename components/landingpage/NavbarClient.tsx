"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE } from "@/data/landing";
import NotificationButton from "@/components/landingpage/NotificationButton";
import AccountMenu from "@/components/landingpage/AccountMenu";
import Button from "@/components/landingpage/ui/Button";

interface NavbarClientProps {
  name: string | null;
  peran: "pelanggan" | "petugas" | "admin" | null;
  dashboardHref: string;
}

export default function NavbarClient({ name, peran, dashboardHref }: NavbarClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Header bar utama */}
      <header className="border-b-2 border-ink bg-white">
        <div className="container-lk max-w-[100rem]! px-4 md:px-6 xl:px-10 flex items-center justify-between gap-2 md:gap-4 py-3">
          {/* Sisi Kiri: Tombol Hamburger */}
          <div className="flex flex-1 min-w-0 items-center justify-start">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu navigasi"
              className="inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink transition-transform duration-200 hover:scale-105 hover:bg-sun cursor-pointer shadow-brut-sm"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tengah: Judul WASHES */}
          <div className="flex min-w-0 items-center justify-center">
            <Link
              href="/"
              className="font-display text-[20px] md:text-[32px] tracking-wider uppercase leading-none text-brand transition-transform hover:scale-105"
            >
              Laundyku
            </Link>
          </div>

          {/* Sisi Kanan: Notifikasi & Auth */}
          <div className="flex flex-1 min-w-0 items-center justify-end gap-2 md:gap-3">
            <NotificationButton />
            {name ? (
              <AccountMenu name={name} peran={peran ?? "pelanggan"} dashboardHref={dashboardHref} />
            ) : (
              <Button href="/login" className="shrink-0 min-h-9! py-1.5! px-3! md:min-h-11! md:py-2.5! md:px-5! text-[11px] md:text-xs">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 60% Height Dropdown Overlay Menu */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop di bawah 60% panel agar sisa 40% layar di bawahnya tertutup semi-transparan & bisa di-klik untuk close */}
            <div
              className={`fixed inset-0 z-[9998] bg-[#0B2A6B]/30 backdrop-blur-[2px] transition-opacity duration-300 ${
                drawerOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Menu Panel Berwarna Putih Tinggi 60vh */}
            <div
              className={`fixed top-0 left-0 right-0 h-[60vh] max-h-[600px] z-[9999] flex flex-col justify-between text-ink border-b-4 border-ink shadow-brut transition-all duration-300 ease-in-out ${
                drawerOpen
                  ? "translate-y-0 opacity-100 pointer-events-auto"
                  : "-translate-y-full opacity-0 pointer-events-none"
              }`}
              style={{
                backgroundColor: "#ffffff",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Top Header: Close Button (Kiri), Lokasi & Jam (Tengah), Auth/Kosong (Kanan) */}
              <div className="container-lk max-w-[100rem]! px-6 xl:px-10 flex items-center justify-between gap-4 py-3 border-b-2 border-ink/20 shrink-0">
                {/* Kiri: Tombol Close persis di posisi tombol hamburger */}
                <div className="flex items-center flex-1 justify-start">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Tutup menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink transition-transform duration-200 hover:scale-105 hover:bg-sun cursor-pointer shadow-brut-sm"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Tengah: Judul WASHES */}
                <div className="flex items-center justify-center">
                  <Link
                    href="/"
                    onClick={() => setDrawerOpen(false)}
                    className="font-display text-[26px] md:text-[32px] tracking-wider uppercase leading-none text-brand transition-transform hover:scale-105"
                  >
                    Laundyku
                  </Link>
                </div>

                {/* Kanan: Lokasi & Jam Realtime */}
                <div className="flex items-center gap-3 flex-1 justify-end text-right font-display tracking-wide uppercase">
                  <div>
                    <p className="text-xs md:text-sm font-bold text-ink leading-tight">
                      Semarang, ID
                    </p>
                    <p className="text-xs text-ink/70 leading-tight">
                      {timeStr || "10:00 AM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle Content: Gambar Kiri & Nav Links di Kanan */}
              <div className="w-full flex-1 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 my-auto py-4 overflow-y-auto">
                {/* Kolom Kiri: Visual Gambar Foto Laundry */}
                <div className="hidden md:flex flex-col justify-center">
                  <div className="relative h-[160px] w-[200px] lg:h-[200px] lg:w-[260px] overflow-hidden rounded-2xl border-[3px] border-ink shadow-brut bg-paper">
                    <Image
                      src="/hero/herolaundry.webp"
                      alt="Washes Laundry"
                      fill
                      className="object-cover"
                      sizes="260px"
                    />
                  </div>
                </div>

                {/* Kolom Kanan: Menu Links dengan font-display */}
                <nav className="flex flex-col items-center md:items-end justify-center gap-4 sm:gap-9 md:gap-3 w-full md:w-auto py-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-brand transition-all duration-200 hover:text-brand hover:translate-x-[-6px] py-1"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom Footer: Inquiries / Kontak (Kiri) & Sosmed (Kanan) */}
              <div className="w-full px-6 py-4 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 border-t-2 border-ink/20 text-xs md:text-sm text-ink font-bold shrink-0">
                {/* Kiri: General Inquiries */}
                <div className="text-center sm:text-left">
                  <span className="text-ink/60 text-xs uppercase tracking-wider mr-2">General Inquiries:</span>
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink hover:text-brand hover:underline"
                  >
                    {SITE.whatsapp}
                  </a>
                </div>

                {/* Kanan: Social Links */}
                <div className="flex gap-6 uppercase tracking-wider">
                  <a
                    href="https://instagram.com/dimsssgt_"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink hover:text-brand hover:underline"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}