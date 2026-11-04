import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { TESTIMONIALS } from "@/data/landing";

export default function Testimonials() {
  return (
    <section className="border-y-[3px] border-ink bg-cream py-20 overflow-hidden">
      <div className="container-lk mb-11">
        <SectionTitle className="text-center text-brand md:text-[56px]">
          Apa kata pelanggan?
        </SectionTitle>
      </div>

      {/* Marquee slider container */}
      <div className="overflow-hidden py-3">
        <div
          className="flex w-max hover:[animation-play-state:paused]"
          style={{ animation: "marquee-scroll 32s linear infinite" }}
        >
          {/* Loop 1 */}
          <div className="flex gap-7 pr-7">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={i}
                className="card-brut m-0 w-[300px] sm:w-[360px] shrink-0 bg-white border-2 border-white hover:border-brand hover:shadow-[6px_6px_0_var(--color-brand)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-lg text-[#E0A800]" aria-label="Bintang lima">
                    ★★★★★
                  </div>
                  <blockquote className="my-3 text-sm leading-relaxed">“{t.quote}”</blockquote>
                </div>
                <figcaption className="text-sm font-bold text-ink">{t.name}</figcaption>
              </figure>
            ))}
          </div>

          {/* Loop 2 (duplikasi untuk seamless loop) */}
          <div className="flex gap-7 pr-7" aria-hidden="true">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={`dup-${i}`}
                className="card-brut m-0 w-[300px] sm:w-[360px] shrink-0 bg-white border-2 border-white hover:border-brand hover:shadow-[6px_6px_0_var(--color-brand)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-lg text-[#E0A800]" aria-label="Bintang lima">
                    ★★★★★
                  </div>
                  <blockquote className="my-3 text-sm leading-relaxed">“{t.quote}”</blockquote>
                </div>
                <figcaption className="text-sm font-bold text-ink">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
