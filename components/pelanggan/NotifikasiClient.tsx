"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  tandaNotifikasiDibaca,
  type NotifikasiSaya,
} from "@/lib/pelanggan/actions";

const FONT = "var(--font-poppins), 'Poppins', Arial, sans-serif";

export default function NotifikasiClient({ data }: { data: NotifikasiSaya[] }) {
  const [filter, setFilter] = useState<"semua" | "unread">("semua");
  const [list, setList] = useState<NotifikasiSaya[]>(data);

  const displayed = filter === "semua" ? list : list.filter((n) => !n.dibaca);

  async function markAllAsRead() {
    setList((prev) => prev.map((n) => ({ ...n, dibaca: true })));
    await tandaNotifikasiDibaca();
  }

  async function markAsRead(id: string) {
    const target = list.find((n) => n.id === id);
    if (!target || target.dibaca) return;
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n)));
    await tandaNotifikasiDibaca([id]);
  }

  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <Link
          href="/pelanggan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            color: "#0B2A6B",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke dashboard pelanggan
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h1
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
            fontSize: 40,
            color: "#1457D6",
          }}
        >
          Notifikasi
        </h1>
      </div>

      <section
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 18,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 24,
          maxWidth: 820,
          color: "#0B2A6B",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["semua", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: "inline-block",
                  border: "2px solid #0B2A6B",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: filter === f ? "#1457D6" : "#FFF4DE",
                  color: filter === f ? "#fff" : "#0B2A6B",
                  transition: "all 0.15s",
                }}
              >
                {f === "semua" ? "Semua" : "Belum dibaca"}
              </button>
            ))}
          </div>

          <Button variant="yellow" size="sm" onClick={markAllAsRead}>
            Tandai semua dibaca
          </Button>
        </div>

        {displayed.length === 0 ? (
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#4A5A80", padding: "20px 0" }}>
            {filter === "unread" ? "Tidak ada notifikasi yang belum dibaca." : "Belum ada notifikasi."}
          </p>
        ) : (
          <div>
            {displayed.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "2px dashed #C9B98F",
                  cursor: n.dibaca ? "default" : "pointer",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#D42A25",
                    border: "2px solid #0B2A6B",
                    flexShrink: 0,
                    marginTop: 6,
                    opacity: n.dibaca ? 0 : 1,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontFamily: FONT, fontSize: 14 }}>{n.judul}</b>
                    <span style={{ fontFamily: FONT, fontSize: 12, color: "#4A5A80" }}>{n.waktu}</span>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 13, marginTop: 4, color: "#0B2A6B" }}>
                    {n.pesan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}