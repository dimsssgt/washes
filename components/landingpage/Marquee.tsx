const TEXT =
  "Antar jemput · Express · Cek status · Antar jemput · Express · Cek status · ";

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-brand py-8">
      <div
        className="flex whitespace-nowrap -rotate-2"
        style={{ animation: "marquee-scroll 18s linear infinite" }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-outline font-display text-[40px] uppercase leading-none md:text-[80px] pr-16"
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
