"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSessionCookie, displayNameFromIdentifier } from "./session";
import { loginSchema, type LoginInput } from "./schema";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import DaftarModal from "./DaftarModal";
import LupaPasswordModal from "./LupaPasswordModal";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;
type KategoriRole = "pelanggan" | "petugas" | "admin";

export default function LoginForm() {
  const router = useRouter();  
  const [kategori, setKategori] = useState<KategoriRole>("pelanggan");
  const [values, setValues] = useState<LoginInput>({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [showDaftar, setShowDaftar] = useState(false);
  const [showLupaPassword, setShowLupaPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // TODO: Hubungkan ke POST /api/auth/login saat backend sudah siap
      await new Promise((r) => setTimeout(r, 800));

      // Simpan sesi (mock)
      setSessionCookie(
        displayNameFromIdentifier(result.data.identifier),
        !!result.data.rememberMe
      );

      // Arahkan sesuai kategori akun yang dipilih
      if (kategori === "admin") {
        router.push("/admin");
      } else if (kategori === "petugas") {
        router.push("/petugas");
      } else {
        router.push("/pelanggan");
      }
    } catch {
      setServerError("Email/WhatsApp atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
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
          error={errors.identifier}
          required
        >
          <input
            type="text"
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
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

        <Field label="Password" id="password" error={errors.password} required>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
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
              checked={values.rememberMe}
              onChange={handleChange}
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

        {serverError && (
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
            {serverError}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Masuk sebagai {kategori}
        </Button>
      </form>

      {/* Link Daftar */}
      {kategori === "pelanggan" && (
        <p style={{ textAlign: "center", margin: "20px 0 0", fontSize: 13, fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif" }}>
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => setShowDaftar(true)}
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

      {/* Modal Daftar */}
      {showDaftar && <DaftarModal onClose={() => setShowDaftar(false)} />}

      {/* Modal Lupa Password */}
      {showLupaPassword && <LupaPasswordModal onClose={() => setShowLupaPassword(false)} />}
    </>
  );
}
