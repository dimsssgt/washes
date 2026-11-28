import { createClient } from "@/lib/supabase/server";

export async function getSessionName(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profil } = await supabase
    .from("profiles")
    .select("nama")
    .eq("id", user.id)
    .single();

  return profil?.nama || user.email?.split("@")[0] || "Akun";
}