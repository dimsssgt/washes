"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/pelanggan", label: "Pesanan" },
  { href: "/pelanggan/aktif", label: "Pesanan Aktif" },
  { href: "/pelanggan/riwayat", label: "Riwayat" },
  { href: "/pelanggan/notifikasi", label: "Notifikasi" },
];

export default function PelangganSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [namaPelanggan, setNamaPelanggan] = useState<string>("Pelanggan");
  const [terbuka, setTerbuka] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profil } = await supabase
            .from("profiles")
            .select("nama")
            .eq("id", user.id)
            .single();

          if (profil?.nama) {
            setNamaPelanggan(profil.nama);
            return;
          }
          if (user.user_metadata?.nama) {
            setNamaPelanggan(user.user_metadata.nama);
            return;
          }
          if (user.email) {
            const base = user.email.split("@")[0];
            setNamaPelanggan(base.charAt(0).toUpperCase() + base.slice(1));
            return;
          }
        }

        // Fallback jika ada data dari pendaftaran lokal
        const saved = localStorage.getItem("laundyku_user_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.nama) setNamaPelanggan(parsed.nama);
        }
      } catch {
        // Abaikan error jaringan
      }
    }
    loadUser();
  }, []);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
  }

  const inisial =
    namaPelanggan
      .split(" ")
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  return (
    <>
      {/* Bilah atas khusus layar mobile / kecil */}
      <div className="pelanggan-topbar">
        <button
          type="button"
          className={`pelanggan-hamburger${terbuka ? " terbuka" : ""}`}
          aria-label={terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={terbuka}
          aria-controls="pelanggan-sidebar"
          onClick={() => setTerbuka((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link
          href="/pelanggan"
          className="pelanggan-topbar-brand"
          onClick={() => setTerbuka(false)}
        >
          Laundyku
        </Link>

        <div className="pelanggan-topbar-actions">
          <Link
            href="/pelanggan/notifikasi"
            className="pelanggan-topbar-bell"
            title="Notifikasi"
            aria-label="Notifikasi"
          >
            <svg
              width="18"
              height="18"
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
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#D42A25",
              }}
            />
          </Link>

          <Link
            href="/pelanggan/profil"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#FFD21F",
              color: "#0B2A6B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Archivo Black', Impact, sans-serif",
              fontSize: 14,
              border: "2px solid #0B2A6B",
              boxShadow: "2px 2px 0 #0B2A6B",
              textDecoration: "none",
              flexShrink: 0,
            }}
            title="Profil Saya"
          >
            {inisial}
          </Link>
        </div>
      </div>

      {/* Backdrop overlay saat drawer terbuka di layar kecil */}
      <div
        className={`pelanggan-overlay${terbuka ? " terbuka" : ""}`}
        onClick={() => setTerbuka(false)}
        aria-hidden="true"
      />

      {/* Sidebar utama (desktop sticky, mobile drawer) */}
      <aside
        id="pelanggan-sidebar"
        className={`pelanggan-sidebar${terbuka ? " terbuka" : ""}`}
      >
        {/* Logo & Tombol Tutup */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <Link
            href="/pelanggan"
            onClick={() => setTerbuka(false)}
            style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontSize: 22,
              color: "#FFD21F",
              padding: 0,
              textDecoration: "none",
              display: "block",
            }}
          >
            Laundy
            <br />
            ku
          </Link>

          <button
            type="button"
            onClick={() => setTerbuka(false)}
            className="pelanggan-drawer-close"
            aria-label="Tutup menu navigasi"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 999,
              color: "#fff",
              width: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav
          aria-label="Menu navigasi pelanggan"
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/pelanggan"
                ? pathname === "/pelanggan"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setTerbuka(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 44,
                  padding: "0 16px",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isActive ? "#0B2A6B" : "#fff",
                  background: isActive ? "#FFD21F" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 20 }} />

        {/* Tombol Kembali ke Beranda Utama */}
        <Link
          href="/"
          onClick={() => setTerbuka(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
            textDecoration: "none",
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          }}
        >
          ← Beranda Utama
        </Link>

        {/* User info */}
        <div
          style={{
            background: "rgba(255,255,255,0.14)",
            borderRadius: 12,
            padding: 14,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 700 }}>{namaPelanggan}</span>
          <br />
          <span style={{ fontSize: 11, opacity: 0.85 }}>Pelanggan</span>
        </div>

        {/* Profil & Keluar */}
        <Link
          href="/pelanggan/profil"
          onClick={() => setTerbuka(false)}
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 12,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          Profil
        </Link>
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 44,
            padding: "0 16px",
            borderRadius: 12,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
          onClick={handleLogout}
        >
          Keluar
        </button>
      </aside>
    </>
  );
}
