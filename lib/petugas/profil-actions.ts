"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type HasilSimpan = { ok: true } | { ok: false; pesan: string };

const REGEX_WA = /^[0-9+\-\s]{9,16}$/;

export async function simpanProfilPetugas(
  _prev: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  const nama = String(formData.get("nama") ?? "").trim();
  const noWaMentah = String(formData.get("noWa") ?? "").trim();

  if (nama.length < 2 || nama.length > 60) {
    return { ok: false, pesan: "Nama harus 2 sampai 60 karakter." };
  }
  if (noWaMentah !== "" && !REGEX_WA.test(noWaMentah)) {
    return { ok: false, pesan: "Nomor WA tidak valid (9 sampai 16 angka)." };
  }
  const noWa = noWaMentah === "" ? null : noWaMentah;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, pesan: "Sesi habis. Silakan login lagi." };

  const { error } = await supabase
    .from("profiles")
    .update({ nama, no_wa: noWa })
    .eq("id", user.id);

  if (error) {
    // 23505 = nilai unik sudah dipakai (no_wa punya constraint UNIQUE)
    if (error.code === "23505") {
      return { ok: false, pesan: "Nomor WA ini sudah dipakai akun lain." };
    }
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/petugas", "layout");
  return { ok: true };
}