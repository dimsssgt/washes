"use client";

import { useState } from "react";
import Modal, { Konfirmasi } from "./Modal";
import { FormHarga, FormLayanan, FormPengguna } from "./FormAdmin";
import { formatRupiah } from "@/lib/admin/rekap";
import { TrashIcon, EyeIcon, EditIcon } from "./Icons";
import type { Harga, Layanan, Pengguna } from "@/lib/admin/types";

type Popup =
  | { jenis: "layanan"; data: Layanan | null }
  | { jenis: "lihatLayanan"; data: Layanan }
  | { jenis: "hapusLayanan"; data: Layanan }
  | { jenis: "harga"; data: Harga }
  | { jenis: "pengguna"; data: Pengguna | null }
  | { jenis: "lihatPengguna"; data: Pengguna }
  | { jenis: "nonaktifkan"; data: Pengguna }
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

  function simpanHarga(
    id: string,
    reguler: number,
    oneDay: number | null,
    express: number | null,
    quick: number | null,
  ) {
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

  return (
    <>
      <div className="ad-kepala">
        <h1 className="ad-d" style={{ fontSize: 40, color: "var(--b)" }}>
          Kelola
        </h1>
      </div>

      <section id="kelola-layanan" className="ad-kartu">
        <h2 className="ad-d">Layanan</h2>
        <div className="ad-scroll">
          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {layanan.map((l) => (
                <tr key={l.id}>
                  <td>{l.nama}</td>
                  <td>{l.deskripsi || "-"}</td>
                  <td>
                    <span className={`ad-chip ${l.aktif ? "g" : "r"}`}>{l.aktif ? "Aktif" : "Nonaktif"}</span>
                  </td>
                  <td>
                    <div className="ad-baris-aksi" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        type="button"
                        className="ad-btn s"
                        style={{ padding: "6px 12px", fontSize: 12, background: "#1457D6", color: "#fff", display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => setPopup({ jenis: "lihatLayanan", data: l })}
                        title="Lihat detail layanan"
                      >
                        <EyeIcon size={14} /> Baca
                      </button>
                      <button
                        type="button"
                        className="ad-btn y s"
                        style={{ padding: "6px 12px", fontSize: 12, display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => setPopup({ jenis: "layanan", data: l })}
                        title="Edit layanan"
                      >
                        <EditIcon size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="ad-btn r icon ad-aksi-hapus"
                        style={{ width: 34, height: 34, padding: 0 }}
                        onClick={() => setPopup({ jenis: "hapusLayanan", data: l })}
                        title="Hapus layanan"
                        aria-label={`Hapus layanan ${l.nama}`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="ad-btn" onClick={() => setPopup({ jenis: "layanan", data: null })}>
            Tambah layanan
          </button>
        </div>
      </section>

      <section id="kelola-harga" className="ad-kartu">
        <h2 className="ad-d">Harga</h2>
        <div className="ad-scroll">
          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Satuan</th>
                <th>Reguler</th>
                <th>One Day</th>
                <th>Express</th>
                <th>Quick</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {harga.map((h) => (
                <tr key={h.id}>
                  <td>{h.layanan}</td>
                  <td>{h.satuan}</td>
                  <td>{formatRupiah(h.reguler)}</td>
                  <td>{h.oneDay === null ? "-" : formatRupiah(h.oneDay)}</td>
                  <td>{h.express === null ? "-" : formatRupiah(h.express)}</td>
                  <td>{h.quick === null ? "-" : formatRupiah(h.quick)}</td>
                  <td>
                    <button className="ad-btn y s" onClick={() => setPopup({ jenis: "harga", data: h })}>
                      Ubah
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="kelola-pengguna" className="ad-kartu">
        <h2 className="ad-d">Pengguna</h2>
        <div className="ad-scroll">
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
                  <td>{p.nama}</td>
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
                    <div className="ad-baris-aksi" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        type="button"
                        className="ad-btn s"
                        style={{ padding: "6px 12px", fontSize: 12, background: "#1457D6", color: "#fff", display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => setPopup({ jenis: "lihatPengguna", data: p })}
                        title="Lihat detail pengguna"
                      >
                        <EyeIcon size={14} /> Baca
                      </button>
                      <button
                        type="button"
                        className="ad-btn y s"
                        style={{ padding: "6px 12px", fontSize: 12, display: "inline-flex", gap: 4, alignItems: "center" }}
                        onClick={() => setPopup({ jenis: "pengguna", data: p })}
                        title="Edit pengguna"
                      >
                        <EditIcon size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="ad-btn r icon ad-aksi-hapus"
                        style={{ width: 34, height: 34, padding: 0 }}
                        onClick={() => setPopup({ jenis: "hapusPengguna", data: p })}
                        title="Hapus pengguna"
                        aria-label={`Hapus pengguna ${p.nama}`}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="ad-btn" onClick={() => setPopup({ jenis: "pengguna", data: null })}>
            Tambah pengguna
          </button>
        </div>
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
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>NAMA LAYANAN</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{popup.data.nama}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>DESKRIPSI</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{popup.data.deskripsi || "Tidak ada deskripsi tambahan."}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>STATUS</div>
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
            onSimpan={(reguler, oneDay, express, quick) =>
              simpanHarga(popup.data.id, reguler, oneDay, express, quick)
            }
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
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>NAMA</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{popup.data.nama}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>EMAIL</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{popup.data.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>PERAN</div>
              <span className={`ad-chip ${popup.data.peran === "Admin" ? "b" : popup.data.peran === "Petugas" ? "y" : ""}`} style={{ marginTop: 4 }}>
                {popup.data.peran}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#4A5A80", fontWeight: 700 }}>STATUS AKUN</div>
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