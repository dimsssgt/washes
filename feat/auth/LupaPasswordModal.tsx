"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { lupaPasswordSchema, type LupaPasswordInput } from "./schema";

type FieldErrors = Partial<Record<keyof LupaPasswordInput, string>>;

interface LupaPasswordModalProps {
  onClose: () => void;
}

export default function LupaPasswordModal({ onClose }: LupaPasswordModalProps) {
  const [values, setValues] = useState<LupaPasswordInput>({ identifier: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ identifier: e.target.value });
    if (errors.identifier) setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const result = lupaPasswordSchema.safeParse(values);
    if (!result.success) {
      setErrors({ identifier: result.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      // TODO: Hubungkan ke API route /api/auth/lupa-password saat backend siap
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
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
        {sent ? (
          <div className="text-center py-4">
            <p
              style={{
                fontFamily: "'Archivo Black', Impact, sans-serif",
                textTransform: "uppercase",
                fontSize: 20,
                color: "#1457D6",
                marginBottom: 12,
              }}
            >
              Tautan terkirim!
            </p>
            <p style={{ fontSize: 13, marginBottom: 24 }}>
              Cek email atau WhatsApp kamu untuk tautan reset password.
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
                Lupa password
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

            <p style={{ margin: "0 0 4px", fontSize: 13 }}>
              Masukkan email atau No. WhatsApp. Kami kirim tautan untuk mengatur ulang password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Email / No. WhatsApp" id="lupa-identifier" error={errors.identifier} required>
                <input
                  type="text"
                  name="identifier"
                  value={values.identifier}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="username"
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
                  Kirim tautan
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
