import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionTitle({ children, className = "" }: Props) {
  return (
    <h2
      className={`font-display text-4xl leading-[0.98] uppercase md:text-6xl ${className}`}
    >
      {children}
    </h2>
  );
}
