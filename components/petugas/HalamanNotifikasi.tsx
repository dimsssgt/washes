"use client";

import Link from "next/link";
import { useState } from "react";
import ItemNotifikasi from "./ItemNotifikasi";
import { useNotifikasi } from "./NotifikasiProvider";
import { saring, type ModeNotifikasi } from "@/lib/petugas/notifikasi";

export default function HalamanNotifikasi() {
  const { daftar, sekarang, belumDibaca, tandaiDibaca, tandaiSemuaDibaca } = useNotifikasi();
  const [mode, setMode] = useState<ModeNotifikasi>("semua");
  const tampil = saring(daftar, mode);

  return (
    <>
      <div className="pt-kepala">
        <h1 className="pt-d" style={{ fontSize: 40, color: "var(--b)" }}>Notifikasi</h1>
        <Link href="/petugas" style={{ fontWeight: 700, textDecoration: "underline" }}>
          ← Kembali ke dashboard
        </Link>
      </div>

      <section className="pt-kartu" style={{ maxWidth: 820 }}>
        <div className="pt-kepala-kartu">
          <div className="pt-tabs" role="group" aria-label="Saring notifikasi">
            <button type="button" className={`pt-tab${mode === "semua" ? " on" : ""}`} aria-pressed={mode === "semua"} onClick={() => setMode("semua")}>
              Semua
            </button>
            <button type="button" className={`pt-tab${mode === "belum" ? " on" : ""}`} aria-pressed={mode === "belum"} onClick={() => setMode("belum")}>
              Belum dibaca{belumDibaca > 0 ? ` (${belumDibaca})` : ""}
            </button>
          </div>
          <button type="button" className="btn y s" disabled={belumDibaca === 0} onClick={tandaiSemuaDibaca}>
            Tandai semua dibaca
          </button>
        </div>

        <div style={{ marginTop: 8 }} aria-live="polite">
          {tampil.length === 0 ? (
            <p className="pt-kosong">
              {daftar.length === 0 ? "Belum ada notifikasi." : "Tidak ada notifikasi yang belum dibaca."}
            </p>
          ) : (
            tampil.map((n) => (
              <ItemNotifikasi key={n.id} notifikasi={n} sekarang={sekarang} onKlik={() => tandaiDibaca(n.id)} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
