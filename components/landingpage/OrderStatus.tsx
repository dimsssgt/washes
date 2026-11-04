"use client";

import { useState } from "react";
import { HOURS, SAMPLE_CODE, SAMPLE_STATUS } from "@/data/landing";

export default function OrderStatus() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [checked, setChecked] = useState(true);

  return (
    <div id="status" className="card-brut border-ink bg-brand text-white">
      <h2 className="mb-3 font-display text-4xl uppercase leading-tight text-sun">
        Cek status pesanan
      </h2>
      <p className="mb-2">Masukkan kode pesanan dari nota atau WhatsApp.</p>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <label htmlFor="kode" className="mb-1.5 block text-xs font-bold uppercase">
          Kode pesanan
        </label>
        <div className="flex flex-wrap gap-2.5">
          <input
            id="kode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-w-[180px] flex-1 rounded-xl border-2 border-ink bg-white px-4 py-3 text-sm text-ink"
          />
          <button type="submit" className="btn-brut bg-sun text-ink">
            Cek
          </button>
        </div>
      </form>

      {checked && (
        <ul className="mt-6 space-y-1.5 rounded-2xl bg-cream p-[18px] text-ink">
          {SAMPLE_STATUS.map((s) => (
            <li
              key={s.label}
              className={
                s.state === "done"
                  ? ""
                  : s.state === "active"
                    ? "font-bold text-red"
                    : "text-muted"
              }
            >
              {s.state === "done" ? "✔" : s.state === "active" ? "●" : "○"} {s.label}
              {s.note ? ` · ${s.note}` : ""}
            </li>
          ))}
        </ul>
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
