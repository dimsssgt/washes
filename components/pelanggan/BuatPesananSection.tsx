"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

type LayananTab = "kiloan" | "satuan" | "linen";
type MetodePengantaran = "antar-jemput" | "drop-mandiri";

interface ItemPriced {
  id: string;
  nama: string;
  hargaReguler: number;
  hargaExpress: number;
  unit: string;
}

const linenItems: ItemPriced[] = [
  { id: "sprei", nama: "Sprei", hargaReguler: 20000, hargaExpress: 28000, unit: "pcs" },
  { id: "bed_cover", nama: "Bed cover", hargaReguler: 30000, hargaExpress: 40000, unit: "pcs" },
  { id: "selimut", nama: "Selimut", hargaReguler: 25000, hargaExpress: 35000, unit: "pcs" },
  { id: "gorden", nama: "Gorden (per meter)", hargaReguler: 10000, hargaExpress: 15000, unit: "meter" },
  { id: "bantal", nama: "Bantal / guling", hargaReguler: 15000, hargaExpress: 22000, unit: "pcs" },
];

const satuanItems: ItemPriced[] = [
  { id: "kemeja", nama: "Kemeja / blus", hargaReguler: 12000, hargaExpress: 18000, unit: "pcs" },
  { id: "celana", nama: "Celana / rok", hargaReguler: 12000, hargaExpress: 18000, unit: "pcs" },
  { id: "jas", nama: "Jas / blazer", hargaReguler: 30000, hargaExpress: 40000, unit: "pcs" },
  { id: "jaket", nama: "Jaket", hargaReguler: 25000, hargaExpress: 35000, unit: "pcs" },
  { id: "gaun", nama: "Gaun", hargaReguler: 35000, hargaExpress: 45000, unit: "pcs" },
];

const tabLabels: Record<LayananTab, string> = {
  kiloan: "Kiloan",
  satuan: "Satuan",
  linen: "Linen",
};

const tabInfo: Record<LayananTab, string> = {
  kiloan: "Kiloan dihitung per kg, minimal 3 kg. Berat final ditentukan petugas saat penimbangan.",
  satuan: "Satuan dihitung per item, tanpa minimal. Isi jumlah tiap jenis pakaian yang ingin dicuci.",
  linen: "Linen dihitung per item atau per meter, tanpa minimal. Isi jumlah tiap jenis yang ingin dicuci.",
};

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const labelKecepatanMap: Record<string, string> = {
  reguler: "Reguler",
  "one-day": "One Day",
  express: "Express",
  quick: "Quick",
};

