import { createClient } from "@/lib/supabase/server";

export type Peran = "pelanggan" | "petugas" | "admin";

export type SessionInfo = {
  name: string;
  peran: Peran;
  dashboardHref: string;
};

const DASHBOARD_HREF: Record<Peran, string> = {
  pelanggan: "/pelanggan",
  petugas: "/petugas",
  admin: "/admin",
};

export async function getSessionInfo(): Promise<SessionInfo | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profil } = await supabase
    .from("profiles")
    .select("nama, peran")
    .eq("id", user.id)
    .single();

  if (!profil) return null;

  const peran = profil.peran as Peran;
  return {
    name: profil.nama || user.email?.split("@")[0] || "Akun",
    peran,
    dashboardHref: DASHBOARD_HREF[peran],
  };
}