import Image from "next/image";
import Button from "@/components/landingpage/ui/Button";
import { SITE } from "@/data/landing";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-[3px] border-ink text-ink bg-sun">
      {/* Background Image: scene.webp */}
      <div className="absolute inset-x-0 bottom-0 z-0 aspect-video">
        <Image
          src="/scene.webp"
          alt="Footer Background Scene"
          fill
          quality={100}
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      <div className="container-lk flex flex-wrap items-end justify-between gap-8 relative z-10 pt-12 md:pt-16">
        <div>
          <h2 className="mb-5 font-display text-4xl uppercase leading-tight text-brand">
            Cucian bersih,
            <br />
            tinggal satu klik.
          </h2>
          <Button href={SITE.orderHref}>Pesan Sekarang</Button>
        </div>
        <div className="space-y-1 leading-loose font-medium">
          <p className="m-0">WhatsApp {SITE.whatsapp}</p>
          <p className="m-0">Buka setiap hari</p>
          <p className="m-0">{SITE.address}</p>
          <p className="m-0">© 2026 {SITE.name}</p>
        </div>
      </div>
      <div
        aria-hidden
        className="whitespace-nowrap font-display text-[120px] uppercase leading-none text-outline mt-10 ml-7 md:text-[210px] [-webkit-text-stroke:3px_var(--color-brand)] translate-y-6 md:translate-y-10 select-none relative z-10"
      >
        Washes
      </div>
    </footer>
  );
}
