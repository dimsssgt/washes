"use client";

import { useState } from "react";
import { HOURS } from "@/data/landing";
import { cekStatusPesanan, type HasilCekStatus } from "@/lib/status/actions";

// Tahap yang ditampilkan ke pelanggan, berurutan
const TAHAP = [
  "Menunggu jemput",
  "Pesanan diterima",
  "Cucian ditimbang",
  "Sedang dicuci",
  "Sedang disetrika",
  "Siap diantar/diambil",
  "Selesai",
];

// Setiap nilai enum dipetakan ke indeks tahap di atas
const TAHAP_AKTIF: Record<string, number> = {
  menunggu_jemput: 0,
  silahkan_ke_lokasi: 0,
  masuk: 1,
  diterima: 1,
  ditimbang: 2,
  menunggu_bayar: 2,
  dicuci: 3,
  disetrika: 4,
  siap_diambil: 5,
  selesai: 6,
};

const CATATAN: Record<string, string> = {
  silahkan_ke_lokasi: "Kurir sedang menuju lokasi",
  menunggu_bayar: "Menunggu pembayaran",
};

function bangunTahap(status: string) {
  const aktif = TAHAP_AKTIF[status] ?? 0;
  return TAHAP.map((label, i) => ({
    label,
    state: status === "selesai" || i < aktif ? "done" : i === aktif ? "active" : "todo",
  })) as { label: string; state: "done" | "active" | "todo" }[];
}

export default function OrderStatus() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilCekStatus | null>(null);

  async function handleCek(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setHasil(await cekStatusPesanan(code));
    setLoading(false);
  }

  return (
    <div id="status" className="card-brut border-ink bg-brand text-white">
      <h2 className="mb-3 font-display text-4xl uppercase leading-tight text-sun">
        Cek status pesanan
      </h2>
      <p className="mb-2">Masukkan kode pesanan dari nota atau WhatsApp.</p>

      <form className="mt-4" onSubmit={handleCek}>
        <label htmlFor="kode" className="mb-1.5 block text-xs font-bold uppercase">
          Kode pesanan
        </label>
        <div className="flex flex-wrap gap-2.5">
          <input
            id="kode"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (!e.target.value.trim()) setHasil(null);
            }}
            placeholder="Contoh: LDY-20261028-014"
            autoComplete="off"
            className="min-w-[180px] flex-1 rounded-xl border-2 border-ink bg-white px-4 py-3 text-sm text-ink placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="btn-brut bg-sun text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Mengecek..." : "Cek"}
          </button>
        </div>
      </form>

      {hasil && !hasil.ok && (
        <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm">{hasil.pesan}</p>
      )}

      {hasil && hasil.ok && hasil.data.status === "dibatalkan" && (
        <div className="mt-6 rounded-2xl bg-cream p-[18px] text-ink">
          <b>{hasil.data.kode}</b>
          <p className="mt-2 text-sm font-bold text-red">Pesanan ini dibatalkan.</p>
          <p className="mt-1 text-sm">Hubungi kami jika ini tidak sesuai.</p>
        </div>
      )}

      {hasil && hasil.ok && hasil.data.status !== "dibatalkan" && (
        <div className="mt-6 rounded-2xl bg-cream p-[18px] text-ink">
          <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
            <b>{hasil.data.kode}</b>
            <span>
              {hasil.data.layanan}
              {hasil.data.durasi ? ` · ${hasil.data.durasi}` : ""}
            </span>
          </div>
          <ul className="space-y-1.5">
            {bangunTahap(hasil.data.status).map((s) => (
              <li
                key={s.label}
                className={
                  s.state === "done" ? "" : s.state === "active" ? "font-bold text-red" : "text-muted"
                }
              >
                {s.state === "done" ? "✔" : s.state === "active" ? "●" : "○"} {s.label}
                {s.state === "active" && CATATAN[hasil.data.status] ? ` · ${CATATAN[hasil.data.status]}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function OperatingHours() {
  return (
    <div id="jam" className="card-brut bg-white">
      <h2 className="mb-5 font-display text-4xl uppercase leading-tight text-brand">
        Jam operasional
      </h2>
      <ul>
        {HOURS.map((h) => (
          <li
            key={h.day}
            className="flex justify-between border-b-2 border-dashed border-sand py-3.5"
          >
            <span>{h.day}</span>
            <b>{h.time}</b>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs">
        Order terakhir 1 jam sebelum tutup. Jam contoh, sesuaikan dengan usahamu.
      </p>
    </div>
  );
}