export default function BuatPesananSection() {
  const [tab, setTab] = useState<LayananTab>("kiloan");
  const [metode, setMetode] = useState<MetodePengantaran>("antar-jemput");
  const [kecepatan, setKecepatan] = useState<"reguler" | "one-day" | "express" | "quick">("reguler");
  const [tanggalJemput, setTanggalJemput] = useState("");
  const [jamJemput, setJamJemput] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [showTerkirim, setShowTerkirim] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState("LDY-20261030-018");

  // State kuantitas per item
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  function updateCount(id: string, delta: number) {
    setItemCounts((prev) => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  }

  function setCountDirect(id: string, val: string) {
    const num = parseInt(val, 10);
    setItemCounts((prev) => ({
      ...prev,
      [id]: isNaN(num) || num < 0 ? 0 : num,
    }));
  }

  // Hitung total item & total biaya (untuk Linen & Satuan)
  const currentList = tab === "linen" ? linenItems : tab === "satuan" ? satuanItems : [];
  const totalItemCount = currentList.reduce((sum, item) => sum + (itemCounts[item.id] || 0), 0);
  const totalEstimasiHarga = currentList.reduce((sum, item) => {
    const count = itemCounts[item.id] || 0;
    const price = kecepatan === "express" ? item.hargaExpress : item.hargaReguler;
    return sum + count * price;
  }, 0);

  async function handleKirim(e: React.FormEvent) {
    e.preventDefault();

    if ((tab === "linen" || tab === "satuan") && totalItemCount === 0) {
      alert("Pilih minimal 1 item barang yang ingin dicuci!");
      return;
    }

    setShowKonfirmasi(true);
  }

  return (
    <>
      <section
        id="buat-pesanan"
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 18,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 28,
          color: "#0B2A6B",
        }}
      >
        <h2
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            fontSize: 24,
            color: "#1457D6",
            marginBottom: 16,
          }}
        >
          Buat pesanan
        </h2>

        {/* Tab pilih layanan */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {(Object.keys(tabLabels) as LayananTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setItemCounts({});
                if (t !== "kiloan" && (kecepatan === "one-day" || kecepatan === "quick")) {
                  setKecepatan("reguler");
                }
              }}
              style={{
                display: "inline-block",
                border: "2px solid #0B2A6B",
                borderRadius: 999,
                padding: "8px 16px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
                background: tab === t ? "#1457D6" : "#FFF4DE",
                color: tab === t ? "#fff" : "#0B2A6B",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, margin: "12px 0 0" }}>
          {tabInfo[tab]}
        </p>

        {/* TABEL ITEM (HANYA MUNCUL DI TAB LINEN & SATUAN) */}
        {(tab === "linen" || tab === "satuan") && (
          <div
            style={{
              marginTop: 16,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 460, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase" }}>
                      Jenis
                    </th>
                    <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase" }}>
                      Reguler 3 hari
                    </th>
                    <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase" }}>
                      Express
                    </th>
                    <th style={{ textAlign: "center", padding: "10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase" }}>
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentList.map((item) => {
                    const count = itemCounts[item.id] || 0;
                    return (
                      <tr key={item.id}>
                        <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>
                          {item.nama}
                        </td>
                        <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 13, color: kecepatan === "reguler" ? "#1457D6" : "inherit", fontWeight: kecepatan === "reguler" ? 700 : "normal" }}>
                          {formatRupiah(item.hargaReguler)}
                        </td>
                        <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", fontFamily: "'Space Mono', monospace", fontSize: 13, color: kecepatan === "express" ? "#1457D6" : "inherit", fontWeight: kecepatan === "express" ? 700 : "normal" }}>
                          {formatRupiah(item.hargaExpress)}
                        </td>
                        <td style={{ padding: "12px 10px", borderBottom: "2px dashed #C9B98F", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => updateCount(item.id, -1)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                border: "2px solid #0B2A6B",
                                background: "#FFF4DE",
                                cursor: "pointer",
                                fontWeight: 700,
                                fontFamily: "'Space Mono', monospace",
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={count}
                              onChange={(e) => setCountDirect(item.id, e.target.value)}
                              style={{
                                width: 50,
                                minHeight: 34,
                                textAlign: "center",
                                padding: "4px",
                                border: "2px solid #0B2A6B",
                                borderRadius: 8,
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => updateCount(item.id, 1)}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                border: "2px solid #0B2A6B",
                                background: "#FFD21F",
                                cursor: "pointer",
                                fontWeight: 700,
                                fontFamily: "'Space Mono', monospace",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Box */}
            <div
              style={{
                marginTop: 14,
                padding: "12px 16px",
                background: "#EEF2F7",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span>Total item: <b>{totalItemCount} barang</b></span>
              <span>Estimasi biaya: <b style={{ fontSize: 16, color: "#1457D6" }}>{formatRupiah(totalEstimasiHarga)}</b></span>
            </div>
          </div>
        )}

        <form onSubmit={handleKirim} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Kecepatan */}
            <Field label="Kecepatan" id="kecepatan">
              <select
                value={kecepatan}
                onChange={(e) => setKecepatan(e.target.value as "reguler" | "one-day" | "express" | "quick")}
              >
                {tab === "kiloan" ? (
                  <>
                    <option value="reguler">Reguler · 3 hari</option>
                    <option value="one-day">One Day · 24 jam</option>
                    <option value="express">Express · 6 jam</option>
                    <option value="quick">Quick · 3 jam</option>
                  </>
                ) : (
                  <>
                    <option value="reguler">Reguler · 3 hari</option>
                    <option value="express">Express · 24 jam</option>
                  </>
                )}
              </select>
            </Field>

            {/* Metode Pengantaran (tepat di bawah Kecepatan) */}
            <div style={{ marginTop: 14 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#0B2A6B",
                  marginBottom: 6,
                }}
              >
                Metode pengantaran
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["antar-jemput", "drop-mandiri"] as MetodePengantaran[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetode(m)}
                    style={{
                      display: "inline-block",
                      border: "2px solid #0B2A6B",
                      borderRadius: 999,
                      padding: "8px 16px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      background: metode === m ? "#1457D6" : "#fff",
                      color: metode === m ? "#fff" : "#0B2A6B",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {m === "antar-jemput" ? "Antar jemput" : "Drop mandiri"}
                  </button>
                ))}
              </div>
            </div>

            {/* Hanya jika Antar Jemput: Tanggal Jemput (Hari), Jam Jemput, dan Alamat */}
            {metode === "antar-jemput" && (
              <>
                <Field label="Tanggal jemput" id="tanggalJemput">
                  <input
                    type="date"
                    value={tanggalJemput}
                    onChange={(e) => setTanggalJemput(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Field>

                <Field label="Jam jemput" id="jamJemput">
                  <input
                    type="time"
                    value={jamJemput}
                    onChange={(e) => setJamJemput(e.target.value)}
                  />
                </Field>

                <Field label="Alamat jemput" id="alamat">
                  <textarea
                    rows={3}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Jl. ..."
                  />
                </Field>
              </>
            )}

            {/* Catatan (opsional) */}
            <Field label="Catatan (opsional)" id="catatan">
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Cth: tanpa parfum"
              />
            </Field>
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#0B2A6B" }}>
              {tab === "kiloan"
                ? "Total dihitung otomatis setelah penimbangan berat cucian."
                : "Total dihitung otomatis dari jumlah item."}
            </span>
            <Button type="submit" loading={loading}>
              Kirim pesanan
            </Button>
          </div>
        </form>
      </section>

      {/* Modal KonfirmasiKirimPesanan */}
      {showKonfirmasi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(51,71,126,0.85)" }}
          onClick={() => setShowKonfirmasi(false)}
        >
          <div
            style={{
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 28,
              maxWidth: 400,
              width: "100%",
              fontFamily: "'Space Mono', monospace",
              color: "#0B2A6B",
            }}
          >
            <h2
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 20,
                color: "#1457D6",
                marginBottom: 12,
              }}
            >
              Konfirmasi kirim pesanan
            </h2>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Pastikan detail pesananmu sudah benar. Pesanan yang sudah dikirim akan masuk ke antrian.
            </p>

            <div style={{ background: "#EEF2F7", padding: "12px 14px", borderRadius: 12, marginBottom: 20, fontSize: 13 }}>
              <div>Layanan: <b>Cuci {tabLabels[tab]} ({labelKecepatanMap[kecepatan] || "Reguler"})</b></div>
              {tab !== "kiloan" && <div>Jumlah: <b>{totalItemCount} item ({formatRupiah(totalEstimasiHarga)})</b></div>}
              <div>Metode: <b>{metode === "antar-jemput" ? "Antar Jemput" : "Drop Mandiri"}</b></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button variant="yellow" size="sm" onClick={() => setShowKonfirmasi(false)}>
                Cek lagi
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  setLoading(true);
                  setShowKonfirmasi(false);
                  await new Promise((r) => setTimeout(r, 800));
                  setLoading(false);
                  setShowTerkirim(true);
                }}
              >
                Ya, kirim
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pesanan Terkirim */}
      {showTerkirim && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(51,71,126,0.85)" }}
          onClick={() => setShowTerkirim(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 28,
              boxSizing: "border-box",
              color: "#0B2A6B",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 22, color: "#1457D6", margin: 0 }}>
                Pesanan terkirim
              </h2>
              <button
                onClick={() => setShowTerkirim(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFD21F",
                  color: "#0B2A6B",
                  border: "none",
                  borderRadius: 999,
                  minHeight: 40,
                  width: 44,
                  cursor: "pointer",
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 13,
                  boxShadow: "inset 0 0 0 2px #0B2A6B",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: "center", margin: "14px 0" }}>
              <span
                style={{
                  display: "inline-block",
                  border: "2px solid #0B2A6B",
                  borderRadius: 999,
                  padding: "8px 22px",
                  fontSize: 26,
                  fontWeight: 700,
                  background: "#12805C",
                  color: "#fff",
                }}
              >
                ✔
              </span>
            </div>

            <p style={{ margin: "0 0 16px", textAlign: "center", fontSize: 13 }}>
              {metode === "antar-jemput"
                ? "Pesananmu sudah kami terima. Kurir akan menjemput sesuai jadwal."
                : "Pesananmu sudah kami catat. Silakan antar cucianmu ke outlet kami."}
            </p>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Kode pesanan</span>
                <b style={{ textAlign: "right" }}>{lastOrderCode}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Layanan</span>
                <b style={{ textAlign: "right" }}>{tabLabels[tab]} · {labelKecepatanMap[kecepatan] || "Reguler"}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Metode</span>
                <b style={{ textAlign: "right" }}>{metode === "antar-jemput" ? "Antar Jemput" : "Drop Mandiri"}</b>
              </div>
              {metode === "antar-jemput" && (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                  <span>Jadwal jemput</span>
                  <b style={{ textAlign: "right" }}>
                    {tanggalJemput || "Hari ini"}{jamJemput ? `, ${jamJemput}` : ""}
                  </b>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Harga</span>
                <b style={{ textAlign: "right" }}>
                  {tab === "kiloan" ? "Dihitung setelah ditimbang" : formatRupiah(totalEstimasiHarga)}
                </b>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <Button variant="yellow" size="sm" onClick={() => setShowTerkirim(false)}>
                Tutup
              </Button>
              <Link href="/pelanggan/aktif">
                <Button size="sm">
                  Lihat pesanan aktif
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
