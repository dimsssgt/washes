"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface NotificationItem {
  id: string;
  judul: string;
  waktu: string;
  pesan: string;
  dibaca: boolean;
}

const dummyNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    judul: "Pesanan diterima petugas",
    waktu: "2 menit lalu",
    pesan: "LDY-20261030-016 sudah diterima dan akan ditimbang.",
    dibaca: false,
  },
  {
    id: "notif-2",
    judul: "Cucian siap diambil",
    waktu: "1 jam lalu",
    pesan: "LDY-20261028-014 sudah selesai dan siap diantar atau diambil.",
    dibaca: false,
  },
  {
    id: "notif-3",
    judul: "Tagihan belum dibayar",
    waktu: "Kemarin, 16.30",
    pesan: "LDY-20261029-015 menunggu pembayaran via QRIS.",
    dibaca: true,
  },
  {
    id: "notif-4",
    judul: "Status diperbarui",
    waktu: "Kemarin, 09.10",
    pesan: "LDY-20261029-015 masuk tahap Sedang dicuci.",
    dibaca: true,
  },
];

export default function NotifikasiClient() {
  const [filter, setFilter] = useState<"semua" | "unread">("semua");
  const [list, setList] = useState(dummyNotifications);

  const displayed = filter === "semua" ? list : list.filter((n) => !n.dibaca);

  function markAllAsRead() {
    setList((prev) => prev.map((n) => ({ ...n, dibaca: true })));
  }

  function toggleRead(id: string) {
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dibaca: !n.dibaca } : n))
    );
  }

  return (
    <>
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
            <button
              onClick={() => setFilter("semua")}
              style={{
                display: "inline-block",
                border: "2px solid #0B2A6B",
                borderRadius: 999,
                padding: "6px 14px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: filter === "semua" ? "#1457D6" : "#FFF4DE",
                color: filter === "semua" ? "#fff" : "#0B2A6B",
                transition: "all 0.15s",
              }}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("unread")}
              style={{
                display: "inline-block",
                border: "2px solid #0B2A6B",
                borderRadius: 999,
                padding: "6px 14px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: filter === "unread" ? "#1457D6" : "#FFF4DE",
                color: filter === "unread" ? "#fff" : "#0B2A6B",
                transition: "all 0.15s",
              }}
            >
              Belum dibaca
            </button>
          </div>

          <Button variant="yellow" size="sm" onClick={markAllAsRead}>
            Tandai semua dibaca
          </Button>
        </div>

        {displayed.length === 0 ? (
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#4A5A80", padding: "20px 0" }}>
            Tidak ada notifikasi {filter === "unread" ? "yang belum dibaca" : ""}.
          </p>
        ) : (
          <div>
            {displayed.map((n) => (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "2px dashed #C9B98F",
                  cursor: "pointer",
                }}
              >
                {/* Status Dot */}
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
                    <b style={{ fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{n.judul}</b>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#4A5A80" }}>
                      {n.waktu}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, marginTop: 4, color: "#0B2A6B" }}>
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
