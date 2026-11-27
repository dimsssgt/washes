import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/feat/auth/LoginForm";
import "./login.css";

export const metadata: Metadata = { title: "Masuk — Laundyku" };

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-container">

        {/* Kolom kiri — hero */}
        <div className="login-hero">
          <Link href="/" className="login-brand">
            Laundyku
          </Link>

          <div className="login-hero-content">
            <h1 className="login-hero-title">
              Selamat datang kembali
            </h1>
            <p className="login-hero-desc">
              Masuk untuk memesan, memantau cucian, atau mengelola layanan laundry.
            </p>
          </div>

          {/* Gambar hero */}
          <div className="login-hero-img">
            <Image
              src="/hero/herolaundry.webp"
              alt="Ilustrasi Laundry"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        {/* Kolom kanan — form */}
        <div className="login-form-col">
          {/* Tombol Kembali ke Beranda */}
          <div className="login-back-wrapper">
            <Link href="/" className="login-back-btn">
              ← Kembali ke Beranda
            </Link>
          </div>

          <div className="login-card">
            <LoginForm />
          </div>
        </div>

      </div>
    </main>
  );
}
