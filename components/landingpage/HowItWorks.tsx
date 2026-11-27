import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { STEPS } from "@/data/landing";

export default function HowItWorks() {
  return (
    <section id="panduan" className="border-b-[3px] border-ink bg-sun py-24 md:py-32">
      <div className="container-lk max-w-[1280px]">
        <SectionTitle className="mb-5 text-brand md:text-[84px]">
          Tinggal duduk manis
        </SectionTitle>
        <p className="mb-10 text-base md:mb-16">
          Empat langkah, cucian beres. Kamu cukup tunggu di rumah.
        </p>

        <ol className="grid grid-cols-2 gap-3 md:gap-9 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="card-brut flex min-h-[220px] flex-col bg-white px-4 py-5 transition-transform duration-200 hover:scale-105 cursor-pointer md:min-h-[360px] md:px-8 md:py-10"
            >
              <span className="mb-3 font-display text-[56px] leading-none text-brand md:mb-7 md:text-[104px]">
                {i + 1}
              </span>
              <h3 className="mb-2 mt-1 font-display text-base uppercase leading-tight md:mb-3.5 md:mt-2 md:text-2xl">
                {step.title}
              </h3>
              <p className="m-0 text-[12px] leading-relaxed md:text-[15px]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}