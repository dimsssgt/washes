"use client";

import { useSearchParams } from "next/navigation";
import DetailPesananPage from "../aktif/[kode]/page";

export default function DetailWrapperPage() {
  const searchParams = useSearchParams();
  const kode = searchParams.get("kode") || "LDY-20261028-014";

  return <DetailPesananPage params={Promise.resolve({ kode })} />;
}
