import { createClient } from "@/lib/supabase/server";
import type { Bagian, Jejak, PesananAlur } from "./alur";
import type { Tahap } from "./pengerjaan";

// Status yang menunggu diterima tiap bagian
const STATUS_UNTUK_BAGIAN: Record<Bagian, string[]> = {
  front_office: ["masuk"],
  pencuci: ["ditimbang"],
  penyetrika: ["dicuci"],
};

const STATUS_AKTIF = ["ditimbang", "dicuci", "disetrika", "siap_diambil"];

export async function ambilAntrianBagian(bagian: Bagian) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pesanan")
    .select("kode, status, layanan:layanan_id(kode), waktu:waktu_cuci_id(nama), profil:pelanggan_id(nama)")
    .in("status", STATUS_UNTUK_BAGIAN[bagian])
    .order("dibuat_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function catatSerahTerima(params: {
  kode: string;
  bagian: Bagian;
  jumlahDihitung: number;
  catatan: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, pesan: "Sesi habis." };

  const { data: pesanan } = await supabase
    .from("pesanan")
    .select("id, status")
    .eq("kode", params.kode)
    .single();
  if (!pesanan) return { ok: false as const, pesan: "Pesanan tidak ditemukan." };

  const ke = pesanan.status === "ditimbang" ? "dicuci" : "disetrika";

  const { data: jumlahAcuan } = await supabase
    .from("penimbangan")
    .select("jumlah_item")
    .eq("pesanan_id", pesanan.id)
    .single();
  const tercatat = jumlahAcuan?.jumlah_item ?? 0;
  const sesuai = params.jumlahDihitung === tercatat;

  if (!sesuai && params.catatan.trim() === "") {
    return { ok: false as const, pesan: "Jumlah tidak sama. Isi catatan selisih." };
  }

  const { error: e1 } = await supabase.from("serah_terima").insert({
    pesanan_id: pesanan.id,
    jenis: "serah_terima",
    bagian: params.bagian,
    petugas_id: user.id,
    ke_status: ke,
    jumlah_tercatat: tercatat,
    jumlah_dihitung: params.jumlahDihitung,
    catatan: params.catatan.trim(),
  });
  if (e1) return { ok: false as const, pesan: e1.message };

  // Trigger pesanan_jaga_status akan menolak jika langkah tidak sah
  const { error: e2 } = await supabase.from("pesanan").update({ status: ke }).eq("id", pesanan.id);
  if (e2) return { ok: false as const, pesan: e2.message };

  return { ok: true as const };
}

export async function ambilPesananAktif(): Promise<PesananAlur[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("pesanan")
    .select(`
      id, kode, status, metode_serah, penerima, selesai_at,
      layanan:layanan_id(kode, nama),
      profil:pelanggan_id(nama),
      penimbangan(jumlah_item, subtotal, berat_kg),
      serah_terima(jenis, bagian, petugas:petugas_id(nama), waktu, ke_status,
                   jumlah_tercatat, jumlah_dihitung, catatan,
                   verifikasi_oleh, verifikasi_at, verifikasi_catatan, jumlah_acuan_baru)
    `)
    .in("status", STATUS_AKTIF)
    .order("dibuat_at", { ascending: true });

  if (error || !rows) return [];

  return rows.map((r: any) => {
    const tim = r.penimbangan?.[0] ?? r.penimbangan ?? {};
    const jumlahAcuan = tim.jumlah_item ?? 0;
    const jejak: Jejak[] = (r.serah_terima ?? []).map((s: any, i: number) => ({
      id: `${r.kode}-${i}`,
      jenis: s.jenis,
      bagian: s.bagian,
      petugas: s.petugas?.nama ?? "-",
      waktu: s.waktu,
      ke: s.ke_status,
      jumlahTercatat: s.jumlah_tercatat,
      jumlahDihitung: s.jumlah_dihitung,
      sesuai: s.jumlah_tercatat === s.jumlah_dihitung,
      catatan: s.catatan ?? "",
      verifikasi: s.verifikasi_at
        ? {
            petugas: s.verifikasi_oleh ?? "-",
            waktu: s.verifikasi_at,
            catatan: s.verifikasi_catatan ?? "",
            jumlahAcuanBaru: s.jumlah_acuan_baru ?? 0,
          }
        : null,
    }));
    return {
      kode: r.kode,
      pelanggan: r.profil?.nama ?? "-",
      layanan: r.layanan?.kode ?? "kiloan",
      beratJumlah: tim.berat_kg ? `${tim.berat_kg} kg · ${jumlahAcuan} pcs` : `${jumlahAcuan} pcs`,
      tahap: r.status as Tahap,
      metodeSerah: r.metode_serah === "diantar" ? "Diantar" : "Ambil sendiri",
      total: tim.subtotal ?? 0,
      lunas: false,
      metodeBayar: null,
      penerima: r.penerima ?? null,
      jumlahAcuan,
      diserahkanPada: r.selesai_at ?? null,
      jejak,
    } as unknown as PesananAlur;
  });
}