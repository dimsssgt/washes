"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type KunciPengaturan = "info" | "jam" | "antar" | "pesanan" | "nota";

export interface PromoInput {
  nama: string;
  jenis: "persen" | "nominal";
  nilai: number;
  berlakuUntuk: "semua" | "tertentu";
  layanan: string[]; // berisi layanan_id
  minBelanja: number;
  maksPotongan: number | null;
  mulai: string; // "YYYY-MM-DDTHH:mm" (WIB)
  selesai: string;
  kuota: number | null;
  aktif: boolean;
  gambarUrl: string | null;
}

// Input datetime-local dianggap WIB (+07:00)
const keWaktu = (s: string) => new Date(`${s}:00+07:00`).toISOString();
const keInput = (iso: string) =>
  new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 16);

function kePromoRow(p: PromoInput) {
  return {
    nama: p.nama,
    jenis: p.jenis,
    nilai: p.nilai,
    berlaku_untuk: p.berlakuUntuk,
    min_belanja: p.minBelanja,
    maks_potongan: p.jenis === "persen" ? p.maksPotongan : null,
    mulai: keWaktu(p.mulai),
    selesai: keWaktu(p.selesai),
    kuota: p.kuota,
    aktif: p.aktif,
    gambar_url: p.gambarUrl,
  };
}

// Pengecekan wajib di setiap aksi: harus login, peran admin, dan akun aktif.
async function pastikanAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, pesan: "Belum login." };

  const { data: profil } = await supabase
    .from("profiles")
    .select("peran, aktif")
    .eq("id", user.id)
    .single();

  if (!profil || profil.peran !== "admin" || !profil.aktif) {
    return { ok: false as const, pesan: "Tidak diizinkan." };
  }
  return { ok: true as const, supabase };
}

const BATAS_GAMBAR = 2 * 1024 * 1024; // 2 MB
const TIPE_GAMBAR = ["image/jpeg", "image/png", "image/webp"];

export async function uploadGambarPromo(formData: FormData) {
  const cek = await pastikanAdmin();
  if (!cek.ok) return cek;
  const supabase = cek.supabase;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, pesan: "Tidak ada file." };
  }
  if (!TIPE_GAMBAR.includes(file.type)) {
    return { ok: false as const, pesan: "Format harus JPG, PNG, atau WebP." };
  }
  if (file.size > BATAS_GAMBAR) {
    return { ok: false as const, pesan: "Ukuran maksimal 2 MB." };
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("promo")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { ok: false as const, pesan: error.message };

  const { data } = supabase.storage.from("promo").getPublicUrl(path);
  return { ok: true as const, url: data.publicUrl };
}

export async function ambilPengaturan() {
  const cek = await pastikanAdmin();
  if (!cek.ok) throw new Error("Tidak diizinkan.");
  const supabase = cek.supabase;

  const [{ data: rows }, { data: layanan }, { data: promo }] = await Promise.all([
    supabase.from("pengaturan").select("kunci, nilai"),
    supabase.from("layanan").select("id, nama, aktif").eq("aktif", true).order("nama"),
    supabase.from("promo").select("*, promo_layanan(layanan_id)").order("mulai", { ascending: false }),
  ]);

  const map: Record<string, any> = Object.fromEntries((rows ?? []).map((r) => [r.kunci, r.nilai]));

  return {
    info: map.info,
    jam: map.jam,
    antar: map.antar,
    pesanan: map.pesanan,
    nota: map.nota,
    layanan: (layanan ?? []) as { id: string; nama: string; aktif: boolean }[],
    promo: (promo ?? []).map((p: any) => ({
      id: p.id as string,
      nama: p.nama as string,
      jenis: p.jenis as "persen" | "nominal",
      nilai: Number(p.nilai),
      berlakuUntuk: p.berlaku_untuk as "semua" | "tertentu",
      layanan: (p.promo_layanan ?? []).map((x: { layanan_id: string }) => x.layanan_id) as string[],
      minBelanja: Number(p.min_belanja),
      maksPotongan: p.maks_potongan == null ? null : Number(p.maks_potongan),
      mulai: keInput(p.mulai),
      selesai: keInput(p.selesai),
      kuota: p.kuota as number | null,
      aktif: p.aktif as boolean,
      gambarUrl: (p.gambar_url ?? null) as string | null,
    })),
  };
}

export type DataAwal = Awaited<ReturnType<typeof ambilPengaturan>>;

export async function simpanPengaturan(kunci: KunciPengaturan, nilai: unknown) {
  const cek = await pastikanAdmin();
  if (!cek.ok) return cek;
  const supabase = cek.supabase;

  const { error } = await supabase
    .from("pengaturan")
    .upsert({ kunci, nilai, diperbarui_at: new Date().toISOString() });
  if (error) return { ok: false as const, pesan: error.message };
  revalidatePath("/admin/pengaturan");
  return { ok: true as const };
}

export async function simpanPromo(id: string | null, input: PromoInput) {
  const cek = await pastikanAdmin();
  if (!cek.ok) return cek;
  const supabase = cek.supabase;

  const baris = kePromoRow(input);
  const layananIds = input.berlakuUntuk === "tertentu" ? input.layanan : [];

  let promoId = id;

  if (id) {
    const { error } = await supabase.from("promo").update(baris).eq("id", id);
    if (error) return { ok: false as const, pesan: error.message };

    const { error: errHapus } = await supabase.from("promo_layanan").delete().eq("promo_id", id);
    if (errHapus) return { ok: false as const, pesan: errHapus.message };
  } else {
    const { data, error } = await supabase.from("promo").insert(baris).select("id").single();
    if (error) return { ok: false as const, pesan: error.message };
    promoId = data.id as string;
  }

  if (layananIds.length > 0) {
    const { error } = await supabase
      .from("promo_layanan")
      .insert(layananIds.map((layanan_id) => ({ promo_id: promoId, layanan_id })));
    if (error) return { ok: false as const, pesan: error.message };
  }

  revalidatePath("/admin/pengaturan/promo");
  return { ok: true as const, id: promoId as string };
}

export async function ubahStatusPromo(id: string, aktif: boolean) {
  const cek = await pastikanAdmin();
  if (!cek.ok) return cek;
  const supabase = cek.supabase;

  const { error } = await supabase.from("promo").update({ aktif }).eq("id", id);
  if (error) return { ok: false as const, pesan: error.message };
  revalidatePath("/admin/pengaturan/promo");
  return { ok: true as const };
}

export async function hapusPromo(id: string) {
  const cek = await pastikanAdmin();
  if (!cek.ok) return cek;
  const supabase = cek.supabase;

  const { error } = await supabase.from("promo").delete().eq("id", id);
  if (error) return { ok: false as const, pesan: error.message };
  revalidatePath("/admin/pengaturan/promo");
  return { ok: true as const };
}