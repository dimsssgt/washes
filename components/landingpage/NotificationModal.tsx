"use client";

import { useEffect } from "react";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  judul: string;
  waktu: string;
  pesan: string;
  dibaca: boolean;
}

const defaultNotifications: NotificationItem[] = [
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
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = defaultNotifications,
}: NotificationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop blur halus di sekitarnya saat notifikasi terbuka */}
      <div
        className="fixed inset-0 z-40 bg-[#0B2A6B]/20 backdrop-blur-[3px] transition-all duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Pop-up Notifikasi: Menempel di atas dekat tombol notifikasi */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifikasi-title"
        className="fixed left-4 right-4 top-[74px] z-50 mx-auto max-w-[440px] sm:absolute sm:top-full sm:mt-3 sm:right-[-40px] md:right-0 sm:left-auto sm:w-[440px] sm:mx-0 transition-all duration-150"
      >
        <div
          className="card"
          style={{
            width: "100%",
            background: "#fff",
            border: "2px solid #0B2A6B",
            borderRadius: 18,
            boxShadow: "6px 6px 0 #0B2A6B",
            padding: 24,
            boxSizing: "border-box",
            fontFamily: "'Space Mono', monospace",
            color: "#0B2A6B",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <h2
              id="notifikasi-title"
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                margin: 0,
                fontSize: 22,
                color: "#1457D6",
              }}
            >
              Notifikasi
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Notifikasi"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFD21F",
                color: "#0B2A6B",
                fontFamily: "'Archivo Black', sans-serif",
                textTransform: "uppercase",
                fontSize: 14,
                padding: 0,
                width: 40,
                minWidth: 40,
                height: 40,
                minHeight: 40,
                borderRadius: 999,
                border: 0,
                boxShadow: "inset 0 0 0 2px #0B2A6B",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ✕
            </button>
          </div>

          {/* List Notifikasi */}
          <div style={{ marginTop: 8 }}>
            {notifications.map((item) => (
              <Link
                key={item.id}
                href="/pelanggan/notifikasi"
                onClick={onClose}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 8px",
                  margin: "0 -8px",
                  borderRadius: 12,
                  borderBottom: "2px dashed #C9B98F",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF4DE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Dot merah untuk unread */}
                <span
                  aria-hidden="true"
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#D42A25",
                    border: "2px solid #0B2A6B",
                    flexShrink: 0,
                    marginTop: 6,
                    opacity: item.dibaca ? 0 : 1,
                    boxSizing: "border-box",
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "baseline",
                    }}
                  >
                    <b style={{ color: "#0B2A6B", fontSize: 13, fontWeight: 700 }}>
                      {item.judul}
                    </b>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 12,
                        color: "#4A5A80",
                      }}
                    >
                      {item.waktu}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 13,
                      marginTop: 4,
                      lineHeight: 1.5,
                      color: "#0B2A6B",
                    }}
                  >
                    {item.pesan}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 18,
            }}
          >
            <Link
              href="/pelanggan/notifikasi"
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1457D6",
                color: "#fff",
                fontFamily: "'Archivo Black', sans-serif",
                textTransform: "uppercase",
                fontSize: 13,
                padding: "10px 20px",
                borderRadius: 999,
                minHeight: 44,
                border: 0,
                boxShadow: "2px 2px 0 #0B2A6B",
                cursor: "pointer",
                boxSizing: "border-box",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0d44b0";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1457D6";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Lihat semua →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
