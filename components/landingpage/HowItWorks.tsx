import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { STEPS } from "@/data/landing";

export default function HowItWorks() {
  return (
    <section id="panduan" className="border-b-[3px] border-ink bg-sun py-24 md:py-32">
      <div className="container-lk max-w-[1280px]">
        <SectionTitle className="mb-5 text-brand md:text-[84px]">
          Tinggal duduk manis
        </SectionTitle>
        <p className="mb-16 text-base">
          Empat langkah, cucian beres. Kamu cukup tunggu di rumah.
        </p>

        <ol className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="card-brut flex min-h-[360px] flex-col bg-white px-8 py-10 transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <span className="mb-7 font-display text-[104px] leading-none text-brand">
                {i + 1}
              </span>
              <h3 className="mb-3.5 mt-2 font-display text-2xl uppercase leading-tight">
                {step.title}
              </h3>
              <p className="m-0 text-[15px] leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
