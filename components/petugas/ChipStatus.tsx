import { LABEL_TAHAP, type Tahap } from "@/lib/petugas/pengerjaan";

const WARNA: Record<Tahap, string> = {
  ditimbang: "y",
  dicuci: "b",
  disetrika: "",
  siap: "g",
  selesai: "g",
};

export function ChipTahap({ tahap }: { tahap: Tahap }) {
  return <span className={`chip ${WARNA[tahap]}`.trim()}>{LABEL_TAHAP[tahap]}</span>;
}

export function ChipBayar({ lunas }: { lunas: boolean }) {
  return <span className={`chip ${lunas ? "g" : "r"}`}>{lunas ? "Lunas" : "Belum bayar"}</span>;
}
