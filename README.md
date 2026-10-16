# MyPDFGweh (Lembar PDF)

> **Solusi Pengolah Dokumen PDF Pribadi Modern, Cepat & 100% Berjalan di Browser Anda.**  
> Alternatif iLovePDF berfokus pada privasi penuh, bebas iklan, tanpa login, dan hosting gratis.

---

## 🌟 Mengapa MyPDFGweh?

Layanan pengolah PDF online populer umumnya mewajibkan dokumen Anda diunggah ke server cloud pihak ketiga untuk diproses di backend mereka. Hal ini berisiko bagi kerahasiaan dokumen pribadi, kontrak, slip gaji, maupun data sensitif.

**MyPDFGweh** hadir dengan paradigma **Privacy by Default**:
- 🔒 **Zero Server Upload:** File PDF tidak pernah dikirim ke internet atau disimpan di server mana pun. Seluruh kalkulasi manipulasi biner dikerjakan langsung oleh CPU perangkat Anda menggunakan WebAssembly dan JavaScript di dalam browser.
- ⚡ **Tanpa Batasan Kuota / Akun:** Tanpa registrasi, tanpa login, tanpa batasan jumlah file buatan, dan tanpa paywall tersembunyi.
- 🚀 **Performa Tinggi:** Menggunakan Next.js 16 App Router, React 19, TypeScript, dan Tailwind CSS v4 untuk antarmuka pengguna yang sangat responsif dan modern.
- 💸 **Hosting 100% Gratis:** Dirancang untuk dapat di-deploy ke Vercel tanpa database, tanpa backend server terpisah, dan tanpa biaya server computing.

---

## 🛠️ Daftar Fitur Utama (MVP)

| Tool | Rute | Deskripsi Fungsionalitas |
|---|---|---|
| **Gabungkan PDF** | `/merge` | Satukan $\ge 2$ file PDF menjadi satu dokumen utuh. Mendukung penambahan file bertahap, penataan urutan dokumen (move up/down), dan penamaan file hasil. |
| **Pisahkan PDF** | `/split` | Pisahkan PDF berdasarkan rentang halaman kustom (misal `1-3, 5, 8-10`) atau ekstrak setiap lembar menjadi dokumen terpisah dengan opsi unduh satuan dan ZIP. |
| **Atur Halaman PDF** | `/organize` | Menampilkan thumbnail visual setiap halaman menggunakan PDF.js. Pengguna dapat mengubah urutan lembaran, memutar per halaman (90°/180°/270°), atau menghapus halaman tertentu. |
| **Putar PDF** | `/rotate` | Putar orientasi seluruh atau halaman tertentu sebesar 90°, 180°, atau 270° searah jarum jam secara permanen. |
| **Gambar ke PDF** | `/jpg-to-pdf` | Konversi kumpulan foto JPG, PNG, atau WEBP menjadi satu dokumen PDF dengan pilihan ukuran kertas (A4, Letter, Fit), orientasi (Portrait/Landscape), dan margin. |
| **PDF ke Gambar** | `/pdf-to-jpg` | Render lembaran dokumen PDF menjadi gambar JPG atau PNG resolusi tinggi (100%, 150%, 200% scale) langsung di canvas browser. Tersedia unduhan per gambar atau bundle ZIP. |
| **Tambah Watermark** | `/watermark` | Sisipkan teks tanda air (Rahasia, Draft, dll.) dengan kendali ukuran font, transparansi (opasitas), sudut kemiringan, warna, dan 7 pilihan posisi kuadran. |
| **Nomor Halaman** | `/page-numbers` | Tambahkan nomor halaman otomatis pada header atau footer dokumen dengan format fleksibel ("Halaman n dari Total" atau angka sederhana). |
| **Kompres PDF** | `/compress` | Optimasi struktur objek PDF dan stream data secara transparan (*lossless*). Melaporkan metrik byte sebelum, sesudah, dan persentase penghematan secara jujur. |

---

## 🏗️ Arsitektur & Teknologi

- **Frontend Framework:** Next.js 16 (App Router) + React 19
- **Bahasa Pemrograman:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS v4 & PostCSS
- **Ikonografi:** Lucide React
- **PDF Engine Manipulator:** `pdf-lib` (Client-side ArrayBuffer/Uint8Array manipulation)
- **PDF Page Renderer:** `pdfjs-dist` (dengan lokal worker `/pdf.worker.min.mjs` untuk privasi dan kemampuan offline)
- **ZIP Bundler:** `jszip`
- **Unit Testing Framework:** Vitest
- **Target Hosting:** Vercel (Static / Serverless Edge)

### Struktur Direktori

