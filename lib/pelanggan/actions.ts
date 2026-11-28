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
      catatan: input.catatan.trim(),  
      metode_serah: antarJemput ? "diantar" : "ambil_sendiri",
      status: "masuk",
    })
    .select("id, kode")
    .single();

  if (error || !data) {
    console.error("[buatPesanan] insert gagal:", error);
    return {
      ok: false,
      error: "Pesanan gagal disimpan. Silakan coba lagi.",
    };
  }

  return { ok: true, id: data.id, kode: data.kode };
}

export type AntrianSaya = {
  kode: string;
  layanan: string;
  jadwalJemput: string;
};

const NAMA_LAYANAN: Record<string, string> = {
  kiloan: "Cuci Kiloan",
  satuan: "Cuci Satuan",
  linen: "Cuci Linen",
};

export async function ambilAntrianSaya(): Promise<AntrianSaya[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pesanan")
    .select("kode, jam_jemput, metode_serah, dibuat_at, layanan(kode)")
    .eq("pelanggan_id", user.id)
    .eq("status", "masuk")
    .order("dibuat_at", { ascending: true });

  if (error) {
    console.error("[ambilAntrianSaya] gagal:", error);
    return [];
  }

  return (data ?? []).map((p) => {
    const layanan = Array.isArray(p.layanan) ? p.layanan[0] : p.layanan;
    const jam = p.jam_jemput ? String(p.jam_jemput).slice(0, 5) : null;

    return {
      kode: p.kode,
      layanan: NAMA_LAYANAN[layanan?.kode ?? ""] ?? "-",
      jadwalJemput:
        p.metode_serah === "diantar" && jam
          ? `Jemput pukul ${jam}`
          : "Ambil sendiri",
    };
  });
}

export type NotifikasiSaya = {
  id: string;
  judul: string;
  waktu: string;
  pesan: string;
  dibaca: boolean;
};

const one = (v: any) => (Array.isArray(v) ? v[0] : v) ?? null;

function formatTanggal(iso: string | null | undefined) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}

export async function ambilRiwayatSaya(): Promise<
  {
    kode: string;
    tanggal: string;
    layanan: string;
    jumlah: string;
    total: number;
    status: string;
    invoiceNo: string;
    statusPesanan: string;
    dibayar: string;
    rincianLayanan: number;
    ongkir: number;
    alamat?: string;
    petugas?: string;
  }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pesanan")
    .select(`
      kode, dibuat_at, selesai_at, alamat_jemput,
      layanan:layanan_id (nama),
      penimbangan (berat_kg, jumlah_item, subtotal),
      transaksi (total, metode, dibayar_at),
      petugas:petugas_id (nama)
    `)
    .eq("pelanggan_id", user.id)
    .eq("status", "selesai")
    .order("dibuat_at", { ascending: false });

  if (error) {
    console.error("[ambilRiwayatSaya] gagal:", error);
    return [];
  }

  return (data ?? []).map((p: any) => {
    const layanan = one(p.layanan);
    const tim = one(p.penimbangan);
    const trx = one(p.transaksi);
    const petugas = one(p.petugas);

    const subtotal = tim?.subtotal ?? 0;
    const total = trx?.total ?? subtotal;
    const tglBayar = formatTanggal(trx?.dibayar_at);
    const tglSelesai = formatTanggal(p.selesai_at);
    const metode = trx?.metode ? String(trx.metode).toUpperCase() : "-";

    return {
      kode: p.kode,
      tanggal: formatTanggal(p.dibuat_at) ?? "-",
      layanan: layanan?.nama ?? "Layanan Laundry",
      jumlah: tim?.berat_kg
        ? `${tim.berat_kg} kg`
        : tim?.jumlah_item
        ? `${tim.jumlah_item} pcs`
        : "-",
      total,
      status: trx?.dibayar_at ? "Lunas" : "Belum lunas",
      invoiceNo: `INV-${p.kode}`,
      statusPesanan: tglSelesai ? `Selesai · ${tglSelesai}` : "Selesai",
      dibayar: tglBayar ? `${tglBayar} · ${metode}` : "-",
      rincianLayanan: subtotal,
      ongkir: Math.max(0, total - subtotal),
      alamat: p.alamat_jemput ?? undefined,
      petugas: petugas?.nama ?? undefined,
    };
  });
}

export async function ambilNotifikasiSaya(): Promise<NotifikasiSaya[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifikasi")
    .select("id, judul, isi, dibaca, dibuat_at")
    .eq("user_id", user.id)
    .order("dibuat_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[ambilNotifikasiSaya] gagal:", error);
    return [];
  }

  return (data ?? []).map((n) => ({
    id: n.id,
    judul: n.judul,
    pesan: n.isi,
    dibaca: n.dibaca,
    waktu: formatWaktu(n.dibuat_at),
  }));
}

export async function tandaNotifikasiDibaca(ids?: string[]): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  let query = supabase
    .from("notifikasi")
    .update({ dibaca: true })
    .eq("user_id", user.id)
    .eq("dibaca", false);

  if (ids && ids.length > 0) query = query.in("id", ids);

  const { error } = await query;
  if (error) {
    console.error("[tandaNotifikasiDibaca] gagal:", error);
    return false;
  }
  return true;
}

export type StatistikSaya = {
  pesananAktif: number;
  tagihanBelumBayar: number;
  totalPesanan: number;
};

export async function ambilStatistikSaya(): Promise<StatistikSaya> {
  const kosong: StatistikSaya = { pesananAktif: 0, tagihanBelumBayar: 0, totalPesanan: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return kosong;

  const { data, error } = await supabase
    .from("pesanan")
    .select("status, transaksi (total, dibayar_at)")
    .eq("pelanggan_id", user.id);

  if (error) {
    console.error("[ambilStatistikSaya] gagal:", error);
    return kosong;
  }

  const rows = (data ?? []) as any[];
  const bukanAktif = ["masuk", "selesai", "dibatalkan"];

  let tagihan = 0;
  for (const p of rows) {
    if (p.status === "dibatalkan") continue;
    for (const t of p.transaksi ?? []) {
      if (!t.dibayar_at) tagihan += t.total ?? 0;
    }
  }

  return {
    pesananAktif: rows.filter((p) => !bukanAktif.includes(p.status)).length,
    tagihanBelumBayar: tagihan,
    totalPesanan: rows.length,
  };
}

export async function ambilNamaSaya(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Pelanggan";

  const { data, error } = await supabase
    .from("profiles")
    .select("nama")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[ambilNamaSaya] gagal:", error);
    return "Pelanggan";
  }
  return data?.nama || "Pelanggan";
}