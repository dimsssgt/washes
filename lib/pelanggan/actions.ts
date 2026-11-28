"use server";

import { createClient } from "@/lib/supabase/server";

export type LayananKode = "kiloan" | "satuan" | "linen";

export type WaktuCuci = { id: string; nama: string; durasiJam: number };

export type ItemKatalog = {
  id: string;
  nama: string;
  unit: string;
  hargaPerWaktu: Record<string, number>;
};

export type Katalog = {
  layananId: Record<LayananKode, string>;
  waktu: WaktuCuci[]; // urut durasi terpanjang dulu
  waktuPerLayanan: Record<LayananKode, string[]>; // id waktu yang tersedia per layanan
  items: Record<"satuan" | "linen", ItemKatalog[]>;
};

export type HasilKatalog = { ok: true; katalog: Katalog } | { ok: false; error: string };

export async function ambilKatalog(): Promise<HasilKatalog> {
  const supabase = await createClient();

  const [layananRes, waktuRes, hargaRes, itemRes, itemHargaRes] = await Promise.all([
    supabase.from("layanan").select("id, kode").eq("aktif", true),
    supabase
      .from("waktu_cuci")
      .select("id, nama, durasi_jam")
      .eq("aktif", true)
      .order("durasi_jam", { ascending: false }),
    supabase.from("harga").select("layanan_id, waktu_cuci_id"),
    supabase
      .from("item_layanan")
      .select("id, layanan_id, nama, unit, urutan")
      .eq("aktif", true)
      .order("urutan"),
    supabase.from("item_harga").select("item_id, waktu_cuci_id, harga"),
  ]);

  const hasil = [layananRes, waktuRes, hargaRes, itemRes, itemHargaRes];
  if (hasil.some((r) => r.error || !r.data)) {
    return { ok: false, error: "Daftar layanan gagal dimuat." };
  }

  const idByKode = new Map(layananRes.data!.map((l) => [String(l.kode), l.id]));
  const kiloanId = idByKode.get("kiloan");
  const satuanId = idByKode.get("satuan");
  const linenId = idByKode.get("linen");
  if (!kiloanId || !satuanId || !linenId) {
    return { ok: false, error: "Data layanan belum lengkap." };
  }

  const layananId: Record<LayananKode, string> = {
    kiloan: kiloanId,
    satuan: satuanId,
    linen: linenId,
  };

  const waktu: WaktuCuci[] = waktuRes.data!.map((w) => ({
    id: w.id,
    nama: w.nama,
    durasiJam: w.durasi_jam,
  }));
  const waktuAktif = new Set(waktu.map((w) => w.id));

  // Harga per item, dikelompokkan per item_id
  const hargaByItem = new Map<string, Record<string, number>>();
  for (const row of itemHargaRes.data!) {
    const cur = hargaByItem.get(row.item_id) ?? {};
    cur[row.waktu_cuci_id] = row.harga;
    hargaByItem.set(row.item_id, cur);
  }

  const items: Record<"satuan" | "linen", ItemKatalog[]> = { satuan: [], linen: [] };
  const waktuDipakai: Record<LayananKode, Set<string>> = {
    kiloan: new Set(),
    satuan: new Set(),
    linen: new Set(),
  };

  for (const it of itemRes.data!) {
    const kode: "satuan" | "linen" | null =
      it.layanan_id === satuanId ? "satuan" : it.layanan_id === linenId ? "linen" : null;
    if (!kode) continue;

    const hargaPerWaktu = hargaByItem.get(it.id) ?? {};
    items[kode].push({ id: it.id, nama: it.nama, unit: it.unit, hargaPerWaktu });
    Object.keys(hargaPerWaktu).forEach((w) => waktuDipakai[kode].add(w));
  }

  for (const h of hargaRes.data!) {
    if (h.layanan_id === kiloanId) waktuDipakai.kiloan.add(h.waktu_cuci_id);
  }

  const waktuPerLayanan: Record<LayananKode, string[]> = {
    kiloan: [...waktuDipakai.kiloan].filter((id) => waktuAktif.has(id)),
    satuan: [...waktuDipakai.satuan].filter((id) => waktuAktif.has(id)),
    linen: [...waktuDipakai.linen].filter((id) => waktuAktif.has(id)),
  };

  return {
    ok: true,
    katalog: { layananId, waktu, waktuPerLayanan, items },
  };
}

export type InputPesananPelanggan = {
  layananId: string;
  waktuCuciId: string;
  metode: "antar-jemput" | "drop-mandiri";
  alamat: string;
  jamJemput: string;
  catatan: string;
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