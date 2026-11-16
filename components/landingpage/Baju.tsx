"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react";
import type { PanInfo } from "motion/react";

const LABELS = [
  "Pilihan Layanan",
  "Cuci Lipat",
  "Cuci Setrika",
  "Reward Spesial",
  "Higienis 100%",
  "Keuntungan",
  "Laundry Mudah",
  "Desain Elegan",
  "Pengguna Kasual",
  "Gunakan Klins",
];

const REST = 84; // lebar slot saat rapat
const OPEN = 200; // lebar slot saat terbuka
const IMG_W = 180;
const IMG_H = 279;
const SPLIT = "15%"; // garis pivot: di atas tetap, di bawah ikut berayun

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const SPRING = { type: "spring" as const, stiffness: 150, damping: 13 };

type GarmentProps = {
  id: number;
  label: string;
  index: number;
  isOpen: boolean;
  isFlipped: boolean;
  setRef: (el: HTMLDivElement | null) => void;
};

function Garment({ id, label, index, isOpen, isFlipped, setRef }: GarmentProps) {
  const open = useMotionValue(0); 
  const flip = useMotionValue(0); 
  const swing = useMotionValue(0); 
  const idle = useMotionValue(0); 

  useAnimationFrame((t) => {
    const s = t / 1000;
    idle.set(Math.sin(s * 1.1 + index) * 0.6 + Math.sin(s * 2.3 + index * 1.7) * 0.25);
  });

  useEffect(() => {
    animate(open, isOpen ? 1 : 0, SPRING);
    if (isOpen) {
      const c = swing.get();
      animate(swing, [c, 5, -3, 1.5, 0], { duration: 1.1, ease: "easeOut" });
    }
  }, [isOpen, open, swing]);

  const mounted = useRef(false);
  useEffect(() => {
    animate(flip, isFlipped ? 1 : 0, { type: "spring", stiffness: 120, damping: 11 });
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const c = swing.get();
    animate(swing, [c, 6, -4, 0], { duration: 0.9, ease: "easeOut" });
  }, [isFlipped, flip, swing]);

  const sideRot = useTransform(open, (o: number) => o * 90);
  const frontRot = useTransform([open, flip], (v: number[]) => -(1 - v[0]) * 90 + v[1] * 180);
  const backRot = useTransform([open, flip], (v: number[]) => -(1 - v[0]) * 90 + v[1] * 180 - 180);
  const skew = useTransform([swing, idle, open], (v: number[]) => {
    const [s, i, o] = v;
    return clamp(s, -10, 10) * 0.6 + i * (0.7 + 0.5 * clamp(o, 0, 1)) * 0.8;
  });
  const tagOpacity = useTransform(open, (o: number) => clamp(1 - o * 1.4, 0, 1));

  const layer = (src: string, rot: typeof sideRot, part: "top" | "bot") => {
    const isTop = part === "top";
    return (
      <motion.img
        src={src}
        alt={label}
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none"
        style={{
          width: IMG_W,
          height: IMG_H,
          rotateY: rot,
          skewX: isTop ? 0 : skew,
          clipPath: isTop ? `inset(0 0 ${100 - 15}% 0)` : `inset(${SPLIT} 0 0 0)`,
          transformOrigin: isTop ? "50% 0%" : `50% ${SPLIT}`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
    );
  };

  const base = `/baju/${id}`;

  return (
    <motion.div
      ref={setRef}
      className="relative h-[340px] shrink-0"
      initial={{ width: REST, y: -70, opacity: 0 }}
      animate={{ width: isOpen ? OPEN : REST, y: 0, opacity: 1 }}
      transition={{
        width: SPRING,
        y: { delay: 0.12 + index * 0.09, type: "spring", stiffness: 90, damping: 14 },
        opacity: { delay: 0.12 + index * 0.09, duration: 0.4 },
      }}
    >
      <div className="absolute inset-0" style={{ perspective: 1000 }}>
        {layer(`${base}.1.webp`, sideRot, "top")}
        {layer(`${base}.1.webp`, sideRot, "bot")}
        {layer(`${base}.2.webp`, frontRot, "top")}
        {layer(`${base}.2.webp`, frontRot, "bot")}
        {layer(`${base}.3.webp`, backRot, "top")}
        {layer(`${base}.3.webp`, backRot, "bot")}
      </div>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[74px] -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-[13px] font-bold shadow-md"
        style={{ opacity: tagOpacity }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

function MobileGarmentSlider() {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const x = useMotionValue(0);

  // Center the active garment: garments before it are REST wide, active garment is OPEN wide
  const goTo = useCallback(
    (idx: number, flip = false) => {
      setFlipped(flip);
      setCurrent(idx);
      const container = containerRef.current;
      if (!container) return;
      const halfContainer = container.offsetWidth / 2;
      // All garments before idx are REST, active is OPEN
      const targetCenter = idx * REST + OPEN / 2;
      animate(x, halfContainer - targetCenter, SPRING);
    },
    [x],
  );

  // Center on mount after layout
  useEffect(() => {
    const id = requestAnimationFrame(() => goTo(0));
    return () => cancelAnimationFrame(id);
  }, [goTo]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold && current < LABELS.length - 1) {
      goTo(current + 1);
    } else if (info.offset.x > threshold && current > 0) {
      goTo(current - 1);
    } else {
      goTo(current, flipped);
    }
  };

  return (
    <div className="md:hidden">
      {/* Rail */}
      <div className="mx-6 h-3 rounded-full bg-gradient-to-b from-[#8b9bb0] to-[#3b4a5e] shadow-md" />

      {/* Draggable garment row */}
      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="flex cursor-grab items-start active:cursor-grabbing"
          onClick={() => {
            if (flipped !== undefined) setFlipped((f) => !f);
          }}
        >
          {LABELS.map((label, i) => (
            <Garment
              key={label}
              id={i + 1}
              label={label}
              index={i}
              isOpen={current === i}
              isFlipped={current === i && flipped}
              setRef={(el: HTMLDivElement | null) => {
                itemRefs.current[i] = el;
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {LABELS.map((_, i) => (
          <motion.button
            key={i}
            aria-label={`Baju ke-${i + 1}`}
            onClick={() => goTo(i)}
            animate={{
              width: i === current ? 20 : 8,
              backgroundColor: i === current ? "#1457D6" : "#CBD5E1",
            }}
            transition={{ duration: 0.25 }}
            style={{ height: 8, borderRadius: 4, border: "none", padding: 0, cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BajuShowcase() {
  const [active, setActive] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (items.length === 0) return;
    const first = items[0].getBoundingClientRect();
    const last = items[items.length - 1].getBoundingClientRect();

    let idx = -1;
    if (e.clientX < first.left) idx = 0;
    else if (e.clientX >= last.right) idx = items.length - 1;
    else {
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX < r.right) idx = i;
      });
    }
    if (idx >= 0 && idx !== active) {
      setFlipped(false);
      setActive(idx);
    }
  }

  function handleLeave() {
    setActive(null);
    setFlipped(false);
  }

  return (
    <section className="bg-grid py-20">
      <div className="container-lk">
        {/* Mobile: slider */}
        <MobileGarmentSlider />

        {/* Desktop: interactive 3D showcase */}
        <div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onClick={() => {
            if (active !== null) setFlipped((f) => !f);
          }}
          className="mx-auto hidden w-full max-w-[1000px] cursor-pointer select-none md:block"
        >
          <div className="h-3 rounded-full bg-gradient-to-b from-[#8b9bb0] to-[#3b4a5e] shadow-md" />
          <div ref={rowRef} className="flex items-start justify-center">
            {LABELS.map((label, i) => (
              <Garment
                key={label}
                id={i + 1}
                label={label}
                index={i}
                isOpen={active === i}
                isFlipped={active === i && flipped}
                setRef={(el: HTMLDivElement | null) => {
                  itemRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
