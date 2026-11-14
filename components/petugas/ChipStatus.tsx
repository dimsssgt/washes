import { LABEL_TAHAP, type Tahap } from "@/lib/petugas/pengerjaan";
import { adaSelisihTerbuka, adaSelisihTerverifikasi, type PesananAlur } from "@/lib/petugas/alur";

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

/** Status pengecekan jumlah: aman, perlu verifikasi, atau selisih sudah diverifikasi. */
export function ChipJumlah({ pesanan }: { pesanan: PesananAlur }) {
  if (adaSelisihTerbuka(pesanan)) return <span className="chip r">Perlu verifikasi</span>;
  if (adaSelisihTerverifikasi(pesanan)) return <span className="chip y">Selisih terverifikasi</span>;
  return <span className="chip g">Jumlah aman</span>;
}
