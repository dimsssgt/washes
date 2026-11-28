"use server";

import { createClient } from "@/lib/supabase/server";

export type InputPesananPelanggan = {
  metode: "antar-jemput" | "drop-mandiri";
  alamat: string;
  jamJemput: string;
  catatan: string;
  layananId: string;
  waktuCuciId: string;
};

export type HasilBuatPesanan =
  | { ok: true; id: string; kode: string }
  | { ok: false; error: string };

export async function buatPesanan(input: InputPesananPelanggan): Promise<HasilBuatPesanan> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Silakan masuk terlebih dahulu." };
  }

  if (!input.layananId || !input.waktuCuciId) {
    return { ok: false, error: "Layanan belum lengkap. Silakan pilih ulang." };
  }

  const antarJemput = input.metode === "antar-jemput";
  if (antarJemput && !input.alamat.trim()) {
    return { ok: false, error: "Alamat jemput wajib diisi." };
  }
  if (antarJemput && !input.jamJemput) {
    return { ok: false, error: "Jam jemput wajib diisi." };
  }

  const { data, error } = await supabase
    .from("pesanan")
    .insert({
      pelanggan_id: user.id,
      layanan_id: input.layananId,
      waktu_cuci_id: input.waktuCuciId,
      alamat_jemput: antarJemput ? input.alamat.trim() : null,
      jam_jemput: antarJemput ? input.jamJemput : null,
      catatan: input.catatan.trim() || null,
      metode_serah: antarJemput ? "diantar" : "ambil_sendiri",
      status: "masuk",
    })
    .select("id, kode")
    .single();

  if (error || !data) {
    return { ok: false, error: "Pesanan gagal disimpan. Silakan coba lagi." };
  }

  return { ok: true, id: data.id, kode: data.kode };
}