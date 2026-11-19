-- =====================================================================
-- DRAF 1 dari 2: tambah tiga nilai ke enum status_pesanan
-- STATUS: BELUM DIJALANKAN DAN BELUM DIUJI. Tinjau bersama tim sebelum dipakai.
--
-- Kenapa: enum status_pesanan sekarang berisi
--   masuk, diterima, ditimbang, menunggu_bayar, selesai, dibatalkan
-- padahal desain dan ketentuan proyek punya tahap pencucian, penyetrikaan, dan
-- siap diambil. Tahap itu belum bisa disimpan.
--
-- Hanya MENAMBAH nilai baru, tidak ada yang diubah atau dihapus. Tetap saja:
--   * halaman Pelanggan dan Admin yang menampilkan atau menyaring status harus
--     bisa menangani tiga nilai baru ini (beri tahu Orang 1 dan Orang 3);
--   * jalankan file ini SENDIRIAN dan selesaikan dulu, baru jalankan file ke-2
--     (nilai enum baru tidak bisa dipakai di transaksi yang sama).
-- =====================================================================

alter type public.status_pesanan add value if not exists 'dicuci'       after 'ditimbang';
alter type public.status_pesanan add value if not exists 'disetrika'    after 'dicuci';
alter type public.status_pesanan add value if not exists 'siap_diambil' after 'disetrika';

-- Urutan akhir yang diusulkan:
--   masuk -> diterima -> ditimbang -> dicuci -> disetrika -> siap_diambil -> selesai
--   dengan dibatalkan sebagai jalur samping.
-- PERTANYAAN untuk Orang 1: "menunggu_bayar" dipakai di tahap mana? Draf ini tidak
-- memakainya. Pembayaran dicatat saat penyerahan (tabel transaksi).
