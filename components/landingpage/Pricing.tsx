"use client";

import { useState } from "react";
import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import Button from "@/components/landingpage/ui/Button";
import { PRICE_TABLES, SITE } from "@/data/landing";

export default function Pricing() {
  const [active, setActive] = useState(PRICE_TABLES[0].id);
  const table = PRICE_TABLES.find((t) => t.id === active) ?? PRICE_TABLES[0];

  return (
    <section id="harga" className="border-b-[3px] border-ink bg-cream py-40">
      <div className="container-lk">
        <SectionTitle className="mb-4 text-brand md:text-[80px]">Harga</SectionTitle>
        <p className="mb-10 max-w-[640px] text-ink text-lg">
          Pilih jenis laundry, lalu lihat harga dan kecepatannya. Harga belum
          termasuk antar jemput.
        </p>

        <div role="tablist" aria-label="Jenis laundry" className="mb-6 flex flex-wrap gap-2 md:mb-8 md:gap-4">
          {PRICE_TABLES.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(t.id)}
                className={`inline-flex min-h-10 items-center rounded-full border-2 border-ink px-4 font-display text-sm transition-all duration-200 hover:scale-105 md:min-h-14 md:px-9 md:text-base ${
                  selected ? "bg-brand text-white" : "bg-white text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="card-brut overflow-x-auto bg-white p-3 md:p-8">
          <table className="w-full min-w-[480px] border-collapse text-left font-mono md:min-w-[640px]">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="whitespace-pre-line border-b-2 border-dashed border-sand px-2 py-2 text-[10px] uppercase md:px-4 md:py-4 md:text-sm"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.name}>
                  <td className="border-b-2 border-dashed border-sand px-2 py-2 md:px-4 md:py-4">
                    <b className="text-[12px] md:text-[15px]">{row.name}</b>
                  </td>
                  {row.prices.map((p, i) => (
                    <td
                      key={i}
                      className={`border-b-2 border-dashed border-sand px-2 py-2 text-[12px] md:px-4 md:py-4 md:text-[15px] ${
                        i === 0 && table.id === "self" ? "" : "font-bold text-red"
                      }`}
                    >
                      {p}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 md:mt-12">
          <Button href={SITE.orderHref} variant="outline" className="text-base! min-h-14! px-10! transition-all duration-100 hover:scale-103 hover:bg-brand hover:text-white hover:shadow-none">
            Pesan sekarang
          </Button>
        </div>
      </div>
    </section>
  );
}