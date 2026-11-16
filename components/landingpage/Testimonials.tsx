"use client";

import { useEffect, useRef } from "react";
import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { TESTIMONIALS } from "@/data/landing";

const AUTO_SPEED = 50; // px per detik, bergerak ke kiri
const FRICTION = 0.05; // makin kecil, momentum setelah drag makin cepat berhenti

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function TestimonialCard({ quote, name }: { quote: string; name: string }) {
  return (
    <figure className="m-0 flex w-[300px] shrink-0 select-text flex-col justify-between rounded-[20px] border-2 border-ink bg-white p-6 shadow-brut transition-transform duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-ink)] sm:w-[360px]">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-lg tracking-wider text-[#E0A800]" aria-label="Bintang lima">
            ★★★★★
          </span>
          <span className="font-display text-6xl leading-none text-brand" aria-hidden="true">
            “
          </span>
        </div>
        <blockquote className="mb-5 mt-2 text-sm leading-relaxed text-ink">
          {quote}
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3 border-t-2 border-dashed border-sand pt-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-brand font-display text-sm text-sun"
        >
          {initials(name)}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-bold text-ink">{name}</span>
          <span className="font-mono text-[11px] uppercase text-muted">
            Pelanggan Laundyku
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let x = 0; // posisi track, negatif = bergeser ke kiri
    let halfW = 0; // lebar satu loop
    let velocity = 0; // px per detik, untuk momentum setelah drag
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let lastT = 0;
    let last = 0;
    let raf = 0;

    const measure = () => {
      halfW = track.scrollWidth / 2;
    };

    // Jaga x tetap dalam rentang [-halfW, 0) agar loop selalu tersambung
    const wrap = () => {
      if (halfW <= 0) return;
      x = (((x % halfW) + halfW) % halfW) - halfW;
    };

    const apply = () => {
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 0;
      last = now;

      if (!dragging) {
        if (Math.abs(velocity) > 2) {
          // Momentum setelah drag, melambat perlahan
          x += velocity * dt;
          velocity *= Math.pow(FRICTION, dt);
        } else {
          velocity = 0;
          // Gerak otomatis, berhenti saat hover atau reduced motion
          if (!hovering && !reduced.matches) x -= AUTO_SPEED * dt;
        }
        wrap();
        apply();
      }

      raf = requestAnimationFrame(frame);
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      velocity = 0;
      lastX = e.clientX;
      lastT = e.timeStamp;
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dt = Math.max(1, e.timeStamp - lastT);
      x += dx;
      velocity = (dx / dt) * 1000;
      lastX = e.clientX;
      lastT = e.timeStamp;
      wrap();
      apply();
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (viewport.hasPointerCapture(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
      viewport.classList.remove("cursor-grabbing");
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = false;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="overflow-hidden border-b-[3px] border-ink bg-white py-32 md:py-40">
      <div className="container-lk mb-11">
        <SectionTitle className="mb-3 text-center text-brand md:text-[64px]">
          Apa kata pelanggan?
        </SectionTitle>
        <p className="text-center text-ink">
          Cerita singkat dari pelanggan yang sudah mencoba layanan kami.
        </p>
      </div>

      {/* Area geser: touch-pan-y agar scroll halaman vertikal tetap jalan di HP */}
      <div
        ref={viewportRef}
        className="cursor-grab touch-pan-y select-none overflow-hidden py-4"
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {/* Loop 1 */}
          <div className="flex gap-7 pr-7">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={`a-${i}`} quote={t.quote} name={t.name} />
            ))}
          </div>

          {/* Loop 2: duplikasi untuk loop tanpa putus, disembunyikan dari screen reader */}
          <div className="flex gap-7 pr-7" aria-hidden="true">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={`b-${i}`} quote={t.quote} name={t.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}