import Button from "@/components/landingpage/ui/Button";
import { SITE } from "@/data/landing";

export default function Footer() {
  return (
    <footer
      className="relative isolate flex min-h-[700px] flex-col overflow-hidden border-t-[3px] border-ink text-ink md:min-h-[820px]"
      style={{
        backgroundImage: "url(/scene.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundColor: "transparent",
      }}
    >
      <div className="container-lk flex flex-col pt-12 md:pt-16">
        <div>
          <h2 className="mb-5 font-display text-4xl uppercase leading-tight text-brand md:text-6xl">
            Cucian bersih,
            <br />
            tinggal satu klik.
          </h2>
          <Button href={SITE.orderHref}>Pesan Sekarang</Button>
        </div>

        <div className="mt-8 w-fit space-y-1 rounded-xl bg-white/80 px-4 py-3 font-medium leading-loose md:mt-10">
          <p className="m-0">WhatsApp {SITE.whatsapp}</p>
          <p className="m-0">Buka setiap hari</p>
          <p className="m-0">{SITE.address}</p>
          <p className="m-0">© 2026 {SITE.name}</p>
        </div>
      </div>

      <div
        aria-hidden
        className="mt-auto ml-4 whitespace-nowrap font-display text-[19vw] uppercase leading-none text-outline select-none [-webkit-text-stroke:3px_var(--color-brand)] md:ml-7 md:text-[210px]"
      >
        Washes
      </div>
    </footer>
  );
}