-- =====================================================================
-- DRAF 3 dari 3: policy dan penjaga untuk tabel YANG SUDAH ADA
-- STATUS: BELUM DIJALANKAN DAN BELUM DIUJI. Jalankan SETELAH file 01 dan 02.
-- Tabel di sini dipakai juga oleh Pelanggan dan Admin, jadi tinjau bersama
-- Orang 1 dan Orang 3 sebelum dijalankan.
--
-- Latar belakang (dari policy yang sekarang ada):
--   * Semua petugas, apa pun bagiannya, boleh mengubah status pesanan apa saja,
--     serta menulis penimbangan dan transaksi. Artinya Pencuci bisa langsung
--     menandai pesanan "selesai". Revisi dosen butuh aturan per bagian.
--   * Policy "profil: ubah sendiri" tidak membatasi kolom, jadi pengguna biasa bisa
--     mengubah perannya sendiri menjadi admin (ditutup di bagian 0).
--   * Petugas tidak bisa membaca profil pelanggan (nama dan no. WA).
--   * Tabel riwayat_status memakai RLS tetapi tidak punya policy sama sekali,
--     jadi semua akses lewat API ditolak.
-- Draf ini hanya MENAMBAH policy dan trigger. Policy lama tidak diubah.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. CELAH KRITIS: pengguna bisa mengubah PERAN dirinya sendiri
--
--    Policy "profil: ubah sendiri" (UPDATE, using id = auth.uid(), tanpa batasan
--    kolom) membuat siapa pun yang login bisa menjalankan:
--        update profiles set peran = 'admin' where id = auth.uid();
--    Trigger ini menutupnya: selain admin, kolom peran, aktif, dan bagian
--    (dan id) tidak boleh berubah. Mengubah nama dan no_wa tetap bisa.
--    Baris yang diubah tanpa pengguna login (SQL Editor, Dashboard, service role)
--    dilewati, jadi pengelolaan manual tidak terhalang.
-- ---------------------------------------------------------------------
create or replace function public.jaga_kolom_profil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if public.peran_saya() = 'admin'::public.peran_pengguna then
    return new;
  end if;
  if (new.id, new.peran, new.aktif, new.bagian)
     is distinct from
     (old.id, old.peran, old.aktif, old.bagian) then
    raise exception 'Peran, status aktif, dan bagian hanya boleh diubah admin.';
  end if;
  return new;
end;
$$;

create trigger profiles_jaga_kolom
  before update on public.profiles
  for each row execute function public.jaga_kolom_profil();

-- ---------------------------------------------------------------------
-- A. Petugas boleh melihat profil pelanggan (nama, no. WA)
--    Catatan: RLS tidak bisa membatasi kolom, jadi email pelanggan ikut terlihat.
-- ---------------------------------------------------------------------
create policy "profil: petugas lihat pelanggan"
  on public.profiles for select
  using (
    public.peran_saya() = 'petugas'::public.peran_pengguna
    and peran = 'pelanggan'::public.peran_pengguna
  );

-- ---------------------------------------------------------------------
-- B. riwayat_status: belum ada policy sama sekali.
--    LEWATI bagian ini kalau Orang 1 mengisi tabel ini lewat trigger security definer.
-- ---------------------------------------------------------------------
create policy "riwayat_status: lihat"
  on public.riwayat_status for select
  using (
    exists (
      select 1 from public.pesanan p
       where p.id = riwayat_status.pesanan_id
         and (
           p.pelanggan_id = auth.uid()
           or public.peran_saya() = any (array['petugas', 'admin']::public.peran_pengguna[])
         )
    )
  );

create policy "riwayat_status: petugas dan admin mencatat"
  on public.riwayat_status for insert
  with check (
    public.peran_saya() = any (array['petugas', 'admin']::public.peran_pengguna[])
    and oleh = auth.uid()
  );

