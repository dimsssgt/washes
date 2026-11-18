import Image from "next/image";
import Button from "@/components/landingpage/ui/Button";

const HERO_IMAGE = "/hero/hero.webp";
const HERO_ALT = "Maskot Washes duduk di antara tumpukan pakaian dan mesin cuci";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper">
      {/* Mobile: foto full screen, konten di atasnya */}
      <div className="relative flex min-h-[100svh] flex-col md:hidden">
        <Image
          src={HERO_IMAGE}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />

        <div className="flex flex-1 flex-col px-6 pb-8 pt-24">
          <span className="chip self-start -rotate-2 bg-white px-4 py-2 text-xs uppercase shadow-brut-sm">
            Satu mesin, satu pelanggan
          </span>

          <h1 className="mt-6 font-display text-[60px] uppercase leading-[1.05] text-brand">
            You Leave It,
            <br />
            We Clean It
          </h1>

          <div className="mt-auto flex flex-col gap-7">
            <div className="flex items-center justify-between">
              <span className="chip -rotate-4 bg-sun px-4 py-2 text-xs uppercase shadow-brut-sm">
                Jemput maks. 30 menit
              </span>
              <span className="chip rotate-4 bg-white px-4 py-2 text-xs uppercase shadow-brut-sm">
                Express 6 jam
              </span>
            </div>
            <Button href="/login" className="w-full transition-all duration-200 active:scale-95">
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: foto full viewport, susunan teks mengikuti desain */}
      <div className="relative hidden h-[100svh] md:block">
        <Image
          src={HERO_IMAGE}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />

        <h1 className="absolute left-0 right-0 top-[90px] text-center font-display text-[72px] uppercase leading-[1.02] text-brand">
          You Leave It,
          <br />
          We Clean It
        </h1>

        <span className="chip absolute left-[27%] top-[350px] -rotate-2 bg-white px-5 py-2 text-sm uppercase shadow-brut-sm">
          Satu mesin, satu pelanggan
        </span>
        <span className="chip absolute left-[27%] top-[430px] -rotate-2 bg-sun px-5 py-2.5 text-base uppercase shadow-brut-sm">
          Jemput maks. 30 menit
        </span>
        <span className="chip absolute left-[27%] top-[510px] -rotate-4 bg-white px-4 py-2 text-sm uppercase shadow-brut-sm">
          Express 6 jam
        </span>

        <div className="absolute bottom-[66px] left-1/2 z-10 -translate-x-1/2">
          <Button href="/login" className="h-14 px-16 text-base transition-all duration-200 hover:scale-105">
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </section>
  );
}