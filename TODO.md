# TODO - Roadmap & Status Pengembangan MyPDFGweh

## Status MVP (Tahap 1) - SELESAI (100% DONE)

- [x] **Audit Referensi & Riset:** Audit live iLovePDF (`docs/ILOVEPDF_LIVE_AUDIT.md`), penyelarasan PRD dan instruksi.
- [x] **Matriks Fitur & Audit Implementasi:** `docs/FEATURE_MATRIX.md` & `docs/IMPLEMENTATION_AUDIT.md`.
- [x] **Setup Lingkungan Proyek:**
  - [x] Inisialisasi Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide React.
  - [x] Konfigurasi dependency: `pdf-lib`, `pdfjs-dist` (dengan lokal worker `/pdf.worker.min.mjs`), `jszip`, `vitest`.
- [x] **Implementasi PDF Engine Modular (`lib/pdf/`):**
  - [x] `merge.ts`: Menggabungkan multiple PDF files dengan validasi header dan urutan terjaga.
  - [x] `split.ts`: Memisahkan PDF berdasarkan rentang halaman valid & opsi ekstrak semua halaman.
  - [x] `organize.ts`: Menata urutan, merotasi, dan menghapus halaman terpilih.
  - [x] `rotate.ts`: Memutar seluruh atau halaman terpilih dalam kelipatan 90°, 180°, 270°.
  - [x] `images-to-pdf.ts`: Mengonversi JPG/PNG ke PDF dengan ukuran A4/Letter/Fit dan margin.
  - [x] `pdf-to-images.ts`: Merender halaman PDF ke JPG/PNG dengan skala resolusi dan ZIP packaging.
  - [x] `watermark.ts`: Menambahkan watermark teks dengan kustomisasi posisi, opasitas, ukuran, sudut.
  - [x] `page-numbers.ts`: Menambahkan nomor halaman di posisi dinamis sesuai ukuran halaman riil.
  - [x] `compress.ts`: Mengoptimalkan struktur PDF dan stream, menghitung statistik byte secara transparan.
  - [x] `preview.ts`: Merender thumbnail visual halaman menggunakan PDF.js di canvas.
  - [x] `zip.ts`: Mengemas file biner ke arsip ZIP secara client-side menggunakan JSZip.
- [x] **Komponen UI & Sistem Desain:**
  - [x] Desain sistem palet: Warm white/light gray background, koral/merah hangat, charcoal typography.
  - [x] Header responsif (`Navbar.tsx`) dengan mega menu, navigasi Tentang, dan Privasi.
  - [x] Hero section dengan pencarian tool instan dan filter kategori dinamis.
  - [x] Tool grid responsif dengan ikon Lucide dan efek visual modern.
  - [x] Reusable `FileDropzone.tsx` dengan drag-and-drop, validasi file, dan feedback visual.
  - [x] Reusable `FileQueueList.tsx` dengan kendali urutan (move up/down) dan hapus file.
  - [x] Reusable `ProcessingState.tsx` dengan loader dan progress bar.
  - [x] Reusable `DownloadCard.tsx` dengan confetti, tombol unduh satuan, unduh ZIP, dan reset.
  - [x] Reusable `ErrorAlert.tsx` untuk error handling yang ramah pengguna.
- [x] **Halaman Tool Individual:**
  - [x] `/merge` - Gabungkan PDF
  - [x] `/split` - Pisahkan PDF
  - [x] `/organize` - Atur PDF (Visual page grid, drag/reorder, rotate, delete)
  - [x] `/rotate` - Putar PDF
  - [x] `/jpg-to-pdf` - Gambar ke PDF
  - [x] `/pdf-to-jpg` - PDF ke Gambar
  - [x] `/watermark` - Tambah Watermark
  - [x] `/page-numbers` - Tambah Nomor Halaman
  - [x] `/compress` - Kompres PDF (Metrik transparan sebelum & sesudah)
  - [x] `/about` - Halaman Tentang Filosofi & Arsitektur
  - [x] `/privacy` - Halaman Komitmen Privasi & Batasan Teknis
- [x] **Pengujian & Verifikasi Kualitas:**
  - [x] Unit tests komprehensif Vitest: 5 test files, 16 passed tests (100% lulus).
  - [x] Type checking (`npx tsc --noEmit`): 0 error.
  - [x] Production Build (`npm run build`): 14/14 static pages generated successfully tanpa warning.
- [x] **Dokumentasi Final:**
  - [x] `README.md` komprehensif (fitur, instalasi, pengujian, arsitektur, panduan deploy Vercel).

---

## Roadmap Pasca-MVP (Tahap 2 & 3)

- [ ] PWA & Offline Service Worker caching untuk pemrosesan offline tanpa internet.
- [ ] Crop PDF interaktif dengan selector visual canvas.
- [ ] Enkripsi kata sandi PDF (Protect PDF) dengan kompatibilitas standard reader.
- [ ] Advanced WebAssembly optimizer (misal QPDF / Ghostscript WASM) untuk rasio kompresi lebih tinggi.
