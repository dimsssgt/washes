"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  simpanPengaturan,
  simpanPromo as simpanPromoKeDb,
  ubahStatusPromo,
  hapusPromo as hapusPromoDb,
  type DataAwal,
  type KunciPengaturan,
} from "@/lib/pengaturan/actions";

/* ─── Tipe ─────────────────────────────────────────────── */
interface InfoToko {
  namaToko: string;
  alamat: string;
  noWhatsapp: string;
  emailKontak: string;
}

interface JamHari {
  hari: string;
  buka: boolean;
  mulai: string;
  selesai: string;
}

interface AntarJemput {
  aktif: boolean;
  biaya: number;
  jarakKm: number;
  estimasiMenit: number;
}

interface AturanPesanan {
  minKg: number;
  estReguler: number;
  estOneDay: number;
  estExpress: number;
  estQuick: number;
}

interface NotaSettings {
  ucapan: string;
  ketentuan: string;
  metode: string[];
}

interface Promo {
  id: string;
  nama: string;
  jenis: "persen" | "nominal";
  nilai: number;
  berlakuUntuk: "semua" | "tertentu";
  layanan: string[]; // berisi layanan_id
  minBelanja: number;
  maksPotongan: number | null;
  mulai: string;
  selesai: string;
  kuota: number | null;
  aktif: boolean;
}

type FormPromo = Omit<Promo, "id">;

/* ─── Konstanta ─────────────────────────────────────────── */
const METODE = [
  { kode: "QRIS", label: "QRIS" },
  { kode: "Tunai", label: "Tunai" },
];

const formKosong: FormPromo = {
  nama: "",
  jenis: "persen",
  nilai: 0,
  berlakuUntuk: "semua",
  layanan: [],
  minBelanja: 0,
  maksPotongan: null,
  mulai: "",
  selesai: "",
  kuota: null,
  aktif: true,
};

/* ─── Helper ────────────────────────────────────────────── */
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

const fmtTanggal = (s: string) =>
  s
    ? new Date(s + ":00+07:00").toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })
    : "-";

function statusPromo(p: Promo, sekarang: number): { teks: string; kelas: string } {
  if (!p.aktif) return { teks: "Nonaktif", kelas: "r" };
  if (sekarang < new Date(p.mulai + ":00+07:00").getTime()) return { teks: "Akan datang", kelas: "b" };
  if (sekarang > new Date(p.selesai + ":00+07:00").getTime()) return { teks: "Berakhir", kelas: "y" };
  return { teks: "Berlangsung", kelas: "g" };
}

