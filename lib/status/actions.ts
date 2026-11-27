"use server";

import { createClient } from "@/lib/supabase/server";

// Sesuaikan dengan format kode di database
const FORMAT_KODE = /^LDY-\d{8}-\d{3}$/;

export type HasilCekStatus =
  | {
      ok: true;
      data: {
        kode: string;
        status: string;
        layanan: string;
        durasi: string;
        dibuatAt: string;
        selesaiAt: string | null;
      };
    }
  | { ok: false; pesan: string };

export async function cekStatusPesanan(kodeMentah: string): Promise<HasilCekStatus> {
  const kode = kodeMentah.trim().toUpperCase();
  if (!FORMAT_KODE.test(kode)) {
    return { ok: false, pesan: "Format kode tidak sesuai, contoh: LDY-20261028-014." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cek_status_pesanan", { kode_input: kode });
  if (error) return { ok: false, pesan: "Gagal mengecek status, coba lagi." };

  const row = data?.[0];
  if (!row) return { ok: false, pesan: "Kode pesanan tidak ditemukan." };

  return {
    ok: true,
    data: {
      kode: row.kode,
      status: row.status,
      layanan: row.layanan ?? "",
      durasi: row.durasi ?? "",
      dibuatAt: row.dibuat_at,
      selesaiAt: row.selesai_at,
    },
  };
}