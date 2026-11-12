"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DetailPesananPage from "../aktif/[kode]/page";

function DetailContent() {
  const searchParams = useSearchParams();
  const kode = searchParams.get("kode") || "LDY-20261028-014";

  return <DetailPesananPage params={Promise.resolve({ kode })} />;
}

export default function DetailWrapperPage() {
  return (
    <Suspense fallback={<div style={{ fontFamily: "var(--font-poppins), 'Poppins', Arial, sans-serif" }}>Memuat detail pesanan...</div>}>
      <DetailContent />
    </Suspense>
  );
}
