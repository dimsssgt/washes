"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";

export default function ProfilClient() {
  const [profile, setProfile] = useState({
    nama: "Asahi Sakura",
    email: "asahisakuraa@gmail.com",
    telepon: "0812-3456-7890",
    alamat: "Jl. Mawar No. 12, Sukolilo, Surabaya",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    setPasswordSaved(true);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  return (
    <div style={{ maxWidth: 860, display: "flex", flexDirection: "column", gap: 28 }}>
      <h1
        style={{
          fontFamily: "'Archivo Black', Impact, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          margin: 0,
          fontSize: 40,
          color: "#1457D6",
        }}
      >
        Profil saya
      </h1>

      {/* Profile Card Summary */}
      <div
        style={{
          background: "#fff",
          border: "2px solid #0B2A6B",
          borderRadius: 18,
          boxShadow: "5px 5px 0 #0B2A6B",
          padding: 24,
          textAlign: "center",
          color: "#0B2A6B",
        }}
      >
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", fontSize: 20 }}>
          {profile.nama}
        </div>
        <div style={{ margin: "10px 0 0" }}>
          <span
            style={{
              display: "inline-block",
              border: "2px solid #0B2A6B",
              borderRadius: 999,
              padding: "3px 14px",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              background: "#FFD21F",
              color: "#0B2A6B",
            }}
          >
            Pelanggan
          </span>
        </div>
      </div>

      {/* Data Diri Form */}
      <section
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
            fontSize: 22,
            color: "#1457D6",
            marginBottom: 8,
          }}
        >
          Data diri
        </h2>

        {profileSaved && (
          <p
            role="alert"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(18,128,92,0.1)",
              border: "1px solid #12805C",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 12,
              color: "#12805C",
              fontWeight: 700,
              margin: "12px 0",
            }}
          >
            Perubahan profil berhasil disimpan!
          </p>
        )}

        <form onSubmit={handleProfileSubmit}>
          <Field label="Nama lengkap" id="profil-nama">
            <input
              type="text"
              value={profile.nama}
              onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
            />
          </Field>

          <Field label="Email" id="profil-email">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Field>

          <Field label="No. WhatsApp" id="profil-wa">
            <input
              type="tel"
              value={profile.telepon}
              onChange={(e) => setProfile({ ...profile, telepon: e.target.value })}
            />
          </Field>

          <Field label="Alamat jemput utama" id="profil-alamat">
            <textarea
              rows={3}
              value={profile.alamat}
              onChange={(e) => setProfile({ ...profile, alamat: e.target.value })}
            />
          </Field>

          <div style={{ marginTop: 24 }}>
            <Button type="submit">Simpan perubahan</Button>
          </div>
        </form>
      </section>

      {/* Ubah Password Form */}
      <section
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
            fontSize: 22,
            color: "#1457D6",
            marginBottom: 8,
          }}
        >
          Ubah password
        </h2>

        {passwordSaved && (
          <p
            role="alert"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(18,128,92,0.1)",
              border: "1px solid #12805C",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 12,
              color: "#12805C",
              fontWeight: 700,
              margin: "12px 0",
            }}
          >
            Password berhasil diperbarui!
          </p>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <Field label="Password lama" id="pass-lama">
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            />
          </Field>

          <Field label="Password baru" id="pass-baru" hint="Minimal 8 karakter">
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </Field>

          <Field label="Ulangi password baru" id="pass-konfirm">
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </Field>

          <div style={{ marginTop: 24 }}>
            <Button type="submit">Perbarui password</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
