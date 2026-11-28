import { createClient } from "@/lib/supabase/server";
import type { JenisLayanan, PesananMasuk, WaktuCuci } from "./types";

const KODE_KE_LAYANAN: Record<string, JenisLayanan> = {
  kiloan: "Kiloan",
  satuan: "Satuan",
  linen: "Linen",
};

const WAKTU_VALID: WaktuCuci[] = [
  "Express 6 jam",
  "Quick 3 jam",
  "One Day 24 jam",
  "Reguler 3 hari",
];

type BarisPesanan = {
  kode: string;
  alamat_jemput: string;
  jam_jemput: string;
  catatan: string;
  layanan: { kode: string } | null;
  waktu: { nama: string } | null;
  profil: { nama: string; no_wa: string | null } | null;
};

export async function ambilPesananMasuk(): Promise<PesananMasuk[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pesanan")
    .select(
      "kode, alamat_jemput, jam_jemput, catatan, layanan:layanan_id(kode), waktu:waktu_cuci_id(nama), profil:pelanggan_id(nama, no_wa)",
    )
    .eq("status", "masuk")
    .order("dibuat_at", { ascending: true });

  if (error || !data) return [];

  return (data as unknown as BarisPesanan[]).map((p) => {
    const waktu = p.waktu?.nama as WaktuCuci | undefined;
    return {
      kode: p.kode,
      pelanggan: p.profil?.nama ?? "-",
      noWa: p.profil?.no_wa ?? "-",
      alamatJemput: p.alamat_jemput,
      layanan: KODE_KE_LAYANAN[p.layanan?.kode ?? ""] ?? "Kiloan",
      waktuCuci: waktu && WAKTU_VALID.includes(waktu) ? waktu : "Reguler 3 hari",
      jamJemput: p.jam_jemput,
      catatan: p.catatan ?? "",
    };
  });
}