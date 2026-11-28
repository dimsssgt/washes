"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type TitikLokasi = { lat: number; lng: number };

// Titik awal peta sebelum pelanggan memilih lokasi.
// Ganti dengan koordinat area layanan kamu.
const PUSAT_AWAL: TitikLokasi = { lat: -6.9932, lng: 110.4203 };

const FONT = "var(--font-poppins), 'Poppins', Arial, sans-serif";

interface Props {
  nilai: TitikLokasi | null;
  onChange: (t: TitikLokasi) => void;
  onAlamatDitemukan?: (alamat: string) => void;
}

function buatIkonPenanda() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:22px;height:22px;background:#FFD21F;
      border:3px solid #0B2A6B;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);box-shadow:2px 2px 0 #0B2A6B;"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

export default function PetaPilihLokasi({ nilai, onChange, onAlamatDitemukan }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [status, setStatus] = useState("");

  // Buat peta sekali saat komponen muncul
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const awal = nilai ?? PUSAT_AWAL;
    const map = L.map(containerRef.current).setView(
      [awal.lat, awal.lng],
      nilai ? 16 : 13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const marker = L.marker([awal.lat, awal.lng], {
      draggable: true,
      icon: buatIkonPenanda(),
    }).addTo(map);

    marker.on("dragend", () => {
      const p = marker.getLatLng();
      onChangeRef.current({ lat: p.lat, lng: p.lng });
    });

    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    if (!nilai) onChangeRef.current({ lat: awal.lat, lng: awal.lng });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  function pindahKe(t: TitikLokasi, zoom?: number) {
    markerRef.current?.setLatLng([t.lat, t.lng]);
    mapRef.current?.setView([t.lat, t.lng], zoom ?? mapRef.current.getZoom());
    onChangeRef.current(t);
  }

  function pakaiLokasiSaya() {
    if (!navigator.geolocation) {
      setStatus("Browser ini tidak mendukung lokasi.");
      return;
    }
    setStatus("Mencari lokasi kamu...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pindahKe({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 17);
        setStatus("");
      },
      () => setStatus("Lokasi tidak bisa diakses. Geser penanda secara manual."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function isiAlamatDariTitik() {
    if (!nilai || !onAlamatDitemukan) return;
    setStatus("Mengambil alamat dari peta...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=id&lat=${nilai.lat}&lon=${nilai.lng}`
      );
      const json = await res.json();
      if (json.display_name) {
        onAlamatDitemukan(json.display_name);
        setStatus("Alamat diisi. Silakan periksa dan lengkapi nomor rumah.");
      } else {
        setStatus("Alamat tidak ditemukan. Isi manual.");
      }
    } catch {
      setStatus("Gagal mengambil alamat. Isi manual.");
    }
  }

  const btn: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 999,
    border: "2px solid #0B2A6B",
    background: "#FFF4DE",
    color: "#0B2A6B",
    cursor: "pointer",
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          height: 260,
          width: "100%",
          border: "2px solid #0B2A6B",
          borderRadius: 14,
          overflow: "hidden",
        }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
        <button type="button" onClick={pakaiLokasiSaya} style={btn}>
          Lokasi saya
        </button>
        <button
          type="button"
          onClick={isiAlamatDariTitik}
          disabled={!nilai}
          style={{ ...btn, opacity: nilai ? 1 : 0.5 }}
        >
          Isi alamat dari peta
        </button>
        <span style={{ fontFamily: FONT, fontSize: 12, color: "#4A5A80" }}>
          {status ||
            (nilai
              ? `Titik: ${nilai.lat.toFixed(5)}, ${nilai.lng.toFixed(5)}`
              : "Klik peta atau geser penanda untuk memilih lokasi jemput.")}
        </span>
      </div>
    </div>
  );
}