import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "blue" | "yellow" | "outline";

const variants: Record<Variant, string> = {
  blue: "bg-brand text-white",
  yellow: "bg-sun text-ink",
  outline: "bg-transparent text-ink shadow-[inset_0_0_0_2px_var(--color-ink)]",
};

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export default function Button({ href, variant = "blue", className = "", children }: Props) {
  return (
    <Link href={href} className={`btn-brut ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
