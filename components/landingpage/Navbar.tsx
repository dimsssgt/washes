import Link from "next/link";
import { NAV_LINKS } from "@/data/landing";
import Button from "@/components/landingpage/ui/Button";
import AccountMenu from "@/components/landingpage/AccountMenu";
import NotificationButton from "@/components/landingpage/NotificationButton";
import { getSessionName } from "@/feat/auth/session-server";

export default async function Navbar() {
  const name = await getSessionName();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream">
      <div className="container-lk max-w-[100rem]! px-6 xl:px-10 flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-display text-[22px] uppercase leading-none text-brand">
          Laundy
          <br />
          ku
        </Link>

        <nav className="hidden text-ink gap-6 text-sm font-bold uppercase lg:flex">
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
          <NotificationButton />
          {name ? (
            <AccountMenu name={name} />
          ) : (
            <Button href="/login" className="min-h-11! py-2.5! px-5! text-xs">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
