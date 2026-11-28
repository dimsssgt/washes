"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import HeaderHalaman from "./HeaderHalaman";
import { simpanProfilPetugas } from "@/lib/petugas/profil-actions";
import { createClient } from "@/lib/supabase/client";
import { LABEL_BAGIAN, type Bagian } from "@/lib/petugas/alur";

interface Props {
  profil: { nama: string; no_wa: string | null; bagian: string | null };
  email: string;
}

export default function ProfilPetugas({ profil, email }: Props) {
  const router = useRouter();
  const [state, aksi, sedangSimpan] = useActionState(simpanProfilPetugas, null);

  // Setelah nama berhasil disimpan, baca ulang layout agar sidebar ikut berubah.
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const [pwBaru, setPwBaru] = useState("");
  const [pwUlang, setPwUlang] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwPesan, setPwPesan] = useState<{ ok: boolean; teks: string } | null>(null);

  async function gantiPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pwBaru.length < 8) {
      setPwPesan({ ok: false, teks: "Password minimal 8 karakter." });
      return;
    }
    if (pwBaru !== pwUlang) {
      setPwPesan({ ok: false, teks: "Konfirmasi password tidak sama." });
      return;
    }
    setPwBusy(true);
    const { error } = await createClient().auth.updateUser({ password: pwBaru });
    setPwBusy(false);
    if (error) {
      setPwPesan({ ok: false, teks: "Gagal mengganti password: " + error.message });
    } else {
      setPwBaru("");
      setPwUlang("");
      setPwPesan({ ok: true, teks: "Password berhasil diganti." });
    }
  }

  const bagian = profil.bagian ? LABEL_BAGIAN[profil.bagian as Bagian] : "-";

  return (
    <>
      <HeaderHalaman judul="Profil" hrefKembali="/petugas" />

      <div className="pt-g2">
        <section className="pt-kartu">
          <h2 className="pt-d">Data diri</h2>

          <form action={aksi} noValidate>
            <label htmlFor="pf-nama">Nama</label>
            <input id="pf-nama" name="nama" type="text" defaultValue={profil.nama} required />

            <label htmlFor="pf-wa">No. WhatsApp</label>
            <input
              id="pf-wa"
              name="noWa"
              type="text"
              inputMode="tel"
              defaultValue={profil.no_wa ?? ""}
              placeholder="08xx-xxxx-xxxx (boleh kosong)"
            />

            <label>Email login</label>
            <input type="text" value={email} readOnly />

            <label>Bagian</label>
            <input type="text" value={bagian} readOnly />

            <div aria-live="polite">
              {state && !state.ok && <p role="alert" className="pt-galat">{state.pesan}</p>}
              {state?.ok && <p className="pt-sukses">Profil berhasil disimpan.</p>}
            </div>

            <div className="pt-aksi">
              <button type="submit" className="btn" disabled={sedangSimpan}>
                {sedangSimpan ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </section>

        <section className="pt-kartu">
          <h2 className="pt-d">Ganti password</h2>
          <p className="pt-hint">Minimal 8 karakter. Anda tetap login setelah mengganti password.</p>

          <form onSubmit={gantiPassword} noValidate>
            <label htmlFor="pw-baru">Password baru</label>
            <input
              id="pw-baru"
              type="password"
              autoComplete="new-password"
              value={pwBaru}
              onChange={(e) => setPwBaru(e.target.value)}
            />

            <label htmlFor="pw-ulang">Ulangi password baru</label>
            <input
              id="pw-ulang"
              type="password"
              autoComplete="new-password"
              value={pwUlang}
              onChange={(e) => setPwUlang(e.target.value)}
            />

            <div aria-live="polite">
              {pwPesan && (
                <p role={pwPesan.ok ? "status" : "alert"} className={pwPesan.ok ? "pt-sukses" : "pt-galat"}>
                  {pwPesan.teks}
                </p>
              )}
            </div>

            <div className="pt-aksi">
              <button type="submit" className="btn" disabled={pwBusy}>
                {pwBusy ? "Menyimpan..." : "Ganti password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}