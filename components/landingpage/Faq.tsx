import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { FAQ } from "@/data/landing";

export default function Faq() {
  return (
    <section className="bg-brand border-ink py-60">
      <div className="container-lk max-w-[1000px]">
        <SectionTitle className="mb-9 text-sun md:text-[56px]">
          Pertanyaan umum
        </SectionTitle>

        <div className="space-y-10">
          {FAQ.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <details
                key={item.q}
                open={i === 0}
                className={`group rounded-2xl border-2 border-ink bg-cream px-5 py-4 text-ink shadow-brut transition-all duration-200 hover:scale-105 hover:border-sun hover:rotate-0 cursor-pointer open:border-sun ${
                  isLeft ? "-rotate-1" : "rotate-1"
                }`}
              >
                <summary className="cursor-pointer font-display text-[15px] uppercase list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Ikon Papan Penunjuk Arah (Signpost) */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-sun text-ink shadow-[2px_2px_0_var(--color-ink)]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Tiang penunjuk arah */}
                        <path d="M12 3v18" />
                        {/* Papan arah atas */}
                        <path d="M12 5h5l3 2.5-3 2.5h-5z" />
                        {/* Papan arah bawah */}
                        <path d="M12 12H7L4 14.5 7 17h5z" />
                      </svg>
                    </span>
                    <span className="leading-snug">{item.q}</span>
                  </div>

                  {/* Panah Penunjuk Arah (Berputar saat dibuka) */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_var(--color-ink)] transition-transform duration-200 group-open:rotate-90 group-open:bg-sun">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </summary>

                <div className="mt-4 border-t-2 border-dashed border-ink/30 pt-3 pl-12">
                  <p className="mb-0 text-sm leading-relaxed text-ink font-sans">
                    {item.a}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
