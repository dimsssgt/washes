"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { registerSchema, type RegisterInput } from "./schema";

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

interface DaftarModalProps {
  onClose: () => void;
}

export default function DaftarModal({ onClose }: DaftarModalProps) {
  const [values, setValues] = useState<RegisterInput>({
    namaLengkap: "",
    noWhatsapp: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // TODO: Hubungkan ke API route /api/auth/register saat backend sudah siap
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(51,71,126,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Card */}
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
        {success ? (
          <div className="text-center py-4">
            <p
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 22,
                color: "#1457D6",
                marginBottom: 12,
              }}
            >
              Pendaftaran berhasil!
            </p>
            <p style={{ fontSize: 13, marginBottom: 24 }}>
              Akun kamu sudah dibuat. Silakan masuk.
            </p>
            <Button onClick={onClose} fullWidth>
              Tutup
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Archivo Black', Impact, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  margin: 0,
                  fontSize: 22,
                  color: "#1457D6",
                }}
              >
                Daftar akun pelanggan
              </h2>
              <button
                onClick={onClose}
                aria-label="Tutup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFD21F",
                  color: "#0B2A6B",
                  fontFamily: "'Archivo Black', sans-serif",
                  textTransform: "uppercase",
                  fontSize: 13,
                  borderRadius: 999,
                  minHeight: 40,
                  width: 44,
                  minWidth: 44,
                  border: "0",
                  cursor: "pointer",
                  boxShadow: "inset 0 0 0 2px #0B2A6B",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Nama lengkap" id="namaLengkap" error={errors.namaLengkap} required>
                <input
                  type="text"
                  name="namaLengkap"
                  value={values.namaLengkap}
                  onChange={handleChange}
                  placeholder="Nama lengkap"
                  autoComplete="name"
                />
              </Field>

              <Field label="No. WhatsApp" id="noWhatsapp" error={errors.noWhatsapp} required>
                <input
                  type="tel"
                  name="noWhatsapp"
                  value={values.noWhatsapp}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  autoComplete="tel"
                />
              </Field>

              <Field label="Email" id="reg-email" error={errors.email} required>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="Password" id="reg-password" error={errors.password} required hint="Minimal 8 karakter">
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Field>

              <Field label="Ulangi password" id="konfirmasiPassword" error={errors.konfirmasiPassword} required>
                <input
                  type="password"
                  name="konfirmasiPassword"
                  value={values.konfirmasiPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </Field>

              {serverError && (
                <p
                  role="alert"
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "rgba(212,42,37,0.1)",
                    border: "1px solid #D42A25",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: "#D42A25",
                    fontWeight: 700,
                  }}
                >
                  {serverError}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 24,
                }}
              >
                <Button type="button" variant="yellow" size="sm" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" size="sm" loading={loading}>
                  Daftar
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