/* ─── Komponen utama ────────────────────────────────────── */
export default function PengaturanClient({ tab, awal }: { tab: "umum" | "promo"; awal: DataAwal }) {
  /* -- Umum -- */
  const [info, setInfo] = useState<InfoToko>(awal.info);
  const [jam, setJam] = useState<JamHari[]>(awal.jam);
  const [antar, setAntar] = useState<AntarJemput>(awal.antar);
  const [pesanan, setPesanan] = useState<AturanPesanan>(awal.pesanan);
  const [nota, setNota] = useState<NotaSettings>(awal.nota);
  const [tersimpan, setTersimpan] = useState<string | null>(null);
  const [errorJam, setErrorJam] = useState("");

  /* -- Promo -- */
  const [daftarPromo, setDaftarPromo] = useState<Promo[]>(awal.promo);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormPromo>(formKosong);
  const [errorForm, setErrorForm] = useState("");
  const [hapusPromo, setHapusPromo] = useState<Promo | null>(null);

  const sekarang = Date.now();

  /* ── Handler Umum ── */
  async function simpanBagian(nama: KunciPengaturan, e: FormEvent) {
    e.preventDefault();

    if (nama === "jam") {
      const salah = jam.find((h) => h.buka && h.selesai <= h.mulai);
      if (salah) {
        setErrorJam(`Jam tutup ${salah.hari} harus setelah jam buka.`);
        return;
      }
      setErrorJam("");
    }

    const nilai = { info, jam, antar, pesanan, nota }[nama];
    const hasil = await simpanPengaturan(nama, nilai);
    if (!hasil.ok) {
      alert("Gagal menyimpan: " + hasil.pesan);
      return;
    }

    setTersimpan(nama);
    setTimeout(() => setTersimpan(null), 2500);
  }

  function updateJam(i: number, patch: Partial<JamHari>) {
    setJam((prev) => prev.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  }

  function toggleMetode(kode: string) {
    setNota((n) => ({
      ...n,
      metode: n.metode.includes(kode) ? n.metode.filter((x) => x !== kode) : [...n.metode, kode],
    }));
  }

  /* ── Handler Promo ── */
  function bukaFormTambah() {
    setEditId(null);
    setForm(formKosong);
    setErrorForm("");
    setShowForm(true);
  }

  function bukaFormEdit(p: Promo) {
    setEditId(p.id);
    const { id: _id, ...sisa } = p;
    setForm(sisa);
    setErrorForm("");
    setShowForm(true);
  }

  function tutupForm() {
    setShowForm(false);
    setEditId(null);
    setErrorForm("");
  }

  function toggleLayanan(layananId: string) {
    setForm((f) => ({
      ...f,
      layanan: f.layanan.includes(layananId)
        ? f.layanan.filter((l) => l !== layananId)
        : [...f.layanan, layananId],
    }));
  }

  function validasi(): string | null {
    if (form.nilai <= 0) return "Nilai diskon harus lebih dari 0.";
    if (form.jenis === "persen" && form.nilai > 100) return "Diskon persen maksimal 100%.";
    if (!form.mulai || !form.selesai) return "Tanggal mulai dan selesai wajib diisi.";
    if (new Date(form.selesai) <= new Date(form.mulai)) return "Waktu selesai harus setelah waktu mulai.";
    if (form.berlakuUntuk === "tertentu" && form.layanan.length === 0) return "Pilih minimal satu layanan.";
    return null;
  }

  async function simpanPromo(e: FormEvent) {
    e.preventDefault();
    const err = validasi();
    if (err) {
      setErrorForm(err);
      return;
    }

    const input = {
      ...form,
      layanan: form.berlakuUntuk === "tertentu" ? form.layanan : [],
      maksPotongan: form.jenis === "persen" ? form.maksPotongan : null,
    };

    const hasil = await simpanPromoKeDb(editId, input);
    if (!hasil.ok) {
      setErrorForm("Gagal menyimpan: " + hasil.pesan);
      return;
    }

    const baru: Promo = { id: hasil.id, ...input };
    setDaftarPromo((prev) =>
      editId !== null ? prev.map((p) => (p.id === editId ? baru : p)) : [baru, ...prev],
    );
    tutupForm();
  }

  async function toggleAktif(p: Promo) {
    const hasil = await ubahStatusPromo(p.id, !p.aktif);
    if (!hasil.ok) {
      alert("Gagal mengubah status: " + hasil.pesan);
      return;
    }
    setDaftarPromo((prev) => prev.map((x) => (x.id === p.id ? { ...x, aktif: !x.aktif } : x)));
  }

  async function hapusKonfirmasi() {
    if (!hapusPromo) return;
    const hasil = await hapusPromoDb(hapusPromo.id);
    if (!hasil.ok) {
      alert("Gagal menghapus: " + hasil.pesan);
      return;
    }
    setDaftarPromo((prev) => prev.filter((p) => p.id !== hapusPromo.id));
    setHapusPromo(null);
  }

  const namaLayanan = (id: string) => awal.layanan.find((l) => l.id === id)?.nama ?? "(layanan dihapus)";

  return (
    <div>
      <Link href="/admin" className="ad-crumb">
        ← Kembali ke Dashboard
      </Link>

      <h1 className="ad-d">Pengaturan</h1>

      <div>
        {/* ══════════════ TAB UMUM ══════════════ */}
        {tab === "umum" && (
          <div className="ad-stack">
            {/* Informasi toko */}
            <section className="ad-kartu">
              <h2 className="ad-d">Informasi Toko</h2>
              <small>Data ini ditampilkan kepada pelanggan di website dan aplikasi.</small>
              <form onSubmit={(e) => simpanBagian("info", e)} className="ad-form" style={{ marginTop: 16 }}>
                <div className="ad-field">
                  <label>Nama Toko</label>
                  <input value={info.namaToko} onChange={(e) => setInfo({ ...info, namaToko: e.target.value })} required />
                </div>
                <div className="ad-field">
                  <label>Alamat</label>
                  <input value={info.alamat} onChange={(e) => setInfo({ ...info, alamat: e.target.value })} required />
                </div>
                <div className="ad-grid-2">
                  <div className="ad-field">
                    <label>Nomor WhatsApp</label>
                    <input value={info.noWhatsapp} onChange={(e) => setInfo({ ...info, noWhatsapp: e.target.value })} />
                  </div>
                  <div className="ad-field">
                    <label>Email Kontak</label>
                    <input type="email" value={info.emailKontak} onChange={(e) => setInfo({ ...info, emailKontak: e.target.value })} />
                  </div>
                </div>
                <div className="ad-aksi">
                  <button type="submit" className="ad-btn">Simpan Perubahan</button>
                  {tersimpan === "info" && <span className="ad-chip g">✓ Tersimpan</span>}
                </div>
              </form>
            </section>

            {/* Jam operasional */}
            <section className="ad-kartu">
              <h2 className="ad-d">Jam Operasional</h2>
              <small>Pelanggan hanya bisa memesan pada jam buka.</small>
              <form onSubmit={(e) => simpanBagian("jam", e)} className="ad-form" style={{ marginTop: 16 }}>
                <div className="ad-jam-baris ad-jam-head">
                  <span>Hari</span>
                  <span>Status</span>
                  <span>Buka</span>
                  <span>Tutup</span>
                </div>
                {jam.map((h, i) => (
                  <div className="ad-jam-baris" key={h.hari}>
                    <label>
                      <input type="checkbox" checked={h.buka} onChange={(e) => updateJam(i, { buka: e.target.checked })} />
                      {h.hari}
                    </label>
                    <span style={{ fontSize: 13, color: h.buka ? "var(--g)" : "var(--r)", fontWeight: 600 }}>
                      {h.buka ? "Buka" : "Tutup"}
                    </span>
                    <input type="time" value={h.mulai} disabled={!h.buka} onChange={(e) => updateJam(i, { mulai: e.target.value })} />
                    <input type="time" value={h.selesai} disabled={!h.buka} onChange={(e) => updateJam(i, { selesai: e.target.value })} />
                  </div>
                ))}
                {errorJam && <p className="ad-galat">{errorJam}</p>}
                <div className="ad-aksi">
                  <button type="submit" className="ad-btn">Simpan Jam</button>
                  {tersimpan === "jam" && <span className="ad-chip g">✓ Tersimpan</span>}
                </div>
              </form>
            </section>

            {/* Antar jemput */}
            <section className="ad-kartu">
              <h2 className="ad-d">Antar Jemput</h2>
              <small>Kurir menjemput dan mengantar cucian ke alamat pelanggan.</small>
              <form onSubmit={(e) => simpanBagian("antar", e)} className="ad-form" style={{ marginTop: 16 }}>
                <label>
                  <input type="checkbox" checked={antar.aktif} onChange={(e) => setAntar({ ...antar, aktif: e.target.checked })} />
                  Aktifkan layanan antar jemput
                </label>
                <div className="ad-grid-3">
                  <div className="ad-field">
                    <label>Biaya Antar (Rp)</label>
                    <input type="number" min={0} disabled={!antar.aktif} value={antar.biaya} onChange={(e) => setAntar({ ...antar, biaya: Number(e.target.value) })} />
                  </div>
                  <div className="ad-field">
                    <label>Jarak Maksimal (km)</label>
                    <input type="number" min={1} disabled={!antar.aktif} value={antar.jarakKm} onChange={(e) => setAntar({ ...antar, jarakKm: Number(e.target.value) })} />
                  </div>
                  <div className="ad-field">
                    <label>Kurir Datang Maks. (menit)</label>
                    <input type="number" min={1} disabled={!antar.aktif} value={antar.estimasiMenit} onChange={(e) => setAntar({ ...antar, estimasiMenit: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="ad-aksi">
                  <button type="submit" className="ad-btn">Simpan Antar Jemput</button>
                  {tersimpan === "antar" && <span className="ad-chip g">✓ Tersimpan</span>}
                </div>
              </form>
            </section>

            {/* Aturan pesanan */}
            <section className="ad-kartu">
              <h2 className="ad-d">Aturan Pesanan</h2>
              <small>Batas minimal dan estimasi pengerjaan untuk tiap jenis layanan.</small>
              <form onSubmit={(e) => simpanBagian("pesanan", e)} className="ad-form" style={{ marginTop: 16 }}>
                <div className="ad-field">
                  <label>Minimal Order Cuci Kiloan (kg)</label>
                  <input type="number" min={0} value={pesanan.minKg} onChange={(e) => setPesanan({ ...pesanan, minKg: Number(e.target.value) })} />
                </div>
                <div className="ad-grid-3">
                  <div className="ad-field">
                    <label>Estimasi Reguler (hari)</label>
                    <input type="number" min={1} value={pesanan.estReguler} onChange={(e) => setPesanan({ ...pesanan, estReguler: Number(e.target.value) })} />
                  </div>
                  <div className="ad-field">
                    <label>Estimasi One Day (hari)</label>
                    <input type="number" min={1} value={pesanan.estOneDay} onChange={(e) => setPesanan({ ...pesanan, estOneDay: Number(e.target.value) })} />
                  </div>
                  <div className="ad-field">
                    <label>Estimasi Express (jam)</label>
                    <input type="number" min={1} value={pesanan.estExpress} onChange={(e) => setPesanan({ ...pesanan, estExpress: Number(e.target.value) })} />
                  </div>
                  <div className="ad-field">
                    <label>Estimasi Quick (jam)</label>
                    <input type="number" min={1} value={pesanan.estQuick} onChange={(e) => setPesanan({ ...pesanan, estQuick: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="ad-aksi">
                  <button type="submit" className="ad-btn">Simpan Aturan</button>
                  {tersimpan === "pesanan" && <span className="ad-chip g">✓ Tersimpan</span>}
                </div>
              </form>
            </section>

            {/* Pengaturan nota */}
            <section className="ad-kartu">
              <h2 className="ad-d">Pengaturan Nota</h2>
              <small>Teks dan keterangan yang tercetak di bagian bawah nota pelanggan.</small>
              <form onSubmit={(e) => simpanBagian("nota", e)} className="ad-form" style={{ marginTop: 16 }}>
                <div className="ad-field">
                  <label>Ucapan Terima Kasih</label>
                  <input value={nota.ucapan} onChange={(e) => setNota({ ...nota, ucapan: e.target.value })} />
                </div>

                <div className="ad-field">
                  <label>Ketentuan (satu baris satu ketentuan)</label>
                  <textarea rows={4} value={nota.ketentuan} onChange={(e) => setNota({ ...nota, ketentuan: e.target.value })} />
                </div>

                <div className="ad-field">
                  <label>Metode Pembayaran</label>
                  <div className="ad-baris-radio">
                    {METODE.map((m) => (
                      <label key={m.kode}>
                        <input type="checkbox" checked={nota.metode.includes(m.kode)} onChange={() => toggleMetode(m.kode)} />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ad-aksi">
                  <button type="submit" className="ad-btn">Simpan Pengaturan Nota</button>
                  {tersimpan === "nota" && <span className="ad-chip g">✓ Tersimpan</span>}
                </div>
              </form>
            </section>
          </div>
        )}

        {/* ══════════════ TAB PROMO ══════════════ */}
        {tab === "promo" && (
          <section className="ad-kartu">
            <div className="ad-baris">
              <h2 className="ad-d">Promo &amp; Diskon</h2>
              <button onClick={bukaFormTambah} className="ad-btn">+ Tambah Promo</button>
            </div>
            <small>Atur diskon untuk layanan tertentu atau semua layanan, lengkap dengan periode waktunya.</small>

            <div className="ad-tabel-scroll" style={{ marginTop: 16 }}>
              <table>
                <thead>
                  <tr>
                    {["Nama Promo", "Diskon", "Berlaku Untuk", "Periode", "Kuota", "Status", "Aksi"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daftarPromo.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="ad-kosong">Belum ada promo</td>
                    </tr>
                  ) : (
                    daftarPromo.map((p) => {
                      const st = statusPromo(p, sekarang);
                      return (
                        <tr key={p.id}>
                          <td><strong>{p.nama}</strong></td>
                          <td>
                            {p.jenis === "persen" ? `${p.nilai}%` : rp(p.nilai)}
                            {p.jenis === "persen" && p.maksPotongan ? <small><br />maks {rp(p.maksPotongan)}</small> : null}
                            {p.minBelanja > 0 && <small><br />min belanja {rp(p.minBelanja)}</small>}
                          </td>
                          <td>
                            {p.berlakuUntuk === "semua"
                              ? "Semua layanan"
                              : p.layanan.map((id) => namaLayanan(id)).join(", ")}
                          </td>
                          <td>
                            {fmtTanggal(p.mulai)}
                            <small><br />s/d {fmtTanggal(p.selesai)}</small>
                          </td>
                          <td>{p.kuota ?? "Tanpa batas"}</td>
                          <td>
                            <button onClick={() => toggleAktif(p)} className={`ad-chip ${st.kelas}`}>
                              {st.teks}
                            </button>
                          </td>
                          <td>
                            <button onClick={() => bukaFormEdit(p)} className="ad-btn ghost s">Edit</button>{" "}
                            <button onClick={() => setHapusPromo(p)} className="ad-btn r s">Hapus</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* ══════════════ MODAL FORM PROMO ══════════════ */}
      {showForm && (
        <div className="ad-ov" onClick={tutupForm}>
          <div className="ad-pop lebar" onClick={(e) => e.stopPropagation()}>
            <h2 className="ad-d">{editId !== null ? "Edit Promo" : "Tambah Promo Baru"}</h2>

            <form onSubmit={simpanPromo} className="ad-form" style={{ marginTop: 16 }}>
              <div className="ad-field">
                <label>Nama Promo</label>
                <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="Contoh: Promo Hari Kemerdekaan" />
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Jenis Diskon</label>
                  <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as "persen" | "nominal" })}>
                    <option value="persen">Persentase (%)</option>
                    <option value="nominal">Nominal (Rp)</option>
                  </select>
                </div>
                <div className="ad-field">
                  <label>{form.jenis === "persen" ? "Besar Diskon (%)" : "Potongan (Rp)"}</label>
                  <input
                    type="number"
                    min={1}
                    max={form.jenis === "persen" ? 100 : undefined}
                    value={form.nilai || ""}
                    onChange={(e) => setForm({ ...form, nilai: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="ad-field">
                <label>Berlaku Untuk</label>
                <div className="ad-baris-radio">
                  <label>
                    <input type="radio" name="berlaku" checked={form.berlakuUntuk === "semua"} onChange={() => setForm({ ...form, berlakuUntuk: "semua" })} />
                    Semua layanan
                  </label>
                  <label>
                    <input type="radio" name="berlaku" checked={form.berlakuUntuk === "tertentu"} onChange={() => setForm({ ...form, berlakuUntuk: "tertentu" })} />
                    Layanan tertentu
                  </label>
                </div>
                {form.berlakuUntuk === "tertentu" && (
                  <div className="ad-cek-kotak">
                    {awal.layanan.map((l) => (
                      <label key={l.id} className="ad-cek">
                        <input type="checkbox" checked={form.layanan.includes(l.id)} onChange={() => toggleLayanan(l.id)} />
                        {l.nama}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Minimal Belanja (Rp)</label>
                  <input type="number" min={0} value={form.minBelanja || ""} onChange={(e) => setForm({ ...form, minBelanja: Number(e.target.value) })} placeholder="0 = tanpa minimal" />
                </div>
                {form.jenis === "persen" && (
                  <div className="ad-field">
                    <label>Maksimal Potongan (Rp)</label>
                    <input type="number" min={0} value={form.maksPotongan ?? ""} onChange={(e) => setForm({ ...form, maksPotongan: e.target.value ? Number(e.target.value) : null })} placeholder="Kosongkan = tanpa batas" />
                  </div>
                )}
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Mulai</label>
                  <input type="datetime-local" value={form.mulai} onChange={(e) => setForm({ ...form, mulai: e.target.value })} required />
                </div>
                <div className="ad-field">
                  <label>Selesai</label>
                  <input type="datetime-local" value={form.selesai} onChange={(e) => setForm({ ...form, selesai: e.target.value })} required />
                </div>
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Kuota Pemakaian</label>
                  <input type="number" min={1} value={form.kuota ?? ""} onChange={(e) => setForm({ ...form, kuota: e.target.value ? Number(e.target.value) : null })} placeholder="Kosongkan = tanpa batas" />
                </div>
                <div className="ad-field">
                  <label>Status</label>
                  <label>
                    <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} />
                    Aktifkan promo ini
                  </label>
                </div>
              </div>

              {errorForm && <p className="ad-galat">{errorForm}</p>}

              <div className="ad-aksi">
                <button type="submit" className="ad-btn">{editId !== null ? "Simpan Perubahan" : "Tambah Promo"}</button>
                <button type="button" onClick={tutupForm} className="ad-btn ghost">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL KONFIRMASI HAPUS ══════════════ */}
      {hapusPromo && (
        <div className="ad-ov" onClick={() => setHapusPromo(null)}>
          <div className="ad-pop" onClick={(e) => e.stopPropagation()}>
            <h2 className="ad-d">Hapus Promo?</h2>
            <p>Promo <strong>{hapusPromo.nama}</strong> akan dihapus secara permanen.</p>
            <div className="ad-aksi">
              <button onClick={hapusKonfirmasi} className="ad-btn r">Ya, Hapus</button>
              <button onClick={() => setHapusPromo(null)} className="ad-btn ghost">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}