-- =====================================================================
-- DRAF 2 dari 3: tabel dan kolom untuk bagian Petugas (alur anti-kehilangan baju)
-- STATUS: BELUM DIJALANKAN DAN BELUM DIUJI. Jalankan SETELAH file 01 selesai
-- dan setelah ditinjau bersama tim (terutama Orang 1).
--
-- Semua perubahan bersifat MENAMBAH. Tidak ada kolom, tabel, atau enum yang sudah
-- ada diubah atau dihapus.
--
-- PENTING: fungsi peran_saya() SUDAH ADA (dibuat Orang 1 dan dipakai banyak policy).
-- Draf ini sengaja TIDAK mendefinisikannya ulang, supaya perilakunya tidak berubah.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Bagian petugas (Front Office, Pencuci, Penyetrika)
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists bagian text
  check (bagian in ('front_office', 'pencuci', 'penyetrika'));

-- Petugas wajib punya bagian. NOT VALID = baris lama tidak diperiksa;
-- jalankan "alter table public.profiles validate constraint profiles_bagian_petugas"
-- setelah semua petugas lama diisi bagiannya.
alter table public.profiles
  add constraint profiles_bagian_petugas
  check (peran <> 'petugas'::public.peran_pengguna or bagian is not null) not valid;

-- Gaya penulisan sama dengan peran_saya() buatan Orang 1 (security definer, search_path kosong).
create or replace function public.bagian_saya()
returns text
language sql stable security definer
set search_path = ''
as $$
  select bagian from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 2. Kolom tambahan di pesanan
-- ---------------------------------------------------------------------
-- Belum ada tempat untuk cara serah (diantar / ambil sendiri) dan data penyerahan.
alter table public.pesanan
  add column if not exists metode_serah text
    check (metode_serah in ('diantar', 'ambil_sendiri')),
  add column if not exists penerima text,
  add column if not exists diserahkan_oleh uuid references public.profiles (id);

-- ---------------------------------------------------------------------
-- 3. Jejak serah-terima dan verifikasi selisih
-- ---------------------------------------------------------------------
create table if not exists public.serah_terima (
  id                 uuid primary key default gen_random_uuid(),
  pesanan_id         uuid not null references public.pesanan (id) on delete cascade,
  jenis              text not null check (jenis in ('penerimaan', 'serah_terima', 'penyerahan')),
  bagian             text not null check (bagian in ('front_office', 'pencuci', 'penyetrika')),
  petugas_id         uuid not null references public.profiles (id),
  waktu              timestamptz not null default now(),
  ke_status          public.status_pesanan not null,
  jumlah_tercatat    integer not null check (jumlah_tercatat >= 0),
  jumlah_dihitung    integer not null check (jumlah_dihitung >= 0),
  sesuai             boolean generated always as (jumlah_dihitung = jumlah_tercatat) stored,
  catatan            text not null default '',
  -- diisi Front Office saat memverifikasi selisih
  verifikasi_oleh    uuid references public.profiles (id),
  verifikasi_at      timestamptz,
  verifikasi_catatan text,
  jumlah_acuan_baru  integer check (jumlah_acuan_baru >= 0),

  -- Selisih wajib disertai catatan.
  constraint serah_terima_selisih_wajib_catatan
    check (sesuai or length(btrim(catatan)) > 0),
  -- Kolom verifikasi terisi semuanya atau kosong semuanya.
  constraint serah_terima_verifikasi_lengkap
    check (
      (verifikasi_oleh is null and verifikasi_at is null
        and verifikasi_catatan is null and jumlah_acuan_baru is null)
      or
      (verifikasi_oleh is not null and verifikasi_at is not null
        and length(btrim(coalesce(verifikasi_catatan, ''))) > 0
        and jumlah_acuan_baru is not null)
    )
);

create index if not exists serah_terima_pesanan_idx
  on public.serah_terima (pesanan_id, waktu);

-- Mempercepat daftar "Perlu verifikasi".
create index if not exists serah_terima_selisih_terbuka_idx
  on public.serah_terima (pesanan_id)
  where not sesuai and verifikasi_at is null;

-- Jumlah acuan TIDAK disimpan sebagai kolom (supaya tidak bisa diubah sembarangan).
-- Nilainya dihitung: hasil verifikasi terakhir, atau jumlah_item saat penimbangan.
create or replace function public.jumlah_acuan(p_pesanan uuid)
returns integer
language sql stable
set search_path = ''
as $$
  select coalesce(
    (select s.jumlah_acuan_baru
       from public.serah_terima s
      where s.pesanan_id = p_pesanan and s.verifikasi_at is not null
      order by s.verifikasi_at desc
      limit 1),
    (select t.jumlah_item from public.penimbangan t where t.pesanan_id = p_pesanan)
  )
$$;

-- ---------------------------------------------------------------------
-- 4. Row Level Security khusus tabel serah_terima
--    (memakai peran_saya() yang sudah ada)
-- ---------------------------------------------------------------------
alter table public.serah_terima enable row level security;

-- Petugas dan admin boleh melihat jejak. Pelanggan tidak.
create policy "serah_terima: petugas dan admin boleh melihat"
  on public.serah_terima for select
  using (public.peran_saya() = any (array['petugas', 'admin']::public.peran_pengguna[]));

-- Petugas hanya boleh mencatat jejak atas namanya sendiri dan untuk bagiannya sendiri.
create policy "serah_terima: petugas mencatat jejak bagiannya"
  on public.serah_terima for insert
  with check (
    public.peran_saya() = 'petugas'::public.peran_pengguna
    and petugas_id = auth.uid()
    and bagian = public.bagian_saya()
    and verifikasi_at is null
  );

-- Hanya Front Office yang boleh memverifikasi, dan hanya selisih yang belum diverifikasi.
create policy "serah_terima: front office memverifikasi selisih"
  on public.serah_terima for update
  using (
    public.peran_saya() = 'petugas'::public.peran_pengguna
    and public.bagian_saya() = 'front_office'
    and not sesuai
    and verifikasi_at is null
  )
  with check (verifikasi_oleh = auth.uid());

-- RLS tidak bisa membatasi KOLOM. Trigger ini memastikan update hanya menyentuh kolom verifikasi.
create or replace function public.jaga_kolom_verifikasi()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.id, new.pesanan_id, new.jenis, new.bagian, new.petugas_id, new.waktu,
      new.ke_status, new.jumlah_tercatat, new.jumlah_dihitung, new.catatan)
     is distinct from
     (old.id, old.pesanan_id, old.jenis, old.bagian, old.petugas_id, old.waktu,
      old.ke_status, old.jumlah_tercatat, old.jumlah_dihitung, old.catatan)
  then
    raise exception 'Hanya kolom verifikasi yang boleh diubah.';
  end if;
  return new;
end;
$$;

create trigger serah_terima_jaga_kolom
  before update on public.serah_terima
  for each row execute function public.jaga_kolom_verifikasi();
