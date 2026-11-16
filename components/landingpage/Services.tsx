"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { SERVICES } from "@/data/landing";

const NAV_TOP = 80; // posisi header saat menempel, di bawah navbar
const TAB_H = 30;
const GAP = 10;
const CARD_BOTTOM = 24; // jarak kartu ke bawah layar
const DESKTOP_MIN = 860;
const CARD_BG = ["bg-cream", "bg-white", "bg-sun"];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Services() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const header = headerRef.current;
    const spacer = spacerRef.current;
    const stack = stackRef.current;
    if (!wrap || !header || !spacer || !stack) return;

    const desktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const slots = Array.from(stack.querySelectorAll<HTMLElement>("[data-slot]"));
    let ticking = false;

    const resetStyles = () => {
      for (const slot of slots) {
        const card = slot.querySelector<HTMLElement>("[data-card]");
        const text = slot.querySelector<HTMLElement>("[data-text]");
        if (card) card.style.transform = "";
        if (text) text.style.filter = "";
      }
    };

    const update = () => {
      ticking = false;
      const scrollY = window.scrollY;

      // Progress bar
      const bar = progressRef.current;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;

      // Ukur header, lalu atur spacer dan posisi sticky kartu dari tinggi itu
      const hH = header.offsetHeight;
      spacer.style.height = `${hH}px`;
      const cardTop = NAV_TOP + hH + TAB_H + GAP;
      wrap.style.setProperty("--card-top", `${cardTop}px`);

      // Header menempel di NAV_TOP, lalu naik bersama kartu terakhir
      const wrapDocTop = wrap.getBoundingClientRect().top + scrollY;
      const wrapH = wrap.offsetHeight;
      const last = slots[slots.length - 1];
      if (last) {
        const lastDocTop = last.getBoundingClientRect().top + scrollY;
        let hDoc = Math.max(wrapDocTop, scrollY + NAV_TOP);
        hDoc = Math.min(hDoc, lastDocTop - TAB_H - GAP - hH);
        hDoc = Math.min(hDoc, wrapDocTop + wrapH - hH);
        header.style.top = `${hDoc - wrapDocTop}px`;
      }

      // Efek scale dan redup hanya di desktop dan jika tidak reduced motion
      if (reduced.matches || !desktop.matches) {
        resetStyles();
        return;
      }

      slots.forEach((slot, i) => {
        const H = slot.offsetHeight;
        const card = slot.querySelector<HTMLElement>("[data-card]");
        const text = slot.querySelector<HTMLElement>("[data-text]");

        // Kartu tertutup kartu berikutnya: mengecil dan meredup
        let p = 0;
        const next = slots[i + 1];
        if (next) {
          const nextRectTop = next.getBoundingClientRect().top;
          p = clamp(1 - (nextRectTop - cardTop) / H);
        }
        if (card) card.style.transform = `scale(${1 - 0.05 * p})`;
        if (text) text.style.filter = `brightness(${1 - 0.5 * p})`;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const ro = new ResizeObserver(onScroll);
    ro.observe(header);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    reduced.addEventListener("change", onScroll);
    update();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      reduced.removeEventListener("change", onScroll);
    };
  }, []);

  const wrapStyle = {
    "--card-top": "224px",
  } as CSSProperties;

  const cardStyle = {
    top: "var(--card-top)",
    height: `calc(100svh - var(--card-top) - ${CARD_BOTTOM}px)`,
  } as CSSProperties;

  return (
    <section id="layanan" className="bg-brand py-20 md:py-[150px]">
      <div
        ref={progressRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-0 bg-sun"
      />

      <div className="container-lk">
        <div ref={wrapRef} className="relative" style={wrapStyle}>
          {/* Header: tinggi mengikuti isi, diukur dari JS. Posisinya diatur JS. */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 top-0 z-30 flex flex-col justify-center bg-brand px-4 py-4 text-center"
          >
            <SectionTitle className="mb-2 text-[28px]! text-sun md:mb-3 md:text-[64px]!">
              Cek layanan kami
            </SectionTitle>
            <p className="text-sm text-white md:text-base">
              Pilih layanan yang sesuai kebutuhanmu. Semua dikerjakan dengan sabar.
            </p>
          </div>

          {/* Spacer sama tinggi dengan header, diatur JS */}
          <div ref={spacerRef} aria-hidden="true" />

          <div ref={stackRef} className="flex flex-col pt-4 min-[860px]:pt-8">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                data-slot
                className="sticky mb-[50svh] last:mb-0 min-[860px]:mb-[25vh] relative"
                style={{ ...cardStyle, zIndex: i + 1 }}
              >
                <article
                  data-card
                  className={`relative h-full origin-top rounded-[20px] border-2 border-ink shadow-brut ${CARD_BG[i % CARD_BG.length]}`}
                >
                  {/* Tab berjejer dari kiri. Mobile: angka saja. Desktop: "Layanan N". */}
                  <div
                    style={{ "--tab-i": i } as CSSProperties}
                    className="absolute -top-[30px] left-[calc(1rem+var(--tab-i)*3.25rem)] flex h-[30px] w-[48px] items-center justify-center rounded-t-[12px] border-2 border-b-0 border-ink bg-sun font-mono text-xs font-bold uppercase text-ink min-[860px]:left-[calc(2rem+var(--tab-i)*8rem)] min-[860px]:w-[116px]"
                  >
                    <span className="hidden min-[860px]:inline">Layanan&nbsp;</span>
                    {i + 1}
                  </div>

                  <div className="flex h-full flex-col gap-3 p-4 md:p-10 min-[860px]:flex-row min-[860px]:items-center min-[860px]:gap-8">
                    {/* Gambar: mobile 60% tinggi kartu (di atas), desktop kotak (di kanan) */}
                    <div className="order-1 flex min-h-0 w-full flex-[3] items-center justify-center min-[860px]:order-2 min-[860px]:w-1/2 min-[860px]:flex-none">
                      <div className="relative h-full w-full overflow-hidden rounded-[20px] border-2 border-ink bg-paper min-[860px]:aspect-square min-[860px]:h-auto min-[860px]:max-w-[380px]">
                        <Image
                          src={service.image}
                          alt={service.imageAlt}
                          fill
                          sizes="(min-width: 860px) 380px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Teks: mobile 40% tinggi kartu (di bawah), desktop kiri */}
                    <div
                      data-text
                      className="order-2 flex min-h-0 flex-[2] flex-col gap-2 overflow-hidden min-[860px]:order-1 min-[860px]:w-1/2 min-[860px]:flex-none min-[860px]:gap-5 min-[860px]:pr-6"
                    >
                      <div>
                        <span className="block font-mono text-xs font-bold uppercase text-brand">
                          {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")} · {service.tagline}
                        </span>
                        <h3 className="mb-1 mt-2 font-display text-[28px] uppercase leading-[0.98] text-ink md:mb-3 md:text-[64px]">
                          {service.title}
                        </h3>
                        <p className="line-clamp-3 text-xs leading-snug text-ink md:line-clamp-none md:text-lg md:leading-relaxed">
                          {service.lead}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-mono text-xs uppercase text-muted">
                          {service.highlight.label}
                        </span>
                        <span className="font-display text-xl uppercase text-brand">
                          {service.highlight.value}
                        </span>
                      </div>

                      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 md:gap-2">
                        {service.points.map((point) => (
                          <li
                            key={point}
                            className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-[11px] font-bold text-ink md:gap-1.5 md:px-3 md:py-1 md:text-sm"
                          >
                            <span aria-hidden="true" className="text-brand">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            ))}

            {/* Ruang kosong setinggi kartu agar kartu terakhir bisa menempel penuh sampai akhir */}
            <div aria-hidden="true" style={{ height: cardStyle.height }} />
          </div>
        </div>
      </div>
    </section>
  );
}