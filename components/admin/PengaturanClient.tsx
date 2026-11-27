"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  simpanPengaturan,
  simpanPromo as simpanPromoKeDb,
  ubahStatusPromo,
  hapusPromo as hapusPromoDb,
  uploadGambarPromo,
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
  gambarUrl: string | null;
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
  gambarUrl: null,
};

const TIPE_GAMBAR_KLIEN = ["image/jpeg", "image/png", "image/webp"];
const BATAS_GAMBAR_KLIEN = 2 * 1024 * 1024; // 2 MB

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

const fmtUkuran = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

function statusPromo(p: Promo, sekarang: number): { teks: string; kelas: string } {
  if (!p.aktif) return { teks: "Nonaktif", kelas: "r" };
  if (sekarang < new Date(p.mulai + ":00+07:00").getTime()) return { teks: "Akan datang", kelas: "b" };
  if (sekarang > new Date(p.selesai + ":00+07:00").getTime()) return { teks: "Berakhir", kelas: "y" };
  return { teks: "Berlangsung", kelas: "g" };
}

/* ─── Komponen upload gambar ────────────────────────────── */
function UploadGambar({
  previewUrl,
  namaFile,
  ukuran,
  status,
  disabled,
  onPilih,
  onHapus,
}: {
  previewUrl: string | null;
  namaFile: string | null;
  ukuran: string | null;
  status: "baru" | "tersimpan" | null;
  disabled?: boolean;
  onPilih: (f: File) => void;
  onHapus: () => void;
}) {
  const [seret, setSeret] = useState(false);
  const [galat, setGalat] = useState("");

  function terima(f: File | undefined) {
    if (!f) return;
    if (!TIPE_GAMBAR_KLIEN.includes(f.type)) {
      setGalat("Format file harus JPG, PNG, atau WebP.");
      return;
    }
    if (f.size > BATAS_GAMBAR_KLIEN) {
      setGalat("Ukuran file maksimal 2 MB.");
      return;
    }
    setGalat("");
    onPilih(f);
  }

  const inputFile = (
    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      disabled={disabled}
      onChange={(e) => {
        terima(e.target.files?.[0]);
        e.target.value = ""; // supaya file yang sama bisa dipilih ulang
      }}
    />
  );

  const kotakStyle: React.CSSProperties = {
    border: `2px dashed ${seret ? "#1457D6" : "#0B2A6B"}`,
    background: seret ? "#EAF1FF" : "#F4F7FC",
    borderRadius: 16,
    padding: previewUrl ? 14 : 0,
    transition: "background .15s, border-color .15s, transform .15s",
    transform: seret ? "scale(1.01)" : "none",
  };

  return (
    <div>
      <div
        style={kotakStyle}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setSeret(true);
        }}
        onDragLeave={() => setSeret(false)}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setSeret(false);
          terima(e.dataTransfer.files[0]);
        }}
      >
        {previewUrl ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={previewUrl}
                alt="Pratinjau gambar promo"
                style={{
                  width: 96,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "2px solid #0B2A6B",
                  display: "block",
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 160 }}>
              {status && (
                <span
                  className={`ad-chip ${status === "baru" ? "b" : "g"}`}
                  style={{ marginBottom: 6, display: "inline-block" }}
                >
                  {status === "baru" ? "Baru" : "Tersimpan"}
                </span>
              )}
              <div style={{ fontWeight: 700, fontSize: 14, wordBreak: "break-all", lineHeight: 1.3 }}>
                {namaFile}
              </div>
              {ukuran && <small style={{ opacity: 0.7 }}>{ukuran}</small>}

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <label
                  className="ad-btn ghost s"
                  style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
                >
                  Ganti gambar
                  {inputFile}
                </label>
                <button type="button" onClick={onHapus} disabled={disabled} className="ad-btn r s">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "26px 16px",
              cursor: disabled ? "not-allowed" : "pointer",
              textAlign: "center",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#FFD21F",
                border: "2px solid #0B2A6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "3px 3px 0 #0B2A6B",
              }}
            >
              ⬆
            </span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>
              {seret ? "Lepaskan file di sini" : "Seret gambar ke sini"}
            </span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              atau <u>klik untuk memilih file</u> · JPG, PNG, WebP · maks. 2 MB
            </span>
            {inputFile}
          </label>
        )}
      </div>

      {galat && (
        <p className="ad-galat" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span aria-hidden="true">⚠</span> {galat}
        </p>
      )}
    </div>
  );
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
  const [fileGambar, setFileGambar] = useState<File | null>(null);
  const [previewGambar, setPreviewGambar] = useState<string | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

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
  function bersihkanPreview() {
    if (previewGambar) URL.revokeObjectURL(previewGambar);
  }

  function bukaFormTambah() {
    bersihkanPreview();
    setEditId(null);
    setForm(formKosong);
    setErrorForm("");
    setFileGambar(null);
    setPreviewGambar(null);
    setShowForm(true);
  }

  function bukaFormEdit(p: Promo) {
    bersihkanPreview();
    setEditId(p.id);
    const { id: _id, ...sisa } = p;
    setForm(sisa);
    setErrorForm("");
    setFileGambar(null);
    setPreviewGambar(null);
    setShowForm(true);
  }

  function tutupForm() {
    bersihkanPreview();
    setShowForm(false);
    setEditId(null);
    setErrorForm("");
    setFileGambar(null);
    setPreviewGambar(null);
    setMenyimpan(false);
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

    setMenyimpan(true);
    setErrorForm("");

    // Upload gambar dulu kalau ada file baru yang dipilih
    let gambarUrl = form.gambarUrl;
    if (fileGambar) {
      const fd = new FormData();
      fd.append("file", fileGambar);
      const up = await uploadGambarPromo(fd);
      if (!up.ok) {
        setErrorForm("Gagal mengunggah gambar: " + up.pesan);
        setMenyimpan(false);
        return;
      }
      gambarUrl = up.url;
    }

    const input = {
      ...form,
      layanan: form.berlakuUntuk === "tertentu" ? form.layanan : [],
      maksPotongan: form.jenis === "persen" ? form.maksPotongan : null,
      gambarUrl,
    };

    const hasil = await simpanPromoKeDb(editId, input);
    if (!hasil.ok) {
      setErrorForm("Gagal menyimpan: " + hasil.pesan);
      setMenyimpan(false);
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

      <h1 className="ad-d p-7">Pengaturan</h1>

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
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {p.gambarUrl && (
                                <img src={p.gambarUrl} alt="" width={40} height={40} style={{ objectFit: "cover", borderRadius: 8 }} />
                              )}
                              <strong>{p.nama}</strong>
                            </div>
                          </td>
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
        <div className="ad-ov" onClick={() => !menyimpan && tutupForm()}>
          <div className="ad-pop lebar" onClick={(e) => e.stopPropagation()}>
            <h2 className="ad-d">{editId !== null ? "Edit Promo" : "Tambah Promo Baru"}</h2>

            <form onSubmit={simpanPromo} className="ad-form" style={{ marginTop: 16 }}>
              <div className="ad-field">
                <label>Nama Promo</label>
                <input
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                  disabled={menyimpan}
                  placeholder="Contoh: Promo Hari Kemerdekaan"
                />
              </div>

              {/* Gambar promo */}
              <div className="ad-field">
                <label>Gambar Promo (opsional)</label>
                <UploadGambar
                  previewUrl={previewGambar ?? form.gambarUrl}
                  namaFile={fileGambar?.name ?? (form.gambarUrl ? "Gambar tersimpan" : null)}
                  ukuran={fileGambar ? fmtUkuran(fileGambar.size) : null}
                  status={fileGambar ? "baru" : form.gambarUrl ? "tersimpan" : null}
                  disabled={menyimpan}
                  onPilih={(f) => {
                    bersihkanPreview();
                    setFileGambar(f);
                    setPreviewGambar(URL.createObjectURL(f));
                  }}
                  onHapus={() => {
                    bersihkanPreview();
                    setFileGambar(null);
                    setPreviewGambar(null);
                    setForm({ ...form, gambarUrl: null });
                  }}
                />
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Jenis Diskon</label>
                  <select
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value as "persen" | "nominal" })}
                    disabled={menyimpan}
                  >
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
                    disabled={menyimpan}
                  />
                </div>
              </div>

              <div className="ad-field">
                <label>Berlaku Untuk</label>
                <div className="ad-baris-radio">
                  <label>
                    <input type="radio" name="berlaku" checked={form.berlakuUntuk === "semua"} onChange={() => setForm({ ...form, berlakuUntuk: "semua" })} disabled={menyimpan} />
                    Semua layanan
                  </label>
                  <label>
                    <input type="radio" name="berlaku" checked={form.berlakuUntuk === "tertentu"} onChange={() => setForm({ ...form, berlakuUntuk: "tertentu" })} disabled={menyimpan} />
                    Layanan tertentu
                  </label>
                </div>
                {form.berlakuUntuk === "tertentu" && (
                  <div className="ad-cek-kotak">
                    {awal.layanan.map((l) => (
                      <label key={l.id} className="ad-cek">
                        <input type="checkbox" checked={form.layanan.includes(l.id)} onChange={() => toggleLayanan(l.id)} disabled={menyimpan} />
                        {l.nama}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Minimal Belanja (Rp)</label>
                  <input type="number" min={0} value={form.minBelanja || ""} onChange={(e) => setForm({ ...form, minBelanja: Number(e.target.value) })} placeholder="0 = tanpa minimal" disabled={menyimpan} />
                </div>
                {form.jenis === "persen" && (
                  <div className="ad-field">
                    <label>Maksimal Potongan (Rp)</label>
                    <input type="number" min={0} value={form.maksPotongan ?? ""} onChange={(e) => setForm({ ...form, maksPotongan: e.target.value ? Number(e.target.value) : null })} placeholder="Kosongkan = tanpa batas" disabled={menyimpan} />
                  </div>
                )}
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Mulai</label>
                  <input type="datetime-local" value={form.mulai} onChange={(e) => setForm({ ...form, mulai: e.target.value })} required disabled={menyimpan} />
                </div>
                <div className="ad-field">
                  <label>Selesai</label>
                  <input type="datetime-local" value={form.selesai} onChange={(e) => setForm({ ...form, selesai: e.target.value })} required disabled={menyimpan} />
                </div>
              </div>

              <div className="ad-grid-2">
                <div className="ad-field">
                  <label>Kuota Pemakaian</label>
                  <input type="number" min={1} value={form.kuota ?? ""} onChange={(e) => setForm({ ...form, kuota: e.target.value ? Number(e.target.value) : null })} placeholder="Kosongkan = tanpa batas" disabled={menyimpan} />
                </div>
                <div className="ad-field">
                  <label>Status</label>
                  <label>
                    <input type="checkbox" checked={form.aktif} onChange={(e) => setForm({ ...form, aktif: e.target.checked })} disabled={menyimpan} />
                    Aktifkan promo ini
                  </label>
                </div>
              </div>

              {errorForm && <p className="ad-galat">{errorForm}</p>}

              <div className="ad-aksi">
                <button type="submit" className="ad-btn" disabled={menyimpan}>
                  {menyimpan
                    ? fileGambar ? "Mengunggah gambar..." : "Menyimpan..."
                    : editId !== null ? "Simpan Perubahan" : "Tambah Promo"}
                </button>
                <button type="button" onClick={tutupForm} className="ad-btn ghost" disabled={menyimpan}>Batal</button>
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