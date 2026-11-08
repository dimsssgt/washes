// Semua teks & harga landing page ada di sini.
// Ubah isi di file ini saja, komponen tidak perlu diedit.

export const SITE = {
  name: "Laundyku",
  whatsapp: "+62 856 4791 6005", // TODO: ganti nomor WhatsApp asli
  address: "Jl. pamularsih Raya,", // TODO: ganti alamat asli
  orderHref: "#login", // TODO: arahkan ke halaman pemesanan
  statusHref: "#status",
};

export const NAV_LINKS = [
  { label: "Layanan", href: "#layanan" },
  { label: "Harga", href: "#harga" },
  { label: "Panduan", href: "#panduan" },
  { label: "Cek Status", href: "#status" },
  { label: "Jam Buka", href: "#jam" },
];

export const SERVICES = [
  {
    title: "Cuci Kiloan",
    desc: "Cuci, kering, dan dilipat rapi. Cocok untuk pakaian harian.",
  },
  {
    title: "Cuci Satuan",
    desc: "Dicuci per item untuk pakaian khusus, sepatu, tas, dan lainnya.",
  },
  {
    title: "Cuci Linen",
    desc: "Sprei, bed cover, selimut, gorden, dan linen lainnya.",
  },
  {
    title: "Self Service",
    desc: "Cuci sendiri di outlet dengan mesin bersih dan siap pakai.",
  },
  {
    title: "Antar Jemput",
    desc: "Kurir menjemput cucianmu dan mengantarnya kembali. Rp 5.000 per perjalanan.",
  },
  {
    title: "Status Realtime",
    desc: "Pantau cucianmu langsung: diterima, dicuci, disetrika, siap diambil, hingga selesai.",
  },
];

export type PriceTable = {
  id: string;
  label: string;
  headers: string[];
  rows: { name: string; prices: string[] }[];
  note?: string;
};

export const PRICE_TABLES: PriceTable[] = [
  {
    id: "kiloan",
    label: "Kiloan",
    headers: [
      "Kiloan (min. 3 kg)",
      "Reguler\n3 hari",
      "One Day\n24 jam",
      "Express\n6 jam",
      "Quick\n3 jam",
    ],
    rows: [
      { name: "Cuci kering lipat", prices: ["Rp 5.000/kg", "Rp 7.000/kg", "Rp 10.000/kg", "Rp 14.000/kg"] },
      { name: "Cuci kering gosok", prices: ["Rp 8.000/kg", "Rp 10.000/kg", "Rp 13.000/kg", "Rp 17.000/kg"] },
      { name: "Setrika kiloan", prices: ["Rp 5.000/kg", "Rp 7.000/kg", "Rp 10.000/kg", "Rp 14.000/kg"] },
    ],
  },
  {
    id: "satuan",
    label: "Satuan",
    headers: ["Satuan", "Reguler\n3 hari", "Express\n24 jam"],
    rows: [
      { name: "Kemeja / blus", prices: ["Rp 12.000", "Rp 18.000"] },
      { name: "Celana / rok", prices: ["Rp 12.000", "Rp 18.000"] },
      { name: "Jas / blazer", prices: ["Rp 30.000", "Rp 40.000"] },
      { name: "Jaket", prices: ["Rp 25.000", "Rp 35.000"] },
      { name: "Gaun", prices: ["Rp 35.000", "Rp 45.000"] },
    ],
  },
  {
    id: "linen",
    label: "Linen",
    headers: ["Linen", "Reguler\n3 hari", "Express\n24 jam"],
    rows: [
      { name: "Sprei", prices: ["Rp 20.000", "Rp 28.000"] },
      { name: "Bed cover", prices: ["Rp 30.000", "Rp 40.000"] },
      { name: "Selimut", prices: ["Rp 25.000", "Rp 35.000"] },
      { name: "Gorden (per meter)", prices: ["Rp 10.000", "Rp 15.000"] },
      { name: "Bantal / guling", prices: ["Rp 15.000", "Rp 22.000"] },
    ],
  },
  {
    id: "self",
    label: "Self Service",
    headers: ["Self service", "Durasi", "Harga"],
    rows: [
      { name: "Mesin cuci 8 kg", prices: ["30 menit", "Rp 15.000"] },
      { name: "Mesin cuci 12 kg", prices: ["30 menit", "Rp 20.000"] },
      { name: "Pengering A", prices: ["10 menit", "Rp 6.000"] },
      { name: "Pengering B", prices: ["20 menit", "Rp 10.000"] },
    ],
  },
];

