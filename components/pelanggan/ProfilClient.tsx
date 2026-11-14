"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

interface AddressItem {
  id: string;
  label: string; // misal: "Rumah", "Kost", "Kantor"
  alamatLengkap: string;
  catatan?: string;
  isUtama: boolean;
}

export default function ProfilClient() {
  /* ─── State Data Diri (Dinamis dengan LocalStorage) ─── */
  const [profile, setProfile] = useState({
    nama: "Asahi Sakura",
    email: "asahisakuraa@gmail.com",
    telepon: "0812-3456-7890",
  });

  /* ─── State Daftar Alamat (Dinamis) ─── */
  const [alamatList, setAlamatList] = useState<AddressItem[]>([
    {
      id: "addr-1",
      label: "Rumah Utama",
      alamatLengkap: "Jl. Mawar No. 12, RT 01/RW 02, Sukolilo, Surabaya",
      catatan: "Pagar hitam, sebelah toko kelontong",
      isUtama: true,
    },
    {
      id: "addr-2",
      label: "Kost / Kantor",
      alamatLengkap: "Jl. Dharmahusada Indah No. 45, Gubeng, Surabaya",
      catatan: "Kamar 204 lantai 2",
      isUtama: false,
    },
  ]);

  /* ─── State Form Tambah Alamat ─── */
  const [showTambahAlamat, setShowTambahAlamat] = useState(false);
  const [newAlamat, setNewAlamat] = useState({
    label: "",
    alamatLengkap: "",
    catatan: "",
    isUtama: false,
  });

  /* ─── State Ubah Password ─── */
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  /* ─── Load data dari localStorage jika ada ─── */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("laundyku_user_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nama) setProfile((prev) => ({ ...prev, nama: parsed.nama }));
          if (parsed.email) setProfile((prev) => ({ ...prev, email: parsed.email }));
          if (parsed.telepon) setProfile((prev) => ({ ...prev, telepon: parsed.telepon }));
          if (parsed.alamat) {
            setAlamatList((prev) => [
              {
                id: "addr-saved",
                label: "Alamat Pendaftaran",
                alamatLengkap: parsed.alamat,
                catatan: "Alamat default akun",
                isUtama: true,
              },
              ...prev.map((a) => ({ ...a, isUtama: false })),
            ]);
          }
        } catch {}
      }

      const savedAddresses = localStorage.getItem("laundyku_user_addresses");
      if (savedAddresses) {
        try {
          const parsedAddr = JSON.parse(savedAddresses);
          if (Array.isArray(parsedAddr) && parsedAddr.length > 0) {
            setAlamatList(parsedAddr);
          }
        } catch {}
      }
    }
  }, []);

  /* ─── Handler Simpan Profil ─── */
  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("laundyku_user_profile", JSON.stringify(profile));
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  /* ─── Handler Tambah Alamat ─── */
  function handleTambahAlamatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newAlamat.label.trim() || !newAlamat.alamatLengkap.trim()) return;

    const itemBaru: AddressItem = {
      id: "addr-" + Date.now(),
      label: newAlamat.label,
      alamatLengkap: newAlamat.alamatLengkap,
      catatan: newAlamat.catatan,
      isUtama: newAlamat.isUtama || alamatList.length === 0,
    };

    let updatedList = [...alamatList];
    if (itemBaru.isUtama) {
      updatedList = updatedList.map((a) => ({ ...a, isUtama: false }));
    }
    updatedList.push(itemBaru);

    setAlamatList(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("laundyku_user_addresses", JSON.stringify(updatedList));
    }

    setNewAlamat({ label: "", alamatLengkap: "", catatan: "", isUtama: false });
    setShowTambahAlamat(false);
  }

  /* ─── Handler Set Alamat Utama ─── */
  function setAlamatUtama(id: string) {
    const updated = alamatList.map((a) => ({
      ...a,
      isUtama: a.id === id,
    }));
    setAlamatList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("laundyku_user_addresses", JSON.stringify(updated));
    }
  }

  /* ─── Handler Hapus Alamat ─── */
  function hapusAlamat(id: string) {
    const updated = alamatList.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isUtama)) {
      updated[0].isUtama = true;
    }
    setAlamatList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("laundyku_user_addresses", JSON.stringify(updated));
    }
  }

  /* ─── Handler Ubah Password ─── */
  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (!passwordForm.oldPassword) {
      setPasswordError("Password lama wajib diisi");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    setPasswordSaved(true);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  // Ambil inisial nama untuk avatar dinamis
  const initials = profile.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
      }}
    >
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          href="/pelanggan"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#0B2A6B",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke dashboard pelanggan
        </Link>
      </div>

      {/* Header Judul Halaman */}
      <div>
        <h1
          style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
            fontSize: 42,
            color: "#1457D6",
          }}
        >
          Profil Saya
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 15,
            color: "#4A5A80",
          }}
        >
          Kelola informasi akun pribadi, daftar alamat jemput, dan keamanan kata sandi.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════
          CARD 1: BANNER PROFIL DINAMIS & STATISTIK
      ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 20,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: "32px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
          color: "#0B2A6B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar Lingkaran Dinamis */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#1457D6",
              color: "#FFD21F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Archivo Black', Impact, sans-serif",
              fontSize: 32,
              border: "3px solid #0B2A6B",
              boxShadow: "3px 3px 0 #0B2A6B",
              flexShrink: 0,
            }}
          >
            {initials || "U"}
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 26,
                lineHeight: 1.2,
                color: "#0B2A6B",
              }}
            >
              {profile.nama}
            </div>
            <div style={{ fontSize: 14, color: "#4A5A80", marginTop: 4 }}>
              {profile.email} · {profile.telepon}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  display: "inline-block",
                  border: "2px solid #0B2A6B",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#FFD21F",
                  color: "#0B2A6B",
                  textTransform: "uppercase",
                }}
              >
                Pelanggan Aktif
              </span>
              <span
                style={{
                  display: "inline-block",
                  border: "2px solid #0B2A6B",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#E8F5E9",
                  color: "#2E7D32",
                }}
              >
                ⭐ 120 Poin Laundry
              </span>
            </div>
          </div>
        </div>

        {/* Info Ringkasan Cepat */}
        <div
          style={{
            display: "flex",
            gap: 24,
            background: "#FFF4DE",
            border: "2px solid #0B2A6B",
            borderRadius: 16,
            padding: "16px 24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                fontSize: 24,
                color: "#1457D6",
              }}
            >
              4
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0B2A6B", textTransform: "uppercase" }}>
              Pesanan Selesai
            </div>
          </div>
          <div style={{ width: 2, background: "#C9B98F" }} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                fontSize: 24,
                color: "#1457D6",
              }}
            >
              {alamatList.length}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0B2A6B", textTransform: "uppercase" }}>
              Alamat Tersimpan
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Data Diri & Keamanan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 28,
        }}
      >
        {/* ════════════════════════════════════════════════════════════
            CARD 2: DATA DIRI (DINAMIS EDIT)
        ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#fff",
            border: "2px solid #0B2A6B",
            borderRadius: 20,
            boxShadow: "5px 5px 0 #0B2A6B",
            padding: 32,
            color: "#0B2A6B",
          }}
        >
          <h2
            style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              textTransform: "uppercase",
              fontSize: 24,
              color: "#1457D6",
              marginBottom: 8,
            }}
          >
            Data Diri
          </h2>
          <p style={{ fontSize: 14, color: "#4A5A80", margin: "0 0 20px" }}>
            Perbarui nama lengkap, email, dan kontak WhatsApp aktif.
          </p>

          {profileSaved && (
            <p
              role="alert"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#E8F5E9",
                border: "2px solid #2E7D32",
                fontSize: 14,
                color: "#1B5E20",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              ✓ Data profil berhasil diperbarui!
            </p>
          )}

          <form onSubmit={handleProfileSubmit}>
            <Field label="Nama Lengkap" id="profil-nama">
              <input
                type="text"
                value={profile.nama}
                onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                required
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <Field label="Alamat Email" id="profil-email">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <Field label="No. WhatsApp" id="profil-wa">
              <input
                type="tel"
                value={profile.telepon}
                onChange={(e) => setProfile({ ...profile, telepon: e.target.value })}
                required
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <div style={{ marginTop: 24 }}>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CARD 3: KEAMANAN & UBAH PASSWORD
        ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#fff",
            border: "2px solid #0B2A6B",
            borderRadius: 20,
            boxShadow: "5px 5px 0 #0B2A6B",
            padding: 32,
            color: "#0B2A6B",
          }}
        >
          <h2
            style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              textTransform: "uppercase",
              fontSize: 24,
              color: "#1457D6",
              marginBottom: 8,
            }}
          >
            Ubah Password
          </h2>
          <p style={{ fontSize: 14, color: "#4A5A80", margin: "0 0 20px" }}>
            Gunakan kata sandi yang aman minimal 8 karakter.
          </p>

          {passwordSaved && (
            <p
              role="alert"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#E8F5E9",
                border: "2px solid #2E7D32",
                fontSize: 14,
                color: "#1B5E20",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              ✓ Password baru berhasil disimpan!
            </p>
          )}

          {passwordError && (
            <p
              role="alert"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(212,42,37,0.1)",
                border: "2px solid #D42A25",
                fontSize: 14,
                color: "#D42A25",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              {passwordError}
            </p>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <Field label="Password Lama" id="pass-lama">
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <Field
              label="Password Baru"
              id="pass-baru"
              hint="Minimal 8 karakter kombinasi huruf & angka"
            >
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <Field label="Ulangi Password Baru" id="pass-konfirm">
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                style={{ fontSize: 15, padding: "12px 16px" }}
              />
            </Field>

            <div style={{ marginTop: 24 }}>
              <Button type="submit">Perbarui Password</Button>
            </div>
          </form>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════
          CARD 4: KELOLA DAFTAR ALAMAT JEMPUT (DINAMIS)
      ════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 20,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 32,
          color: "#0B2A6B",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 24,
                color: "#1457D6",
                margin: 0,
              }}
            >
              Daftar Alamat Jemput / Antar
            </h2>
            <p style={{ fontSize: 14, color: "#4A5A80", margin: "6px 0 0" }}>
              Kelola alamat tujuan penjemputan dan pengantaran cucianmu secara praktis.
            </p>
          </div>
          <Button
            type="button"
            variant="yellow"
            onClick={() => setShowTambahAlamat(!showTambahAlamat)}
          >
            {showTambahAlamat ? "✕ Tutup Form" : "+ Tambah Alamat Baru"}
          </Button>
        </div>

        {/* Form Tambah Alamat Baru */}
        {showTambahAlamat && (
          <form
            onSubmit={handleTambahAlamatSubmit}
            style={{
              background: "#FFF4DE",
              border: "2px solid #0B2A6B",
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 18,
                color: "#0B2A6B",
                marginBottom: 16,
              }}
            >
              Tambah Alamat Baru
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <Field label="Label Alamat" id="new-label" hint="Contoh: Rumah, Kost, Kantor">
                <input
                  type="text"
                  placeholder="Rumah Orang Tua"
                  value={newAlamat.label}
                  onChange={(e) => setNewAlamat({ ...newAlamat, label: e.target.value })}
                  required
                  style={{ fontSize: 14 }}
                />
              </Field>
              <Field label="Patokan / Catatan" id="new-catatan" hint="Opsional">
                <input
                  type="text"
                  placeholder="Pagar putih, dekat minimarket"
                  value={newAlamat.catatan}
                  onChange={(e) => setNewAlamat({ ...newAlamat, catatan: e.target.value })}
                  style={{ fontSize: 14 }}
                />
              </Field>
            </div>
            <Field label="Alamat Lengkap" id="new-alamat" required>
              <textarea
                rows={2}
                placeholder="Jl. Raya Kertajaya Indah No. 10..."
                value={newAlamat.alamatLengkap}
                onChange={(e) =>
                  setNewAlamat({ ...newAlamat, alamatLengkap: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </Field>

            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 20px" }}>
              <input
                type="checkbox"
                id="is-utama"
                checked={newAlamat.isUtama}
                onChange={(e) => setNewAlamat({ ...newAlamat, isUtama: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: "#1457D6" }}
              />
              <label htmlFor="is-utama" style={{ fontSize: 14, fontWeight: 600, color: "#0B2A6B" }}>
                Jadikan sebagai alamat utama
              </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Button type="submit">Simpan Alamat</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTambahAlamat(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        )}

        {/* List Card Alamat */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {alamatList.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: addr.isUtama ? "3px solid #1457D6" : "2px solid #0B2A6B",
                borderRadius: 16,
                padding: 20,
                background: addr.isUtama ? "rgba(20,87,214,0.04)" : "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Archivo Black', Impact, sans-serif",
                      textTransform: "uppercase",
                      fontSize: 16,
                      color: "#0B2A6B",
                    }}
                  >
                    📍 {addr.label}
                  </span>
                  {addr.isUtama && (
                    <span
                      style={{
                        background: "#1457D6",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                      }}
                    >
                      Utama
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, margin: "0 0 6px", lineHeight: 1.5, color: "#0B2A6B" }}>
                  {addr.alamatLengkap}
                </p>
                {addr.catatan && (
                  <p style={{ fontSize: 12, color: "#4A5A80", margin: 0, fontStyle: "italic" }}>
                    Catatan: {addr.catatan}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", borderTop: "1px dashed #C9B98F", paddingTop: 14 }}>
                {!addr.isUtama && (
                  <button
                    type="button"
                    onClick={() => setAlamatUtama(addr.id)}
                    style={{
                      background: "none",
                      border: "1.5px solid #1457D6",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1457D6",
                      cursor: "pointer",
                    }}
                  >
                    Pilih Utama
                  </button>
                )}
                {alamatList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => hapusAlamat(addr.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#D42A25",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: "6px 8px",
                    }}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
