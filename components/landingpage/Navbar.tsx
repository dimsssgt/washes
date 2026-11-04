import Link from "next/link";
import { NAV_LINKS } from "@/data/landing";
import Button from "@/components/landingpage/ui/Button";

export default function Navbar() {
  return (
    <header className="border-b-2 border-ink bg-cream">
      <div className="container-lk max-w-[100rem]! px-6 xl:px-10 flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-display text-[22px] uppercase leading-none text-brand">
          Laundy
          <br />
          ku
        </Link>

        <nav className="hidden gap-6 text-sm font-bold uppercase lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="inline-block transition-transform duration-200 hover:scale-110"
              href={link.href}

            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span
            title="Notifikasi"
            aria-label="Notifikasi"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink transition-all duration-200 hover:scale-110 hover:bg-sun cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-ink bg-red" />
          </span>
          <Button href="/login" className="min-h-11! py-2.5! px-5! text-xs">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
