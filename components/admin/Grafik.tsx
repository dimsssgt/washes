"use client";

import type { ReactNode } from "react";
import { batasAtas, deltaTone, formatRibu, teksPersen } from "@/lib/admin/ringkasan";

export function Pill({
  tone = "netral",
  children,
}: {
  tone?: "naik" | "turun" | "netral" | "biru" | "kuning";
  children: ReactNode;
}) {
  return <span className={`ad-pill ${tone}`}>{children}</span>;
}

/** Kartu ringkasan: judul, angka besar, persen perubahan, dan garis kecil. */
export function KartuKpi({
  judul,
  tag,
  nilai,
  delta,
  spark,
  warna = "#12805c",
}: {
  judul: string;
  tag: string;
  nilai: string;
  delta: number | null;
  spark?: number[] | null;
  warna?: string;
}) {
  return (
    <div className="ad-kartu kecil ad-kpi">
      <div className="ad-kpi-atas">
        <span>{judul}</span>
        <span className="ad-kpi-tag">{tag}</span>
      </div>
      <div className="ad-kpi-nilai">{nilai}</div>
      <div className="ad-kpi-delta">
        <Pill tone={deltaTone(delta)}>{teksPersen(delta)}</Pill>
        <span>vs periode sebelumnya</span>
      </div>
      {spark && spark.length > 1 && <Sparkline nilai={spark} warna={warna} />}
    </div>
  );
}

export function Sparkline({ nilai, warna = "#12805c" }: { nilai: number[]; warna?: string }) {
  const W = 200;
  const H = 40;
  const maks = Math.max(...nilai, 1);
  const min = Math.min(...nilai, 0);
  const rentang = maks - min || 1;
  const titik = nilai
    .map((v, i) => `${(i / (nilai.length - 1)) * W},${H - ((v - min) / rentang) * (H - 6) - 3}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={titik} fill="none" stroke={warna} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Grafik garis dengan sumbu Y ber-label dan sumbu X yang dijarangkan. */
export function LineChart({ nilai, label }: { nilai: number[]; label: string[] }) {
  const W = 640;
  const H = 240;
  const KIRI = 48;
  const ATAS = 12;
  const BAWAH = 28;
  const maks = batasAtas(Math.max(0, ...nilai));
  const x = (i: number) => KIRI + (nilai.length <= 1 ? 0 : (i / (nilai.length - 1)) * (W - KIRI - 12));
  const y = (v: number) => ATAS + (1 - v / maks) * (H - ATAS - BAWAH);
  const titik = nilai.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const garisBantu = [0, 1 / 3, 2 / 3, 1].map((f) => maks * f);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Grafik pendapatan">
      {garisBantu.map((v, i) => (
        <g key={i}>
          <line x1={KIRI} x2={W - 12} y1={y(v)} y2={y(v)} stroke="#eceef3" />
          <text x={KIRI - 8} y={y(v) + 4} textAnchor="end" className="ad-sumbu">
            {formatRibu(v)}
          </text>
        </g>
      ))}
      <polyline points={titik} fill="none" stroke="#1457d6" strokeWidth={2.5} strokeLinejoin="round" />
      {nilai.map((_, i) => (
        <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="ad-sumbu">
          {label[i]}
        </text>
      ))}
    </svg>
  );
}

export interface Irisan {
  label: string;
  nilai: number;
  warna: string;
}

/** Donut dengan angka di tengah. Setiap irisan dibuat dari lingkaran dengan dash array. */
export function Donut({ irisan, pusat, sub }: { irisan: Irisan[]; pusat: string; sub: string }) {
  const R = 60;
  const K = 2 * Math.PI * R;
  const total = irisan.reduce((s, i) => s + i.nilai, 0);
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" width={170} height={170} role="img" aria-label={`${sub} ${pusat}`}>
      <circle cx={80} cy={80} r={R} fill="none" stroke="#eef0f5" strokeWidth={18} />
      {total > 0 &&
        irisan.map((i) => {
          const panjang = (i.nilai / total) * K;
          const el = (
            <circle
              key={i.label}
              cx={80}
              cy={80}
              r={R}
              fill="none"
              stroke={i.warna}
              strokeWidth={18}
              strokeDasharray={`${panjang} ${K - panjang}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += panjang;
          return el;
        })}
      <text x={80} y={80} textAnchor="middle" className="ad-donut-angka">
        {pusat}
      </text>
      <text x={80} y={100} textAnchor="middle" className="ad-donut-sub">
        {sub}
      </text>
    </svg>
  );
}