export const STEPS = [
  { title: "Isi reservasi", desc: "Isi form pemesanan atau chat WhatsApp." },
  { title: "Dijemput kurir", desc: "Kurir menjemput ke alamatmu." },
  { title: "Diproses", desc: "Satu mesin untuk satu customer." },
  { title: "Diantar", desc: "Bersih, wangi, dan rapi di depan pintu." },
];

export type StatusStep = {
  label: string;
  state: "done" | "active" | "todo";
  note?: string;
};

// Contoh tampilan timeline status. Sambungkan ke data pesanan asli nanti.
export const SAMPLE_STATUS: StatusStep[] = [
  { label: "Menunggu jemput", state: "done" },
  { label: "Pesanan diterima", state: "done" },
  { label: "Cucian ditimbang", state: "done" },
  { label: "Sedang dicuci", state: "active", note: "estimasi selesai 30 Okt" },
  { label: "Sedang disetrika", state: "todo" },
  { label: "Siap diantar/diambil", state: "todo" },
  { label: "Selesai", state: "todo" },
];

export const SAMPLE_CODE = "LDY-20261028-014";

export const HOURS = [
  { day: "Senin – Jumat", time: "07.00 – 21.00" },
  { day: "Sabtu", time: "08.00 – 20.00" },
  { day: "Minggu", time: "09.00 – 17.00" },
];

export const TESTIMONIALS = [
  {
    quote: "Cepat, wangi, rapi, dan ada layanan antar jemput. Tidak khawatir kehabisan baju.",
    name: "Rian Pratama",
    tone: "white" as const,
  },
  {
    quote: "Satu mesin satu customer, jadi baju tidak tercampur. Hasilnya bersih dan wangi.",
    name: "Sarah Amanda",
    tone: "white" as const,
  },
  {
    quote: "Pilih Express, sore dipesan, besok sudah diantar. Sangat terbantu.",
    name: "Dimas Setiawan",
    tone: "white" as const,
  },
  {
    quote: "Pelayanan ramah banget, kurir antar jemputnya tepat waktu. Langganan tiap minggu!",
    name: "Nadhira Putri",
    tone: "white" as const,
  },
  {
    quote: "Baju kerja disetrika rapi banget dan licin, packing plastiknya juga rapi dan higienis.",
    name: "Budi Santoso",
    tone: "white" as const,
  },
  {
    quote: "Layanan self-service-nya nyaman, mesinnya modern dan bersih. Tempatnya juga ber-AC.",
    name: "Jessica Tan",
    tone: "white" as const,
  },
];

export const FAQ = [
  {
    q: "Berapa minimal cuci?",
    a: "Minimal 3 kg untuk layanan kiloan. Untuk satuan, tidak ada minimal.",
  },
  {
    q: "Pesan Express sore hari, selesai kapan?",
    a: "Express selesai dalam 6 jam sejak cucian diterima, selama masih dalam jam operasional.",
  },
  {
    q: "Siapa yang menjemput cucian?",
    a: "Kurir kami datang ke alamatmu, maksimal 30 menit setelah pesanan masuk.",
  },
  {
    q: "Apakah pembayaran harus cashless?",
    a: "Bayar lewat QRIS atau transfer. Estimasi waktu dimulai setelah pembayaran lunas.",
  },
];
