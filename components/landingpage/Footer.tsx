import Button from "@/components/landingpage/ui/Button";
import { SITE } from "@/data/landing";

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t-[3px] border-ink bg-sun text-ink">
      <div className="container-lk flex flex-wrap items-end justify-between gap-8">
        <div>
          <h2 className="mb-5 py-10 font-display text-4xl uppercase leading-tight text-brand">
            Cucian bersih,
            <br />
            tinggal satu klik.
          </h2>
          <Button href={SITE.orderHref}>Pesan Sekarang</Button>
        </div>
        <div className="space-y-1 leading-loose">
          <p className="m-0">WhatsApp {SITE.whatsapp}</p>
          <p className="m-0">Buka setiap hari 07.00–20.00</p>
          <p className="m-0">{SITE.address}</p>
          <p className="m-0">© 2026 {SITE.name}</p>
        </div>
      </div>
      <div
        aria-hidden
        className="whitespace-nowrap font-display text-[120px] uppercase leading-none text-outline mt-10 ml-7 md:text-[210px] [-webkit-text-stroke:3px_var(--color-brand)] translate-y-6 md:translate-y-10 select-none"
      >
        Laundyku
      </div>
    </footer>
  );
}
