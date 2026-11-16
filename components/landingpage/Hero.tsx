import Image from "next/image";
import Button from "@/components/landingpage/ui/Button";
import { SITE } from "@/data/landing";

export default function Hero() {
  return (
    <section className="bg-grid py-20 md:min-h-[min(1950px,calc(109vh-85px))] md:py-0 md:flex md:items-center">
      <div className="container-lk grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="font-display text-[44px] uppercase leading-[0.98] text-brand md:text-[78px]">
            <span className="bg-paper px-1 box-decoration-clone">
              Laundry ramah di lingkungan
              <br />
              mu
            </span>
          </h1>
          <p className="my-7 inline-block max-w-[440px] bg-paper p-2 text-ink text-sm leading-relaxed">
            Jemput cuciannya, cuci bersih, antar kembali wangi dan rapi. Satu
            mesin untuk satu pelanggan, tanpa dicampur.
          </p>
          <div className="flex flex-wrap gap-3 ">
            <Button href="/login" className="transition-all duration-200 hover:scale-105">Pesan Sekarang</Button>
          </div>
        </div>

        <div className="relative flex min-h-[440px] items-center justify-center md:translate-x-[30px]">
          <div className="relative h-[420px] w-full max-w-[380px]">
            <div className="relative h-full w-full overflow-hidden rounded-t-[190px] rounded-b-[24px] border-[3px] border-ink shadow-brut">
              <Image
                src="/herolaundry.webp"
                alt="Maskot"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 380px"
                className="object-cover"
              />
            </div>
            <span className="chip absolute -left-4 top-12 -rotate-6 z-10 text-sm md:text-base px-4 py-2 shadow-brut-sm">
              Jemput maks. 30 menit
            </span>
            <span className="chip absolute -right-4 bottom-14 rotate-6 bg-white z-10 text-sm md:text-base px-4 py-2 shadow-brut-sm">
              Express 6 jam
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
