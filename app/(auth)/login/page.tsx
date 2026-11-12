import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/feat/auth/LoginForm";

export const metadata: Metadata = { title: "Masuk — Laundyku" };

export default function LoginPage() {
  return (
    <main
      style={{ fontFamily: "'Space Mono', monospace", color: "#0B2A6B", minHeight: "100vh", background: "#EEF2F7" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", minHeight: "100vh" }}>

        {/* Kolom kiri — hero */}
        <div
          style={{
            background: "#1457D6",
            padding: "64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <Link
            href="/"
            className="d"
            style={{ fontSize: 28, color: "#FFD21F", fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, margin: 0, textDecoration: "none" }}
          >
            Laundyku
          </Link>
          <div>
            <h1
              className="d"
              style={{ fontSize: 72, color: "#FFD21F", fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}
            >
              Selamat datang kembali
            </h1>
            <p style={{ color: "#fff", fontSize: 15, maxWidth: 420, margin: "24px 0 0", lineHeight: 1.6 }}>
              Masuk untuk memesan, memantau cucian, atau mengelola layanan laundry.
            </p>
          </div>
          {/* Gambar hero */}
          <div
            style={{
              position: "relative",
              height: 280,
              border: "3px solid #0B2A6B",
              borderRadius: 24,
              overflow: "hidden",
              background: "#0d44b0",
            }}
          >
            <Image
              src="/hero-laundry.webp"
              alt="Ilustrasi Laundry"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        {/* Kolom kanan — form */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            background: "#FFF4DE",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#fff",
              border: "2px solid #0B2A6B",
              borderRadius: 18,
              boxShadow: "5px 5px 0 #0B2A6B",
              padding: 40,
              color: "#0B2A6B",
            }}
          >
            <h2
              className="d"
              style={{ fontSize: 32, color: "#1457D6", marginBottom: 8, fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1 }}
            >
              Masuk
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: 13 }}>Isi akunmu untuk masuk.</p>

            <LoginForm />
          </div>
        </div>

      </div>
    </main>
  );
}
