import SectionTitle from "@/components/landingpage/ui/SectionTitle";
import { SERVICES } from "@/data/landing";

export default function Services() {
  return (
    <section id="layanan" className="bg-brand py-20 md:py-[150px]">
      <div className="container-lk">
        <SectionTitle className="mb-3 text-center text-sun md:text-[64px]">
          Cek layanan kami
        </SectionTitle>
        <p className="mb-12 text-center text-white">
          Pilih layanan yang sesuai kebutuhanmu. Semua dikerjakan dengan sabar.
        </p>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <article key={service.title} className="card-brut transition-transform duration-200 hover:scale-105 cursor-pointer">
              <div className="font-display text-[13px] text-brand">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-2.5 mt-1.5 font-display text-[26px] uppercase leading-tight">
                {service.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed">{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
