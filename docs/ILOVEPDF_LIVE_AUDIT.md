# Audit Langsung iLovePDF (Live Reference Audit)

**Tanggal Akses:** 17 Oktober 2026  
**Metode Akses:** Direct HTTP Content Inspection via Agent Web Client (Live DOM / Metadata Analysis)  
**Status Audit:** Observed Live & Verified  

---

## 1. Halaman yang Berhasil Diperiksa Secara Live

| Halaman | URL | Status Verifikasi | Catatan |
|---|---|---|---|
| Homepage (ID) | `https://www.ilovepdf.com/id` | **Observed Live** | Title: "iLovePDF \| Peralatan PDF online untuk pencinta PDF", Meta description, layout grid, kategori filter, dan menu navigasi berhasil diinspeksi. |
| Merge PDF | `https://www.ilovepdf.com/merge_pdf` | **Observed Live** | Struktur work area, uploader pickfiles, sidebar pengaturan urutan, fileLimits (100MB, 25 files), dan workflow state berhasil diverifikasi. |
| Split PDF | `https://www.ilovepdf.com/split_pdf` | **Observed Live** | Work area dengan opsi split range dan extract pages, validasi mode dan upload limit berhasil diverifikasi. |
| Compress PDF | `https://www.ilovepdf.com/compress_pdf` | **Observed Live** | Preset compression level (Extreme, Recommended, Less), uploader work area, dan warning info limit berhasil diverifikasi. |

---

## 2. Kategori dan Tool yang Terlihat pada Homepage (Observed Live)

Kategori filter pada homepage iLovePDF:
1. **Semua (All)**
2. **Alur kerja (Workflows)**
3. **Atur PDF (Organize PDF)**:
   - Gabungkan PDF (Merge PDF)
   - Pisahkan PDF (Split PDF)
   - Hapus halaman (Remove pages)
   - Ekstrak halaman (Extract pages)
   - Atur PDF (Organize PDF)
   - Pindai ke PDF (Scan to PDF)
4. **Optimalkan PDF (Optimize PDF)**:
   - Kompres PDF (Compress PDF)
   - Perbaiki PDF (Repair PDF)
   - OCR PDF
5. **Konversi ke PDF (Convert to PDF)**:
   - JPG ke PDF, WORD ke PDF, POWERPOINT ke PDF, EXCEL ke PDF, HTML ke PDF
6. **Konversi dari PDF (Convert from PDF)**:
   - PDF ke JPG, PDF ke WORD, PDF ke POWERPOINT, PDF ke EXCEL, PDF ke PDF/A
7. **Edit PDF (Edit PDF)**:
   - Putar PDF (Rotate PDF)
   - Tambahkan nomor halaman (Add page numbers)
   - Tambahkan tanda air (Add watermark)
   - Potong PDF (Crop PDF)
   - Edit PDF
   - Formulir PDF (PDF Forms)
8. **Keamanan PDF (Security PDF)**:
   - Buka kunci PDF, Proteksi PDF, Tanda tangani PDF, Samarkan PDF, Bandingkan PDF
9. **PDF Intelligence**:
   - Perangkum AI, Terjemahkan PDF, PDF ke Markdown

---

## 3. Pola Layout dan Alur Interaksi

### Homepage
- **Header:** Fixed height (60px), logo brand di kiri, navigasi dropdown "Semua alat PDF", aksi Masuk/Daftar (auth) di kanan.
- **Hero:** Judul h1 tebal berorientasi nilai ("Semua alat yang Anda butuhkan untuk bekerja dengan PDF di satu tempat"), subjudul h2 ramah pengguna.
- **Tool Filter Tabs:** Tab kategori ("Semua", "Atur PDF", "Optimalkan PDF", dll.) yang secara instan menyaring kartu tool.
- **Tool Card Grid:** Kartu responsif dengan background putih, hover lift halus, ikon tool dengan warna tema kategori, judul h3, dan deskripsi singkat 1-2 kalimat.
- **Footer:** Navigasi internal multi-kolom yang mengelompokkan produk dan ketentuan hukum.

### Halaman Tool (Pola Terpadu)
1. **Step 1 - File Selection (Empty Work Area):**
   - Header tool: H1 judul operasi + H2 instruksi ringkas.
   - Area Drop/Upload besar di tengah dengan tombol merah primer "Select PDF files".
   - Opsi tambahan: Cloud storage icons (Google Drive / Dropbox) dan drag-and-drop zone.
2. **Step 2 - Workspace & Configuration (File Loaded):**
   - Area utama beralih menampilkan daftar file atau kartu thumbnail halaman PDF.
   - Sidetools / Toolbar: Tombol urutkan berdasarkan nama (A-Z), rotasi thumbnail, hapus file.
   - Sidebar kanan: Pengaturan spesifik (misal rentang halaman pada Split, mode preset pada Compress, watermarking options, format output).
   - Tombol Aksi Utama: Tombol CTA merah mencolok di pojok kanan bawah ("Merge PDF", "Split PDF", "Compress PDF") dengan status disabled jika input belum lengkap.
3. **Step 3 - Processing State:**
   - Indikator progres bar dan status animasi teks pemrosesan.
4. **Step 4 - Download / Completion State:**
   - Tombol unduh file utama ("Download merged PDF"), informasi ukuran file, dan opsi unduh ZIP jika banyak file.

---

## 4. Pelajaran UX untuk MyPDFGweh

### Hal yang Sangat Baik untuk Diadaptasi:
1. **Pola 4-Langkah yang Jelas:** Pilih File $\rightarrow$ Konfigurasi & Pratinjau $\rightarrow$ Proses dengan Progres $\rightarrow$ Unduh Hasil.
2. **Visual Hierarchy yang Bersih:** Tool card dengan ikon berbobot visual seimbang dan label deskriptif yang tidak bertele-tele.
3. **Pemberian Umpan Balik Instan:** Menampilkan jumlah file yang dipilih, ukuran file, urutan file, dan pratinjau thumbnail halaman.
4. **Interaksi Drag & Drop yang Mudah:** Pengguna dapat menata urutan dokumen secara bebas sebelum operasi penggabungan/pengorganisasian.

### Hal yang TIDAK Relevan / Harus Dihindari pada MyPDFGweh:
1. **Paywall, Limit Kuota Akun, & Iklan:** iLovePDF membatasi ukuran file bebas untuk memaksa registrasi/premium (misal: "This task is limited for non-registered users", iklan Google AdSense leaderboard). MyPDFGweh 100% gratis, tanpa akun, tanpa paywall buatan, tanpa iklan.
2. **Pengunggahan File ke Server/Cloud:** iLovePDF mengunggah dokumen pengguna ke server mereka untuk diproses di backend. MyPDFGweh memproses dokumen **100% di browser pengguna secara lokal (Client-Side)** menggunakan `pdf-lib` dan `pdfjs-dist`, menjamin privasi maksimal.
3. **Integrasi Akun Cloud Pihak Ketiga (Drive/Dropbox):** Tidak diperlukan pada MVP karena fokus pada pemrosesan lokal file perangkat.
4. **Alat AI/Cloud Berat:** Tidak menambahkan simulasi palsu untuk fitur server-side yang belum ada.

---

## 5. Ringkasan Status Observasi

- **Observed Live:** Seluruh navigasi, uploader DOM, konfigurasi batas file iLovePDF, filter kategori, dan layout struktur kerja.
- **Inferred:** Waktu pemrosesan server iLovePDF bergantung pada antrean cloud dan ukuran file pengguna.
- **Not Verified:** Fitur berbayar / business premium portal iLovePDF (karena tidak relevan dan di luar cakupan).
