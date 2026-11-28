import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfilPetugas from "@/components/petugas/ProfilPetugas";

export const metadata: Metadata = { title: "Profile Petugas — Laundyku" };

export default async function HalamanProfilPetugas() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profil } = await supabase
    .from("profiles")
    .select("nama, no_wa, bagian")
    .eq("id", user.id)
    .single();
  if (!profil) redirect("/login");

  return <ProfilPetugas profil={profil} email={user.email ?? "-"} />;
}