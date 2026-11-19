"use client";

import { useState } from "react";
import Modal, { Konfirmasi } from "./Modal";
import { FormHarga, FormLayanan, FormPengguna } from "./FormAdmin";
import { Pill } from "./Grafik";
import MenuAksi from "./MenuAksi";
import { formatRupiah } from "@/lib/admin/rekap";
import type { Harga, Layanan, Pengguna } from "@/lib/admin/types";

type Popup =
  | { jenis: "layanan"; data: Layanan | null }
  | { jenis: "lihatLayanan"; data: Layanan }
  | { jenis: "hapusLayanan"; data: Layanan }
  | { jenis: "harga"; data: Harga }
  | { jenis: "pengguna"; data: Pengguna | null }
  | { jenis: "lihatPengguna"; data: Pengguna }
  | { jenis: "hapusPengguna"; data: Pengguna };

interface KelolaClientProps {
  layananAwal: Layanan[];
  hargaAwal: Harga[];
  penggunaAwal: Pengguna[];
}

const idBaru = (awalan: string) => `${awalan}${Date.now()}`;

export default function KelolaClient({ layananAwal, hargaAwal, penggunaAwal }: KelolaClientProps) {
  const [layanan, setLayanan] = useState(layananAwal);
  const [harga, setHarga] = useState(hargaAwal);
  const [pengguna, setPengguna] = useState(penggunaAwal);
  const [popup, setPopup] = useState<Popup | null>(null);

  const tutup = () => setPopup(null);

  // TODO (Supabase): setiap fungsi di bawah ini menjadi insert/update/delete ke tabel terkait.
  function simpanLayanan(data: Omit<Layanan, "id">, id?: string) {
    setLayanan((ls) =>
      id ? ls.map((l) => (l.id === id ? { ...l, ...data } : l)) : [...ls, { id: idBaru("L"), ...data }],
    );
    tutup();
  }

  function hapusLayanan(id: string) {
    setLayanan((ls) => ls.filter((l) => l.id !== id));
    tutup();
  }

  function simpanHarga(id: string, reguler: number, oneDay: number | null, express: number | null, quick: number | null) {
    setHarga((hs) => hs.map((h) => (h.id === id ? { ...h, reguler, oneDay, express, quick } : h)));
    tutup();
  }

  function simpanPengguna(data: Omit<Pengguna, "id">, id?: string) {
    setPengguna((ps) =>
      id ? ps.map((p) => (p.id === id ? { ...p, ...data } : p)) : [...ps, { id: idBaru("U"), ...data }],
    );
    tutup();
  }

  function hapusPengguna(id: string) {
    setPengguna((ps) => ps.filter((p) => p.id !== id));
    tutup();
  }

  // Ringkasan kartu atas
  const layananAktif = layanan.filter((l) => l.aktif).length;
  const penggunaAktif = pengguna.filter((p) => p.aktif);
  const penggunaNonaktif = pengguna.length - penggunaAktif.length;
  const peranAktif = Array.from(new Set(penggunaAktif.map((p) => p.peran.toLowerCase()))).join(", ");
  const hargaTerendah = harga.length ? harga.reduce((m, h) => (h.reguler < m.reguler ? h : m)) : null;

  // Baris tabel: setiap layanan dipasangkan dengan harganya (jika ada).
  const baris = layanan.map((l) => ({ l, h: harga.find((x) => x.layanan === l.nama) ?? null }));

  return (
    <>
      <div className="ad-kepala">
        <div>
          <p className="ad-hint ad-crumb">Laundyku · Kelola</p>
          <h1 className="ad-d">Kelola layanan</h1>
        </div>
        <div className="ad-baris-aksi">
          <a href="#kelola-pengguna" className="ad-btn ghost">
            Atur pengguna
          </a>
          <button type="button" onClick={() => setPopup({ jenis: "layanan", data: null })}>
            + Tambah layanan
          </button>
        </div>
      </div>

      <div className="ad-kpi-grid">
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Layanan aktif</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{layananAktif}</div>
          <div>
            {layanan.every((l) => l.aktif) ? (
              <Pill tone="naik">↗ semua aktif</Pill>
            ) : (
              <Pill tone="turun">↘ {layanan.length - layananAktif} nonaktif</Pill>
            )}
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Pengguna aktif</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{penggunaAktif.length}</div>
          <div>
            <Pill tone="naik">↗ {peranAktif || "belum ada"}</Pill>
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Pengguna nonaktif</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{penggunaNonaktif}</div>
          <div>
            {penggunaNonaktif > 0 ? <Pill tone="turun">↘ perlu ditinjau</Pill> : <Pill tone="netral">tidak ada</Pill>}
          </div>
        </div>
        <div className="ad-kartu kecil ad-kpi">
          <div className="ad-kpi-atas">
            <span>Harga terendah</span>
            <span className="ad-kpi-tag">30 hari</span>
          </div>
          <div className="ad-kpi-nilai">{hargaTerendah ? formatRupiah(hargaTerendah.reguler) : "-"}</div>
          <div>
            {hargaTerendah ? (
              <Pill tone="naik">↗ {hargaTerendah.layanan.toLowerCase()} {hargaTerendah.satuan}</Pill>
            ) : (
              <Pill tone="netral">belum ada harga</Pill>
            )}
          </div>
        </div>
      </div>

      <section id="kelola-layanan" className="ad-kartu">
        <div className="ad-kepala-kartu">
          <h2 className="ad-d">Daftar layanan dan harga</h2>
          <p className="ad-hint">Harga dalam rupiah</p>
        </div>
        <div className="ad-scroll" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Keterangan</th>
                <th>Satuan</th>
                <th>Reguler</th>
                <th>1 Hari</th>
                <th>Express</th>
                <th>Quick</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {baris.map(({ l, h }) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.nama}</strong>
                  </td>
                  <td>{l.deskripsi || "-"}</td>
                  <td>{h?.satuan ?? "-"}</td>
                  <td>{h ? formatRupiah(h.reguler) : "-"}</td>
                  <td>{h?.oneDay == null ? "-" : formatRupiah(h.oneDay)}</td>
                  <td>{h?.express == null ? "-" : formatRupiah(h.express)}</td>
                  <td>{h?.quick == null ? "-" : formatRupiah(h.quick)}</td>
                  <td>
                    <MenuAksi
                      label={`Aksi untuk layanan ${l.nama}`}
                      items={[
                        ...(h ? [{ label: "Ubah harga", ikon: "edit" as const, onKlik: () => setPopup({ jenis: "harga", data: h }) }] : []),
                        { label: "Lihat detail", ikon: "lihat" as const, onKlik: () => setPopup({ jenis: "lihatLayanan", data: l }) },
                        { label: "Edit layanan", ikon: "edit" as const, onKlik: () => setPopup({ jenis: "layanan", data: l }) },
                        { label: "Hapus", ikon: "hapus" as const, bahaya: true, onKlik: () => setPopup({ jenis: "hapusLayanan", data: l }) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {layanan.length === 0 && <p className="ad-kosong">Belum ada layanan.</p>}
      </section>

      <section id="kelola-pengguna" className="ad-kartu">
        <div className="ad-kepala-kartu">
          <h2 className="ad-d">Pengguna</h2>
          <div className="ad-baris-aksi">
            <p className="ad-hint" style={{ margin: 0 }}>
              {pengguna.length} akun terdaftar
            </p>
            <button type="button" className="ad-btn s" onClick={() => setPopup({ jenis: "pengguna", data: null })}>
              + Tambah pengguna
            </button>
          </div>
        </div>
        <div className="ad-scroll" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengguna.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nama}</strong>
                  </td>
                  <td>{p.email}</td>
                  <td>
                    <span className={`ad-chip ${p.peran === "Admin" ? "b" : p.peran === "Petugas" ? "y" : ""}`}>
                      {p.peran}
                    </span>
                  </td>
                  <td>
                    <span className={`ad-chip ${p.aktif ? "g" : "r"}`}>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                  </td>
                  <td>
                    <MenuAksi
                      label={`Aksi untuk pengguna ${p.nama}`}
                      items={[
                        { label: "Lihat detail", ikon: "lihat", onKlik: () => setPopup({ jenis: "lihatPengguna", data: p }) },
                        { label: "Edit pengguna", ikon: "edit", onKlik: () => setPopup({ jenis: "pengguna", data: p }) },
                        { label: "Hapus", ikon: "hapus", bahaya: true, onKlik: () => setPopup({ jenis: "hapusPengguna", data: p }) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pengguna.length === 0 && <p className="ad-kosong">Belum ada pengguna.</p>}
      </section>

      {/* ---------- Popup ---------- */}

      {popup?.jenis === "layanan" && (
        <Modal judul={popup.data ? "Ubah layanan" : "Tambah layanan"} onTutup={tutup}>
          <FormLayanan awal={popup.data} onSimpan={(d) => simpanLayanan(d, popup.data?.id)} onBatal={tutup} />
        </Modal>
      )}

      {popup?.jenis === "lihatLayanan" && (
        <Modal judul={`Detail Layanan: ${popup.data.nama}`} onTutup={tutup}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>NAMA LAYANAN</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{popup.data.nama}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>DESKRIPSI</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{popup.data.deskripsi || "Tidak ada deskripsi tambahan."}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>STATUS</div>
              <span className={`ad-chip ${popup.data.aktif ? "g" : "r"}`} style={{ marginTop: 4 }}>
                {popup.data.aktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button className="ad-btn y s" onClick={tutup}>Tutup</button>
            </div>
          </div>
        </Modal>
      )}

      {popup?.jenis === "hapusLayanan" && (
        <Konfirmasi
          judul="Hapus layanan?"
          pesan={`Layanan "${popup.data.nama}" akan dihapus dari daftar.`}
          label="Hapus"
          onYa={() => hapusLayanan(popup.data.id)}
          onBatal={tutup}
        />
      )}

      {popup?.jenis === "harga" && (
        <Modal judul={`Ubah harga ${popup.data.layanan}`} onTutup={tutup}>
          <FormHarga
            awal={popup.data}
            onSimpan={(reguler, oneDay, express, quick) => simpanHarga(popup.data.id, reguler, oneDay, express, quick)}
            onBatal={tutup}
          />
        </Modal>
      )}

      {popup?.jenis === "pengguna" && (
        <Modal judul={popup.data ? "Ubah pengguna" : "Tambah pengguna"} onTutup={tutup}>
          <FormPengguna awal={popup.data} onSimpan={(d) => simpanPengguna(d, popup.data?.id)} onBatal={tutup} />
        </Modal>
      )}

      {popup?.jenis === "lihatPengguna" && (
        <Modal judul={`Detail Pengguna: ${popup.data.nama}`} onTutup={tutup}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>NAMA</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{popup.data.nama}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>EMAIL</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{popup.data.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>PERAN</div>
              <span
                className={`ad-chip ${popup.data.peran === "Admin" ? "b" : popup.data.peran === "Petugas" ? "y" : ""}`}
                style={{ marginTop: 4 }}
              >
                {popup.data.peran}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7489", fontWeight: 700 }}>STATUS AKUN</div>
              <span className={`ad-chip ${popup.data.aktif ? "g" : "r"}`} style={{ marginTop: 4 }}>
                {popup.data.aktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button className="ad-btn y s" onClick={tutup}>Tutup</button>
            </div>
          </div>
        </Modal>
      )}

      {popup?.jenis === "hapusPengguna" && (
        <Konfirmasi
          judul="Hapus pengguna?"
          pesan={`Akun ${popup.data.nama} akan dihapus permanen.`}
          label="Hapus"
          onYa={() => hapusPengguna(popup.data.id)}
          onBatal={tutup}
        />
      )}
    </>
  );
}