-- ---------------------------------------------------------------------
-- C. Penimbangan dan transaksi hanya boleh diubah Front Office
--    (petugas lain tetap bisa membaca lewat policy yang sudah ada)
-- ---------------------------------------------------------------------
create or replace function public.hanya_front_office()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.peran_saya() = 'petugas'::public.peran_pengguna
     and public.bagian_saya() is distinct from 'front_office' then
    raise exception 'Hanya Front Office yang boleh mengubah data ini.';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger penimbangan_hanya_front_office
  before insert or update or delete on public.penimbangan
  for each row execute function public.hanya_front_office();

create trigger transaksi_hanya_front_office
  before insert or update or delete on public.transaksi
  for each row execute function public.hanya_front_office();

-- ---------------------------------------------------------------------
-- D. Penjaga perubahan status pesanan oleh petugas
--    Berlaku HANYA untuk peran petugas. Admin dan peran lain tidak terpengaruh.
--
--    Aturan:
--      1. Status hanya boleh maju satu langkah oleh bagian yang tepat:
--           masuk/diterima -> ditimbang  : Front Office
--           ditimbang -> dicuci          : Pencuci
--           dicuci -> disetrika          : Penyetrika
--           disetrika -> siap_diambil    : Front Office
--           siap_diambil -> selesai      : Front Office
--      2. Sebelum status berubah, petugas itu harus sudah mencatat serah-terima
--         (hitung jumlah) untuk status baru di tabel serah_terima.
--      3. Selisih yang belum diverifikasi menahan pesanan.
--      4. Masuk ke "ditimbang" butuh data penimbangan; "selesai" butuh nama penerima.
-- ---------------------------------------------------------------------
create or replace function public.jaga_status_pesanan()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  bagian_ini text;
  langkah_sah boolean;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;
  if public.peran_saya() is distinct from 'petugas'::public.peran_pengguna then
    return new;
  end if;

  bagian_ini := public.bagian_saya();

  langkah_sah :=
       (old.status = 'masuk'          and new.status = 'diterima'     and bagian_ini = 'front_office')
    or (old.status = 'masuk'          and new.status = 'ditimbang'    and bagian_ini = 'front_office')
    or (old.status = 'diterima'       and new.status = 'ditimbang'    and bagian_ini = 'front_office')
    or (old.status = 'ditimbang'      and new.status = 'dicuci'       and bagian_ini = 'pencuci')
    or (old.status = 'dicuci'         and new.status = 'disetrika'    and bagian_ini = 'penyetrika')
    or (old.status = 'disetrika'      and new.status = 'siap_diambil' and bagian_ini = 'front_office')
    or (old.status = 'siap_diambil'   and new.status = 'selesai'      and bagian_ini = 'front_office');

  if not langkah_sah then
    raise exception 'Perubahan status % -> % tidak diizinkan untuk bagian %.',
      old.status, new.status, coalesce(bagian_ini, '(tanpa bagian)');
  end if;

  -- Status "diterima" hanya penanda awal; serah-terima baru dicatat mulai "ditimbang".
  if new.status <> 'diterima' and not exists (
    select 1 from public.serah_terima s
     where s.pesanan_id = new.id
       and s.ke_status = new.status
       and s.bagian = bagian_ini
       and s.petugas_id = auth.uid()
  ) then
    raise exception 'Hitung jumlah pakaian lebih dulu (serah-terima belum dicatat).';
  end if;

  if exists (
    select 1 from public.serah_terima s
     where s.pesanan_id = new.id
       and not s.sesuai
       and s.verifikasi_at is null
       and s.ke_status <> new.status
  ) then
    raise exception 'Ada selisih jumlah yang belum diverifikasi Front Office.';
  end if;

  if new.status = 'ditimbang'
     and not exists (select 1 from public.penimbangan t where t.pesanan_id = new.id) then
    raise exception 'Data penimbangan belum ada.';
  end if;

  if new.status = 'selesai' then
    if new.penerima is null or length(btrim(new.penerima)) = 0 then
      raise exception 'Nama penerima wajib diisi.';
    end if;
    new.selesai_at := coalesce(new.selesai_at, now());
    new.diserahkan_oleh := coalesce(new.diserahkan_oleh, auth.uid());
  end if;

  return new;
end;
$$;

create trigger pesanan_jaga_status
  before update on public.pesanan
  for each row execute function public.jaga_status_pesanan();