```text
├── app/                  # Next.js App Router (Halaman dan Layout)
│   ├── layout.tsx        # Root layout dengan Navbar, Footer, & Metadata
│   ├── page.tsx          # Beranda dengan Search Bar & Filter Kategori
│   ├── merge/            # Halaman Tool Gabungkan PDF
│   ├── split/            # Halaman Tool Pisahkan PDF
│   ├── organize/         # Halaman Tool Atur & Urutkan Halaman
│   ├── rotate/           # Halaman Tool Putar Orientasi PDF
│   ├── jpg-to-pdf/       # Halaman Tool Gambar ke PDF
│   ├── pdf-to-jpg/       # Halaman Tool PDF ke Gambar
│   ├── watermark/        # Halaman Tool Tambah Tanda Air
│   ├── page-numbers/     # Halaman Tool Tambah Nomor Halaman
│   ├── compress/         # Halaman Tool Kompres PDF
│   ├── about/            # Halaman Tentang Aplikasi
│   └── privacy/          # Halaman Kebijakan Privasi & Batasan Teknis
├── components/           # Komponen UI Reusable
│   ├── Navbar.tsx        # Header responsif & mobile drawer
│   ├── Footer.tsx        # Footer dengan direktori alat & privasi
│   ├── ToolCard.tsx      # Kartu interaktif alat
│   ├── FileDropzone.tsx  # Area drag-and-drop & file picker
│   ├── FileQueueList.tsx # Daftar antrean file dengan tombol reorder
│   ├── ProcessingState.tsx# Status loading & progress bar
│   ├── DownloadCard.tsx  # Kartu sukses, confetti, & tombol unduh
│   └── ErrorAlert.tsx    # Penanganan error yang ramah pengguna
├── lib/
│   ├── pdf/              # Core PDF Engine (Merge, Split, Organize, dll.)
│   └── utils.ts          # Helper bytes formatting, download blob, validasi
├── tests/                # Unit tests dengan Vitest
│   ├── fixtures.ts       # Synthetic PDF fixtures generator
│   ├── merge.test.ts
│   ├── split.test.ts
│   ├── organize.test.ts
│   ├── watermark.test.ts
│   └── compress.test.ts
├── docs/                 # Dokumentasi Audit & Spesifikasi
│   ├── ILOVEPDF_LIVE_AUDIT.md
│   ├── FEATURE_MATRIX.md
│   └── IMPLEMENTATION_AUDIT.md
├── public/               # File statis dan pdf.worker.min.mjs
└── package.json
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js versi 18.18.0 atau yang lebih baru (disarankan Node.js v20/v22)
- npm atau yarn / pnpm

### 1. Kloning dan Masuk ke Direktori
```bash
git clone https://github.com/username/mypdfgweh.git
cd mypdfgweh
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan di Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser Anda dan akses: [http://localhost:3000](http://localhost:3000).

### 4. Menjalankan Unit Test
```bash
npm run test
```
Semua 16 unit test akan dijalankan secara otomatis melalui Vitest.

### 5. Membangun untuk Produksi (Production Build)
```bash
npm run build
```
Menghasilkan bundle statis yang teroptimasi tanpa error.

---

## 🌐 Panduan Deployment ke Vercel

MyPDFGweh dirancang untuk dapat di-hosting secara gratis di Vercel dengan **Zero Configuration**:

### Opsi A: Deploy via Vercel Dashboard (Rekomendasi)
1. Push repository proyek Anda ke GitHub / GitLab.
2. Buka dashboard [Vercel](https://vercel.com) dan klik **Add New Project**.
3. Impor repositori GitHub Anda.
4. Vercel akan secara otomatis mendeteksi konfigurasi Next.js.
5. Klik **Deploy** tanpa perlu mengisi Environment Variable apa pun.
6. Aplikasi langsung aktif dan dapat diakses publik melalui domain `.vercel.app`.

### Opsi B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```
Ikuti petunjuk di terminal, pilih default options, dan deployment akan selesai dalam beberapa detik.

---

## ⚖️ Batasan Teknis & Panduan Memori

1. **Memori RAM Perangkat:** Karena seluruh operasi berjalan di memori browser pengguna, dokumen PDF yang sangat besar ($\ge 100$ MB atau ribuan halaman) memerlukan memori RAM yang cukup pada perangkat pengguna. Aplikasi telah dilengkapi dengan mekanisme pembersihan `URL.revokeObjectURL` dan penghapusan canvas context untuk mencegah kebocoran memori.
2. **Kejujuran Kompresi:** MyPDFGweh mengoptimalkan dokumen secara *lossless* melalui restrukturisasi object streams. Apabila dokumen PDF Anda sudah terkompresi secara optimal sebelumnya, ukuran hasil tidak dipaksakan mengecil dengan merusak keterbacaan teks (kami tidak merasterisasi teks diam-diam).
3. **File Terenkripsi Sandi:** Dokumen PDF yang terkunci dengan password hak cipta tingkat tinggi harus dibuka sandinya sebelum dapat dimanipulasi halamannya.

---

## 📄 Lisensi

Dilisensikan di bawah lisensi MIT. Bebas digunakan untuk keperluan personal maupun edukasi.
