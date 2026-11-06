const TEXT =
  "Kiloan · Satuan · Linen · Self Service · Kiloan · Satuan · Linen · Self Service ";

export default function Marquee1() {
  return (
    <div className="overflow-hidden bg-cream py-8 border-t-[3px] border-ink">
      <div
        className="flex whitespace-nowrap rotate-2"
        style={{ animation: "marquee-scroll 18s linear infinite" }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-display text-[40px] uppercase leading-none md:text-[80px] pr-16"
            style={{ color: "transparent", WebkitTextStroke: "2px #1457d6" }}
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