-- ---------------------------------------------------------------------
-- E. Pesanan baru dari pelanggan harus berstatus "masuk"
--    Policy "pesanan: buat" hanya memeriksa pelanggan_id = auth.uid(). Tanpa
--    penjaga ini, pelanggan bisa membuat pesanan langsung berstatus "selesai",
--    atau menunjuk petugas dan penerima sendiri.
-- ---------------------------------------------------------------------
create or replace function public.jaga_pesanan_baru()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.peran_saya() = 'pelanggan'::public.peran_pengguna then
    new.status := 'masuk';
    new.petugas_id := null;
    new.selesai_at := null;
    new.penerima := null;
    new.diserahkan_oleh := null;
  end if;
  return new;
end;
$$;

create trigger pesanan_jaga_baru
  before insert on public.pesanan
  for each row execute function public.jaga_pesanan_baru();

-- ---------------------------------------------------------------------
-- F. Jumlah item wajib diisi pada penimbangan baru
--    Kolom jumlah_item sekarang boleh kosong, padahal jumlah ini menjadi acuan
--    pengecekan anti-kehilangan. NOT VALID = baris lama tidak diperiksa
--    (saat ini tabelnya masih kosong).
-- ---------------------------------------------------------------------
alter table public.penimbangan
  add constraint penimbangan_jumlah_item_wajib
  check (jumlah_item is not null) not valid;

-- ---------------------------------------------------------------------
-- BELUM TERMASUK:
--   * Notifikasi otomatis ke petugas saat ada pesanan baru, dan ke pelanggan saat
--     status berubah (policy notifikasi sekarang hanya mengizinkan "milik sendiri",
--     jadi ini butuh trigger security definer).
--   * Policy "pesanan: petugas ubah" saat ini tidak membatasi kolom, jadi petugas
--     masih bisa mengubah kolom lain seperti pelanggan_id. Perlu dibahas.
--   * Layanan self_service: ikut rantai pencuci -> penyetrika atau tidak.
--   * Pelanggan tanpa akun (input manual petugas): lihat USULAN kedua di bawah.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- USULAN UNTUK ORANG 1 (TIDAK DIJALANKAN OTOMATIS, butuh persetujuannya)
--   peran_saya() sekarang tidak memeriksa kolom "aktif", jadi pengguna yang
--   dinonaktifkan lewat halaman Admin tetap lolos semua policy. Perbaikannya satu
--   baris (hapus tanda komentar kalau Orang 1 setuju):
--
-- create or replace function public.peran_saya()
-- returns public.peran_pengguna
-- language sql stable security definer
-- set search_path to ''
-- as $$
--   select peran from public.profiles where id = auth.uid() and aktif;
-- $$;
--
--   Catatan: ini mengubah perilaku semua policy yang memakai peran_saya(), dan akun
--   nonaktif tetap bisa login di Supabase Auth. Untuk memblokir login sepenuhnya,
--   akunnya juga perlu di-ban lewat Auth.
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- USULAN KEDUA (butuh keputusan tim): pesanan untuk pelanggan tanpa akun
--   Fitur "Input manual" petugas mencatat pelanggan yang datang langsung. Tetapi
--   pesanan.pelanggan_id wajib diisi dan mengacu ke profiles, yang mengacu ke
--   akun login, jadi pelanggan tanpa akun tidak bisa dicatat. Salah satu jalan:
--
-- alter table public.pesanan alter column pelanggan_id drop not null;
-- alter table public.pesanan
--   add column nama_manual text,
--   add column no_wa_manual text;
-- alter table public.pesanan
--   add constraint pesanan_pelanggan_atau_manual
--   check (pelanggan_id is not null or nama_manual is not null);
--
--   Efeknya: halaman yang menampilkan nama pelanggan (Admin Transaksi, Rekap)
--   harus memakai LEFT JOIN dan menampilkan nama_manual bila pelanggan_id kosong.
--   Alternatif tanpa mengubah tabel: buat akun pelanggan sungguhan lewat server
--   (kunci service_role) untuk setiap pelanggan manual.
-- ---------------------------------------------------------------------
