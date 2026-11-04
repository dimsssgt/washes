"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

type LayananTab = "kiloan" | "satuan" | "linen";
type MetodePengantaran = "antar-jemput" | "drop-mandiri";

const tabLabels: Record<LayananTab, string> = {
  kiloan: "Kiloan",
  satuan: "Satuan",
  linen: "Linen",
};

const tabInfo: Record<LayananTab, string> = {
  kiloan: "Kiloan dihitung per kg, minimal 3 kg. Berat final ditentukan petugas saat penimbangan.",
  satuan: "Satuan dihitung per item pakaian. Cocok untuk pakaian yang perlu penanganan khusus.",
  linen: "Untuk selimut, sprei, bantal, dan perlengkapan tidur lainnya.",
};

export default function BuatPesananSection() {
  const [tab, setTab] = useState<LayananTab>("kiloan");
  const [metode, setMetode] = useState<MetodePengantaran>("antar-jemput");
  const [kecepatan, setKecepatan] = useState("reguler");
  const [tanggalJemput, setTanggalJemput] = useState("");
  const [jamJemput, setJamJemput] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [showTerkirim, setShowTerkirim] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState("LDY-20261030-018");

  async function handleKirim(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Validasi dan buka modal konfirmasi
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
              onClick={() => setTab(t)}
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

        <form onSubmit={handleKirim} style={{ marginTop: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "0 28px",
            }}
          >
            {/* Kolom kiri */}
            <div>
              <Field label="Kecepatan" id="kecepatan">
                <select
                  value={kecepatan}
                  onChange={(e) => setKecepatan(e.target.value)}
                >
                  <option value="reguler">Reguler · 3 hari</option>
                  <option value="express">Express · 6 jam</option>
                </select>
              </Field>
              <Field label="Tanggal jemput" id="tanggalJemput">
                <input
                  type="date"
                  value={tanggalJemput}
                  onChange={(e) => setTanggalJemput(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </Field>
            </div>

            {/* Kolom kanan */}
            <div>
              {/* Metode pengantaran */}
              <div style={{ marginTop: 14, marginBottom: 6 }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#0B2A6B",
                  }}
                >
                  Metode pengantaran
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
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
                        background: metode === m ? "#1457D6" : "#FFF4DE",
                        color: metode === m ? "#fff" : "#0B2A6B",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {m === "antar-jemput" ? "Antar jemput" : "Drop mandiri"}
                    </button>
                  ))}
                </div>
              </div>

              {metode === "antar-jemput" && (
                <>
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

              {metode === "drop-mandiri" && (
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    marginTop: 12,
                    padding: "12px 16px",
                    background: "#FFF4DE",
                    border: "2px dashed #0B2A6B",
                    borderRadius: 12,
                  }}
                >
                  Antar langsung ke outlet kami sesuai tanggal yang dipilih.
                </p>
              )}

              <Field label="Catatan (opsional)" id="catatan">
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Cth: tanpa parfum"
                />
              </Field>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button type="submit" loading={loading}>
              Kirim pesanan
            </Button>
          </div>
        </form>
      </section>

      {/* TODO: Modal KonfirmasiKirimPesanan */}
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
            <p style={{ fontSize: 13, marginBottom: 24 }}>
              Pastikan detail pesananmu sudah benar. Pesanan yang sudah dikirim akan masuk ke antrian.
            </p>
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
              Pesananmu sudah kami terima. Kurir akan menjemput sesuai jadwal.
            </p>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Kode pesanan</span>
                <b style={{ textAlign: "right" }}>{lastOrderCode}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Layanan</span>
                <b style={{ textAlign: "right" }}>{tabLabels[tab]} · {kecepatan === "reguler" ? "Reguler" : "Express"}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Jadwal jemput</span>
                <b style={{ textAlign: "right" }}>{tanggalJemput || "30 Okt 2026"}, {jamJemput || "10.00"}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "2px dashed #C9B98F", fontSize: 13 }}>
                <span>Harga</span>
                <b style={{ textAlign: "right" }}>Dihitung setelah ditimbang</b>
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
