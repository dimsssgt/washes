"use client";

import { useState } from "react";
import Modal from "./Modal";
import MenuAksi from "./MenuAksi";
import { TrashIcon } from "./Icons";
import { formatRupiah, formatTanggalPendek } from "@/lib/admin/rekap";
import type { ItemNota, PesananAktif, StatusPesanan } from "@/lib/admin/types";

const STATUS: StatusPesanan[] = ["Diterima", "Dicuci", "Dikeringkan", "Disetrika", "Siap diambil"];

const toneStatus = (s: StatusPesanan) => (s === "Siap diambil" ? "g" : s === "Diterima" ? "y" : "b");

const totalNota = (items: ItemNota[]) => items.reduce((s, i) => s + i.jumlah * i.harga, 0);

export default function PesananAktifCard({ awal }: { awal: PesananAktif[] }) {
  const [daftar, setDaftar] = useState<PesananAktif[]>(awal);
  const [aktif, setAktif] = useState<{ kode: string; mode: "lihat" | "edit" } | null>(null);
  const [draft, setDraft] = useState<PesananAktif | null>(null);

  const readonly = aktif?.mode === "lihat";

  function buka(kode: string, mode: "lihat" | "edit") {
    const p = daftar.find((x) => x.kode === kode);
    if (!p) return;
    setDraft(JSON.parse(JSON.stringify(p)) as PesananAktif);
    setAktif({ kode, mode });
  }

  function tutup() {
    setAktif(null);
    setDraft(null);
  }

  // TODO (Supabase): simpan nota ke tabel pesanan dan item_nota.
  function simpan() {
    if (!draft) return;
    setDaftar((ds) => ds.map((p) => (p.kode === draft.kode ? draft : p)));
    tutup();
  }

  function ubahJumlah(id: string, nilai: string) {
    const jumlah = Number(nilai);
    setDraft((d) =>
      d ? { ...d, items: d.items.map((i) => (i.id === id ? { ...i, jumlah: isNaN(jumlah) ? 0 : jumlah } : i)) } : d,
    );
  }

  function hapusItem(id: string) {
    setDraft((d) => (d ? { ...d, items: d.items.filter((i) => i.id !== id) } : d));
  }

  return (
    <section className="ad-kartu">
      <div className="ad-kepala-kartu">
        <h2 className="ad-d">Pesanan aktif</h2>
        <p className="ad-hint" style={{ margin: 0 }}>
          {daftar.length} pesanan sedang diproses
        </p>
      </div>

      <ul className="ad-pesanan-aktif">
        {daftar.map((p) => (
          <li key={p.kode}>
            <div className="ad-pa-info">
              <strong>{p.pelanggan}</strong>
              <span>
                {p.kode} · estimasi {formatTanggalPendek(p.estimasi.slice(0, 10))}
              </span>
            </div>
            <div className="ad-pa-kanan">
              <span className={`ad-chip ${toneStatus(p.status)}`}>{p.status}</span>
              <strong>{formatRupiah(totalNota(p.items))}</strong>
              <MenuAksi
                label={`Aksi untuk pesanan ${p.kode}`}
                items={[
                  { label: "Lihat nota", ikon: "lihat", onKlik: () => buka(p.kode, "lihat") },
                  { label: "Edit nota", ikon: "edit", onKlik: () => buka(p.kode, "edit") },
                ]}
              />
            </div>
          </li>
        ))}
      </ul>
      {daftar.length === 0 && <p className="ad-kosong">Tidak ada pesanan aktif.</p>}

      {aktif && draft && (
        <Modal judul={`${readonly ? "Nota" : "Edit nota"} ${draft.kode}`} onTutup={tutup}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="ad-nota-meta">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>PELANGGAN</div>
                <div style={{ fontWeight: 700 }}>{draft.pelanggan}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>STATUS</div>
                {readonly ? (
                  <span className={`ad-chip ${toneStatus(draft.status)}`}>{draft.status}</span>
                ) : (
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as StatusPesanan })}
                    aria-label="Status pesanan"
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>MASUK</div>
                <div>
                  {formatTanggalPendek(draft.masuk.slice(0, 10))} · {draft.masuk.slice(11, 16).replace(":", ".")}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>ESTIMASI SELESAI</div>
                <div>
                  {formatTanggalPendek(draft.estimasi.slice(0, 10))} · {draft.estimasi.slice(11, 16).replace(":", ".")}
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                  {!readonly && <th />}
                </tr>
              </thead>
              <tbody>
                {draft.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nama}</td>
                    <td>
                      {readonly ? (
                        `${i.jumlah} ${i.satuan}`
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input
                            className="ad-nota-jumlah"
                            type="number"
                            min={0}
                            step={0.5}
                            value={i.jumlah}
                            onChange={(e) => ubahJumlah(i.id, e.target.value)}
                            aria-label={`Jumlah ${i.nama}`}
                          />
                          <span>{i.satuan}</span>
                        </div>
                      )}
                    </td>
                    <td>{formatRupiah(i.harga)}</td>
                    <td>{formatRupiah(i.jumlah * i.harga)}</td>
                    {!readonly && (
                      <td>
                        <button
                          type="button"
                          className="ad-ikon hapus"
                          onClick={() => hapusItem(i.id)}
                          aria-label={`Hapus ${i.nama} dari nota`}
                          title="Hapus item"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {draft.items.length === 0 && <p className="ad-kosong">Belum ada item di nota ini.</p>}

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7489" }}>CATATAN</div>
              {readonly ? (
                <div>{draft.catatan || "-"}</div>
              ) : (
                <input
                  type="text"
                  value={draft.catatan}
                  onChange={(e) => setDraft({ ...draft, catatan: e.target.value })}
                  placeholder="Mis. pakai pelembut sedikit"
                />
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <strong>Total</strong>
              <strong style={{ fontSize: 18, color: "#1457D6" }}>{formatRupiah(totalNota(draft.items))}</strong>
            </div>

            <div className="ad-aksi">
              {readonly ? (
                <button className="ad-btn y s" onClick={tutup}>
                  Tutup
                </button>
              ) : (
                <>
                  <button className="ad-btn y s" onClick={tutup}>
                    Batal
                  </button>
                  <button className="ad-btn s" onClick={simpan}>
                    Simpan nota
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}