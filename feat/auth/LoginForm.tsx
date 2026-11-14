"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSessionCookie, displayNameFromIdentifier } from "./session";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "./schema";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import LupaPasswordModal from "./LupaPasswordModal";

type LoginFieldErrors = Partial<Record<keyof LoginInput, string>>;
type RegisterFieldErrors = Partial<Record<keyof RegisterInput, string>>;
type KategoriRole = "pelanggan" | "petugas" | "admin";
type AuthMode = "masuk" | "daftar";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("masuk");

  /* ─── State Mode Masuk ─── */
  const [kategori, setKategori] = useState<KategoriRole>("pelanggan");
  const [loginValues, setLoginValues] = useState<LoginInput>({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [loginErrors, setLoginErrors] = useState<LoginFieldErrors>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState("");
  const [showLupaPassword, setShowLupaPassword] = useState(false);

  /* ─── State Mode Daftar ─── */
  const [registerValues, setRegisterValues] = useState<RegisterInput>({
    namaLengkap: "",
    noWhatsapp: "",
    email: "",
    alamat: "",
    password: "",
    konfirmasiPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<RegisterFieldErrors>({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerServerError, setRegisterServerError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  /* ─── Handler Masuk ─── */
  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setLoginValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (loginErrors[name as keyof LoginInput]) {
      setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginServerError("");

    const result = loginSchema.safeParse(loginValues);
    if (!result.success) {
      const fieldErrors: LoginFieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setLoginErrors(fieldErrors);
      return;
    }

    setLoginLoading(true);
    try {
      // Mock login delay
      await new Promise((r) => setTimeout(r, 600));

      setSessionCookie(
        displayNameFromIdentifier(result.data.identifier),
        !!result.data.rememberMe
      );

      if (kategori === "admin") {
        router.push("/admin");
      } else if (kategori === "petugas") {
        router.push("/petugas");
      } else {
        router.push("/pelanggan");
      }
    } catch {
      setLoginServerError("Email/WhatsApp atau password salah.");
    } finally {
      setLoginLoading(false);
    }
  }

  /* ─── Handler Daftar ─── */
  function handleRegisterChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name as keyof RegisterInput]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegisterServerError("");

    const result = registerSchema.safeParse(registerValues);
    if (!result.success) {
      const fieldErrors: RegisterFieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setRegisterErrors(fieldErrors);
      return;
    }

    setRegisterLoading(true);
    try {
      // Mock register delay
      await new Promise((r) => setTimeout(r, 800));
      // Simpan data pendaftaran ke localStorage untuk simulasi dinamis
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "laundyku_user_profile",
          JSON.stringify({
            nama: registerValues.namaLengkap,
            email: registerValues.email,
            telepon: registerValues.noWhatsapp,
            alamat: registerValues.alamat,
          })
        );
      }
      setRegisterSuccess(true);
    } catch {
      setRegisterServerError("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
    } finally {
      setRegisterLoading(false);
    }
  }

  /* ════════════════════════════════════════════════════════════
     TAMPILAN MODE DAFTAR (Langsung di kotak masuk, tanpa popup)
  ════════════════════════════════════════════════════════════ */
  if (mode === "daftar") {
    return (
      <div>
        {/* Tombol Kembali ke Masuk */}
        <button
          type="button"
          onClick={() => {
            setMode("masuk");
            setRegisterSuccess(false);
            setRegisterServerError("");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            padding: 0,
            marginBottom: 16,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#1457D6",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← Kembali ke Masuk
        </button>

        <h2
          style={{
            fontSize: 28,
            color: "#1457D6",
            marginBottom: 6,
            fontFamily: "'Archivo Black', Impact, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          Daftar Akun
        </h2>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 13,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            color: "#4A5A80",
          }}
        >
          Lengkapi data diri dan tambah alamat untuk mulai menggunakan Laundyku.
        </p>

        {registerSuccess ? (
          <div
            style={{
              padding: "20px",
              borderRadius: 14,
              background: "#E8F5E9",
              border: "2px solid #2E7D32",
              textAlign: "center",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              color: "#1B5E20",
              margin: "20px 0",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <h3
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              Pendaftaran Berhasil!
            </h3>
            <p style={{ fontSize: 13, margin: "0 0 16px" }}>
              Akun dan alamat kamu telah tersimpan. Silakan masuk dengan akun barumu.
            </p>
            <Button
              type="button"
              fullWidth
              onClick={() => {
                setLoginValues((prev) => ({
                  ...prev,
                  identifier: registerValues.email || registerValues.noWhatsapp,
                }));
                setMode("masuk");
                setRegisterSuccess(false);
              }}
            >
              Masuk Sekarang
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} noValidate>
            <Field
              label="Nama Lengkap"
              id="reg-nama"
              error={registerErrors.namaLengkap}
              required
            >
              <input
                type="text"
                name="namaLengkap"
                value={registerValues.namaLengkap}
                onChange={handleRegisterChange}
                placeholder="Contoh: Budi Santoso"
                autoComplete="name"
              />
            </Field>

            <Field
              label="No. WhatsApp"
              id="reg-wa"
              error={registerErrors.noWhatsapp}
              required
            >
              <input
                type="tel"
                name="noWhatsapp"
                value={registerValues.noWhatsapp}
                onChange={handleRegisterChange}
                placeholder="081234567890"
                autoComplete="tel"
              />
            </Field>

            <Field
              label="Email"
              id="reg-email"
              error={registerErrors.email}
              required
            >
              <input
                type="email"
                name="email"
                value={registerValues.email}
                onChange={handleRegisterChange}
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </Field>

            {/* Tambah Alamat */}
            <Field
              label="Tambah Alamat (Antar / Jemput)"
              id="reg-alamat"
              error={registerErrors.alamat}
              hint="Alamat lengkap beserta patokan rumah"
              required
            >
              <textarea
                name="alamat"
                rows={3}
                value={registerValues.alamat}
                onChange={handleRegisterChange}
                placeholder="Jl. Mawar No. 12, RT 01/RW 02, Sukolilo, Surabaya"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </Field>

            <Field
              label="Password"
              id="reg-password"
              error={registerErrors.password}
              hint="Minimal 8 karakter"
              required
            >
              <input
                type="password"
                name="password"
                value={registerValues.password}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Field>

            <Field
              label="Konfirmasi Password"
              id="reg-konfirmasi"
              error={registerErrors.konfirmasiPassword}
              required
            >
              <input
                type="password"
                name="konfirmasiPassword"
                value={registerValues.konfirmasiPassword}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Field>

            {registerServerError && (
              <p
                role="alert"
                style={{
                  margin: "12px 0 16px",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(212,42,37,0.1)",
                  border: "1px solid #D42A25",
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 12,
                  color: "#D42A25",
                  fontWeight: 700,
                }}
              >
                {registerServerError}
              </p>
            )}

            <div style={{ marginTop: 20 }}>
              <Button type="submit" fullWidth loading={registerLoading}>
                Daftar Akun Pelanggan
              </Button>
            </div>

            <p
              style={{
                textAlign: "center",
                margin: "18px 0 0",
                fontSize: 13,
                fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              }}
            >
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => setMode("masuk")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#1457D6",
                  fontWeight: 700,
                  textDecoration: "underline",
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 13,
                }}
              >
                Masuk
              </button>
            </p>
          </form>
        )}
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     TAMPILAN MODE MASUK
  ════════════════════════════════════════════════════════════ */
  return (
    <>
      <h2
        style={{
          fontSize: 32,
          color: "#1457D6",
          marginBottom: 8,
          fontFamily: "'Archivo Black', Impact, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        Masuk
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 13,
          fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
        }}
      >
        Isi akunmu untuk masuk.
      </p>

      <form onSubmit={handleLoginSubmit} noValidate>
        {/* Pilihan Kategori Pengguna */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#0B2A6B",
              marginBottom: 8,
            }}
          >
            Kategori Akun
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {(["pelanggan", "petugas", "admin"] as KategoriRole[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKategori(k)}
                style={{
                  padding: "8px 10px",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  background: kategori === k ? "#1457D6" : "#fff",
                  color: kategori === k ? "#fff" : "#0B2A6B",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <Field
          label={
            kategori === "pelanggan"
              ? "Email / No. WhatsApp"
              : `Email ${kategori.toUpperCase()}`
          }
          id="identifier"
          error={loginErrors.identifier}
          required
        >
          <input
            type="text"
            name="identifier"
            value={loginValues.identifier}
            onChange={handleLoginChange}
            placeholder={
              kategori === "admin"
                ? "admin@laundyku.com"
                : kategori === "petugas"
                ? "petugas@laundyku.com"
                : "nama@email.com"
            }
            autoComplete="username"
          />
        </Field>

        <Field label="Password" id="password" error={loginErrors.password} required>
          <input
            type="password"
            name="password"
            value={loginValues.password}
            onChange={handleLoginChange}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "16px 0 24px",
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            fontSize: 13,
          }}
        >
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={loginValues.rememberMe}
              onChange={handleLoginChange}
              style={{ width: 18, height: 18, accentColor: "#1457D6", cursor: "pointer" }}
            />
            Ingat saya
          </label>
          <button
            type="button"
            onClick={() => setShowLupaPassword(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textDecoration: "underline",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 13,
              color: "#0B2A6B",
            }}
          >
            Lupa password?
          </button>
        </div>

        {loginServerError && (
          <p
            role="alert"
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(212,42,37,0.1)",
              border: "1px solid #D42A25",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 12,
              color: "#D42A25",
              fontWeight: 700,
            }}
          >
            {loginServerError}
          </p>
        )}

        <Button type="submit" fullWidth loading={loginLoading}>
          Masuk sebagai {kategori}
        </Button>
      </form>

      {/* Link Beralih ke Mode Daftar (Tanpa Pop-up) */}
      {kategori === "pelanggan" && (
        <p
          style={{
            textAlign: "center",
            margin: "20px 0 0",
            fontSize: 13,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          }}
        >
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => {
              setMode("daftar");
              setRegisterSuccess(false);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#1457D6",
              fontWeight: 700,
              textDecoration: "underline",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
              fontSize: 13,
            }}
          >
            Daftar
          </button>
        </p>
      )}

      {/* Modal Lupa Password (tetap modal) */}
      {showLupaPassword && <LupaPasswordModal onClose={() => setShowLupaPassword(false)} />}
    </>
  );
}
