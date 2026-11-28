"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "./schema";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import LupaPasswordModal from "./LupaPasswordModal";
import { createClient } from "@/lib/supabase/client";

type LoginFieldErrors = Partial<Record<keyof LoginInput, string>>;
type RegisterFieldErrors = Partial<Record<keyof RegisterInput, string>>;
type KategoriRole = "pelanggan" | "petugas" | "admin";
type AuthMode = "masuk" | "daftar";

// Akun demo resmi yang valid dan terverifikasi di Supabase
const DEMO_ACCOUNTS: Record<KategoriRole, { email: string; pass: string; label: string }> = {
  pelanggan: {
    email: "pelanggan@laundyku.id",
    pass: "password123",
    label: "Pelanggan",
  },
  petugas: {
    email: "frontoffice@laundyku.id",
    pass: "password123",
    label: "Petugas (Front Office)",
  },
  admin: {
    email: "admin1@laundyku.id",
    pass: "password123",
    label: "Admin Utama",
  },
};

function EyeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("masuk");

  /* ─── State Mode Masuk (Auto-fill default Pelanggan) ─── */
  const [kategori, setKategori] = useState<KategoriRole>("pelanggan");
  const [loginValues, setLoginValues] = useState<LoginInput>({
    identifier: DEMO_ACCOUNTS.pelanggan.email,
    password: DEMO_ACCOUNTS.pelanggan.pass,
    rememberMe: false,
  });
  const [loginErrors, setLoginErrors] = useState<LoginFieldErrors>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState("");
  const [showLupaPassword, setShowLupaPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  /* ─── Auto-fill saat pilih Kategori Akun ─── */
  function handleKategoriChange(k: KategoriRole) {
    setKategori(k);
    setLoginValues((prev) => ({
      ...prev,
      identifier: DEMO_ACCOUNTS[k].email,
      password: DEMO_ACCOUNTS[k].pass,
    }));
    setLoginErrors({});
    setLoginServerError("");
  }

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
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.identifier,
        password: result.data.password,
      });
      if (error) {
        setLoginServerError("Email atau password salah.");
        return;
      }

      // Peran dibaca dari database, bukan dari pilihan di form
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profil } = await supabase
        .from("profiles")
        .select("peran")
        .eq("id", user!.id)
        .single();

      if (profil?.peran !== kategori) {
        await supabase.auth.signOut();
        setLoginServerError(`Akun ini bukan akun ${kategori}.`);
        return;
      }

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
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: registerValues.email,
        password: registerValues.password,
        options: {
          data: {
            nama: registerValues.namaLengkap,
            no_wa: registerValues.noWhatsapp,
          },
        },
      });
      if (error) {
        setRegisterServerError(error.message);
        return;
      }
      setRegisterSuccess(true);
    } catch {
      setRegisterServerError("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
    } finally {
      setRegisterLoading(false);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     TAMPILAN MODE DAFTAR (Langsung di kotak masuk, tanpa popup)
  ══════════════════════════════════════════════════════════════ */
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
                margin: "0 0 6px",
              }}
            >
              Pendaftaran Berhasil!
            </h3>
            <p style={{ fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
              Akunmu telah berhasil dibuat. Silakan beralih ke form masuk untuk menggunakan akun barumu.
            </p>
            <Button
              type="button"
              fullWidth
              onClick={() => {
                setMode("masuk");
                setRegisterSuccess(false);
                setKategori("pelanggan");
                setLoginValues((prev) => ({
                  ...prev,
                  identifier: registerValues.email,
                  password: "",
                }));
              }}
            >
              Masuk Sekarang
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} noValidate>
            <Field
              label="Nama Lengkap"
              id="namaLengkap"
              error={registerErrors.namaLengkap}
              required
            >
              <input
                type="text"
                name="namaLengkap"
                value={registerValues.namaLengkap}
                onChange={handleRegisterChange}
                placeholder="Contoh: Rista Az-zahra"
                autoComplete="name"
              />
            </Field>

            <Field
              label="No. WhatsApp"
              id="noWhatsapp"
              error={registerErrors.noWhatsapp}
              hint="Format: 08123456789 atau +628123456789"
              required
            >
              <input
                type="tel"
                name="noWhatsapp"
                value={registerValues.noWhatsapp}
                onChange={handleRegisterChange}
                placeholder="08123456789"
                autoComplete="tel"
              />
            </Field>

            <Field
              label="Alamat Email"
              id="email"
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

            <Field
              label="Alamat Rumah / Jemput"
              id="alamat"
              error={registerErrors.alamat}
              hint="Masukkan alamat utama untuk penjemputan cucian"
              required
            >
              <textarea
                name="alamat"
                value={registerValues.alamat}
                onChange={handleRegisterChange}
                placeholder="Jl. Mawar No. 12, RT 01/RW 02, Sukolilo, Surabaya"
                rows={2}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </Field>

            <Field
              label="Password"
              id="reg-password"
              error={registerErrors.password}
              hint="Minimal 8 karakter kombinasi huruf & angka"
              required
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowRegPassword((v) => !v)}
                  aria-label={showRegPassword ? "Sembunyikan password" : "Lihat password"}
                  title={showRegPassword ? "Sembunyikan password" : "Lihat password"}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px",
                    cursor: "pointer",
                    color: "#0B2A6B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showRegPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            >
              <input
                type={showRegPassword ? "text" : "password"}
                name="password"
                value={registerValues.password}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Field>

            <Field
              label="Ulangi Password"
              id="konfirmasiPassword"
              error={registerErrors.konfirmasiPassword}
              required
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowRegConfirm((v) => !v)}
                  aria-label={showRegConfirm ? "Sembunyikan password" : "Lihat password"}
                  title={showRegConfirm ? "Sembunyikan password" : "Lihat password"}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px",
                    cursor: "pointer",
                    color: "#0B2A6B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showRegConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            >
              <input
                type={showRegConfirm ? "text" : "password"}
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
                  margin: "16px 0 0",
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

            <div style={{ marginTop: 24 }}>
              <Button type="submit" fullWidth loading={registerLoading}>
                Daftar Akun Baru
              </Button>
            </div>
          </form>
        )}

        {/* Link kembali ke Masuk */}
        <p
          style={{
            textAlign: "center",
            margin: "20px 0 0",
            fontSize: 13,
            fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
          }}
        >
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => {
              setMode("masuk");
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
            Masuk
          </button>
        </p>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     TAMPILAN MODE MASUK (DENGAN AUTO-FILL & SHOW/HIDE PASSWORD)
  ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <h2
        style={{
          fontSize: 28,
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
          color: "#4A5A80",
        }}
      >
        Pilih kategori akun untuk masuk atau gunakan akun terdaftar.
      </p>

      <form onSubmit={handleLoginSubmit} noValidate>
        {/* Pilihan Kategori Pengguna dengan Auto-fill Otomatis */}
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
                onClick={() => handleKategoriChange(k)}
                style={{
                  padding: "9px 8px",
                  border: "2px solid #0B2A6B",
                  borderRadius: 12,
                  fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  background: kategori === k ? "#1457D6" : "#fff",
                  color: kategori === k ? "#fff" : "#0B2A6B",
                  boxShadow: kategori === k ? "2px 2px 0 #0B2A6B" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Kotak Pemberitahuan Auto-fill */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FFF4DE",
              border: "1.5px dashed #0B2A6B",
              borderRadius: 10,
              padding: "7px 12px",
              marginTop: 10,
              fontSize: 12,
              color: "#0B2A6B",
              fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>✨</span>
              <span>
                Auto-fill aktif: <strong>{DEMO_ACCOUNTS[kategori].label}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginValues((prev) => ({ ...prev, identifier: "", password: "" }));
                setLoginErrors({});
                setLoginServerError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#1457D6",
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
                textDecoration: "underline",
                padding: "2px 4px",
              }}
            >
              Kosongkan
            </button>
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
                ? "admin1@laundyku.id"
                : kategori === "petugas"
                ? "frontoffice@laundyku.id"
                : "pelanggan@laundyku.id"
            }
            autoComplete="username"
          />
        </Field>

        <Field
          label="Password"
          id="password"
          error={loginErrors.password}
          required
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              title={showPassword ? "Sembunyikan password" : "Lihat password"}
              style={{
                background: "none",
                border: "none",
                padding: "4px",
                cursor: "pointer",
                color: "#0B2A6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                transition: "opacity 0.15s",
              }}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
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
