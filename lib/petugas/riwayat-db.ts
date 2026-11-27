import { createClient } from "@/lib/supabase/server";
import type { RiwayatPenyerahan } from "./riwayat";

export async function ambilRiwayatSelesai(): Promise<RiwayatPenyerahan[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pesanan")
    .select("kode, selesai_at, layanan_id, penerima, metode_serah, transaksi(total, metode), layanan(nama)")
    .eq("status", "selesai")
    .order("selesai_at", { ascending: false });

  if (error || !data) return null;

  return data.map((p: any) => ({
    kode: p.kode,
    diserahkan: p.selesai_at.slice(0, 10),
    pelanggan: p.penerima ?? "—",
    layanan: p.layanan?.nama ?? "—",
    total: p.transaksi?.total ?? 0,
    metodeSerah: p.metode_serah === "diantar" ? "Diantar" : "Ambil sendiri",
    metodeBayar: p.transaksi?.metode ?? "Tunai",
  }));
}