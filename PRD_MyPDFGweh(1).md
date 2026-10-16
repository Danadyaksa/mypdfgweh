# Product Requirements Document (PRD)

## MyPDFGweh

**Versi:** 1.0  
**Tanggal:** 17 Oktober 2026  
**Status:** Draft implementasi MVP  
**Pemilik produk:** Pengembang proyek  
**Platform:** Web, responsif desktop dan mobile

---

## 1. Ringkasan Produk

**MyPDFGweh** adalah website pengolah PDF untuk kebutuhan pribadi dan kelompok kecil. Produk ini mengambil inspirasi dari pola penggunaan layanan seperti iLovePDF, tetapi memakai nama, identitas visual, implementasi, dan kode sendiri.

Fokus utamanya adalah menyediakan sejumlah alat PDF yang paling sering dipakai, dengan antarmuka modern, proses sederhana, dan tanpa login. Sedapat mungkin, pemrosesan dilakukan langsung di browser agar dokumen tidak perlu diunggah ke server aplikasi.

MyPDFGweh bukan sasaran awal untuk menyamai seluruh kemampuan produk komersial secara sempurna. Sasaran MVP adalah menghadirkan kumpulan fitur inti yang benar-benar berfungsi, dapat diuji, dan dapat di-hosting dengan biaya serendah mungkin.

## 2. Latar Belakang dan Masalah Pengguna

Pengguna membutuhkan alat PDF yang cepat untuk tugas sehari-hari seperti menggabungkan dokumen, memisahkan halaman, mengatur urutan, mengubah gambar menjadi PDF, mengekspor halaman menjadi gambar, serta menambahkan watermark atau nomor halaman. Layanan gratis yang sudah ada dapat memiliki kuota, batas ukuran, atau batas fitur. MyPDFGweh bertujuan memberikan alternatif pribadi yang mudah diakses melalui satu tautan.

## 3. Tujuan Produk

1. Membuat satu situs yang mengumpulkan alat PDF inti dalam antarmuka yang mudah ditemukan.
2. Menyediakan alur unggah, pengaturan, proses, dan unduh yang konsisten.
3. Mengutamakan pemrosesan di browser tanpa database, autentikasi, atau penyimpanan file permanen.
4. Menampilkan status, kesalahan, dan batas teknis secara jujur.
5. Menghasilkan implementasi yang responsif, dapat diakses, dan siap dideploy ke Vercel sesuai batas paket hosting yang digunakan.
6. Memakai audit situs iLovePDF sebagai referensi riset produk dan pola interaksi, bukan menyalin kode, aset, logo, atau desain secara persis.

## 4. Bukan Tujuan MVP

Fitur berikut tidak menjadi prioritas MVP dan tidak boleh ditampilkan sebagai alat yang sudah siap jika belum benar-benar diimplementasikan:

- AI summarizer, penerjemahan AI, dan fitur AI PDF.
- OCR.
- Tanda tangan elektronik.
- Redaksi permanen dokumen.
- Akun, login, pembayaran, paket premium, atau riwayat pengguna.
- Database dan penyimpanan dokumen cloud.
- Konversi PDF ke Word, Excel, atau PowerPoint dan konversi Office ke PDF.
- Perbaikan PDF rusak, konversi PDF/A, serta pembukaan kata sandi/enkripsi yang tidak didukung dengan baik oleh pustaka terpilih.
- Fitur apa pun yang hanya berupa mockup atau tombol tanpa implementasi.

Fitur proteksi kata sandi PDF boleh dievaluasi sebagai kandidat tahap berikutnya. Jangan mengiklankannya di MVP sebelum dukungan enkripsi, kompatibilitas pembaca PDF, dan hasil uji diverifikasi.

## 5. Pengguna Sasaran

- Pemilik proyek dan teman-temannya.
- Pengguna umum yang membutuhkan alat PDF sederhana tanpa membuat akun.
- Pengguna desktop dan mobile yang ingin mengolah dokumen melalui browser.

Tidak ada kebutuhan untuk mengelola banyak akun, menyimpan profil, atau menyimpan dokumen antar-sesi.

## 6. Prinsip Produk

- **Functional first:** operasi PDF harus menghasilkan file yang benar, bukan sekadar UI.
- **Privacy by default:** file diproses lokal jika library memungkinkan dan tidak dikirim ke server tanpa kebutuhan yang jelas.
- **No false claims:** klaim seperti “100% aman”, “tanpa batas”, atau “selalu memperkecil ukuran” tidak boleh digunakan tanpa dasar.
- **Low friction:** pengguna bisa memilih file, menjalankan tool, dan mengunduh hasil tanpa registrasi.
- **Responsive:** fungsi utama nyaman digunakan pada layar kecil maupun besar.
- **Original brand:** nama produk adalah MyPDFGweh, dengan logo dan desain original.
- **Honest limitations:** ukuran file besar dapat dibatasi oleh memori dan kemampuan perangkat meskipun tidak ada kuota akun.

## 7. Ruang Lingkup Fitur MVP

### P0 — Wajib tersedia sebelum rilis MVP

| ID | Fitur | Persyaratan inti | Kriteria penerimaan |
|---|---|---|---|
| F-01 | Merge PDF | Pilih minimal dua PDF, ubah urutan, hapus file dari antrean, lalu gabungkan. | Semua halaman hadir dalam urutan yang benar dan hasil dapat dibuka. Kesalahan file ditampilkan dengan jelas. |
| F-02 | Split PDF | Tentukan rentang halaman, misalnya `1-3, 5, 8-10`, dan validasi nomor halaman. | Output memiliki tepat halaman yang diminta. Rentang invalid tidak menghasilkan output palsu. |
| F-03 | Organize PDF | Tampilkan thumbnail halaman, drag-and-drop untuk menyusun ulang, pilih halaman untuk dihapus, dan reset perubahan. | Urutan dan penghapusan pada output sama dengan preview. Perubahan tidak merusak halaman yang tidak dipilih. |
| F-04 | Rotate PDF | Rotasi semua halaman atau halaman tertentu dalam kelipatan 90 derajat. | Orientasi dan rotasi output sesuai pilihan pengguna. |
| F-05 | JPG/PNG to PDF | Pilih beberapa gambar, atur urutan, ukuran halaman, orientasi, dan margin sederhana. | Hasil berupa PDF valid dengan urutan gambar yang sesuai. |
| F-06 | PDF to JPG/PNG | Render halaman PDF ke gambar, pilih halaman atau seluruh halaman, pilih format. | Output benar-benar berupa gambar hasil render; sediakan unduhan halaman dan ZIP untuk banyak file bila stabil. |
| F-07 | Watermark | Tambahkan watermark teks, atur posisi, ukuran, warna, opasitas, rotasi, dan rentang halaman. | Watermark terlihat pada halaman yang dipilih dan tidak menghapus konten asli. |
| F-08 | Page Numbers | Tambahkan nomor halaman pada rentang tertentu, dengan posisi dan pengaturan visual dasar. | Nomor tampil pada halaman dan posisi yang tepat. Nomor awal dapat diatur bila implementasi mendukung. |
| F-09 | Compress PDF | Implementasikan optimasi yang benar-benar bekerja. Ukur ukuran input dan output. | Tampilkan ukuran awal dan hasil serta persentase perubahan. Jangan klaim berhasil mengecilkan file jika hasil tidak lebih kecil. Jika kompresi andal tidak dapat dibuat di browser, tampilkan keterbatasan dan jangan mengaktifkan tool sebagai fitur penuh. |
| F-10 | Search tools | Cari tool berdasarkan nama dan kategori. | Hasil pencarian cocok dengan input, dan klik tool membuka halaman terkait. |
| F-11 | Responsive navigation | Header, daftar tool, menu mobile, footer, serta navigasi halaman tool. | Tidak ada overflow horizontal pada viewport mobile umum dan semua kontrol inti tetap dapat diakses. |
| F-12 | Error and status states | Loading, sukses, gagal, validasi file, reset, dan unduh. | Tidak ada tombol utama yang hanya dekoratif. Status menggambarkan proses nyata. |

### P1 — Tambahan jika fitur P0 stabil

- Crop PDF sederhana jika pustaka yang dipilih mampu mengubah batas halaman dengan benar.
- Extract pages sebagai tool tersendiri atau bagian dari Split/Organize.
- Remove pages sebagai jalan pintas menuju Organize PDF.
- Dukungan drag-and-drop dan penambahan file bertahap.
- Pilihan nama file hasil sebelum unduhan.
- Shortcut untuk membuka tool terakhir atau tool populer tanpa menyimpan riwayat di server.

### P2 — Evaluasi setelah MVP

- Protect PDF dengan kata sandi jika dukungan enkripsi terverifikasi.
- Fitur konversi dokumen Office menggunakan pendekatan teknis yang realistis.
- Kompresi lanjutan melalui worker WASM atau mesin khusus, jika dapat digunakan dengan biaya hosting yang sesuai.
- PWA/offline caching, setelah dampak ukuran bundle dan pembaruan aplikasi dievaluasi.

## 8. Alur Pengguna Utama

### Alur umum tool

1. Pengguna membuka beranda MyPDFGweh.
2. Pengguna memilih tool melalui kartu kategori atau pencarian.
3. Halaman tool menampilkan penjelasan singkat dan area unggah.
4. Pengguna memilih atau menyeret file ke area unggah.
5. Aplikasi memvalidasi input, menampilkan file, dan menyediakan pengaturan yang sesuai.
6. Pengguna menjalankan operasi.
7. Aplikasi menunjukkan status proses dan menangani kesalahan bila terjadi.
8. Jika berhasil, aplikasi memperlihatkan ringkasan output dan tombol unduh.
9. Saat pengguna reset atau meninggalkan halaman, objek sementara dibersihkan sesuai kebutuhan.

### Alur Merge PDF

Pilih beberapa PDF → urutkan file → proses → validasi output PDF → unduh hasil.

### Alur Split PDF

Pilih PDF → baca jumlah halaman → masukkan rentang → validasi → proses → unduh PDF atau ZIP.

### Alur Organize PDF

Pilih PDF → render thumbnail → susun/hapus/rotasi halaman → tinjau susunan → proses → unduh.

### Alur PDF ke gambar

Pilih PDF → render halaman → pilih halaman/format/resolusi → proses → unduh gambar atau ZIP.

## 9. Persyaratan UI/UX

### Brand

- Nama: **MyPDFGweh**.
- Identitas visual harus original dan mudah diingat.
- Hindari mengambil logo, ikon proprietary, teks pemasaran, atau aset gambar iLovePDF.
- Gunakan kata-kata yang ramah tetapi jelas. Hindari meniru kesalahan penulisan atau gaya copywriting situs referensi.

### Beranda

- Header dengan logo MyPDFGweh dan menu Tools, Tentang, serta Privasi.
- Hero dengan headline ringkas dan search bar yang nyata.
- Kartu tool dengan ikon konsisten, judul, dan deskripsi satu baris.
- Kategori: Atur PDF, Optimalkan PDF, Konversi PDF, dan Edit PDF.
- Bagian penjelasan alur tiga langkah dan informasi privasi yang sesuai implementasi.
- Footer dengan tautan internal dan versi produk opsional.

### Halaman tool

- Breadcrumb atau tombol kembali.
- Judul dan deskripsi spesifik untuk tool tersebut.
- Zona unggah yang mendukung klik dan drag-and-drop.
- Daftar file atau thumbnail halaman.
- Kontrol pengaturan yang tidak berlebihan.
- Tombol aksi utama jelas dan disabled ketika input belum valid.
- Status proses, error yang mudah dipahami, dan tombol unduh setelah berhasil.
- Tombol mulai ulang untuk menghapus hasil/input saat ini.

### Visual

- Gaya SaaS modern, bersih, hangat, dan tidak ramai.
- Latar putih atau off-white, teks charcoal, aksen koral/merah yang terkendali.
- Tipografi sans-serif, kontras memadai, spacing konsisten, radius dan shadow yang halus.
- Hindari gradient berlebihan, dekorasi tanpa tujuan, layout template generik, dan animasi yang memperlambat tool.
- Animasi harus singkat dan menghormati `prefers-reduced-motion`.
- Gunakan ikon Lucide yang konsisten. Hindari emoji sebagai pengganti ikon utama UI.
- Sediakan state hover, focus, active, disabled, loading, empty, success, dan error.

## 10. Persyaratan Teknis

### Stack utama

- Next.js App Router dan TypeScript.
- Tailwind CSS.
- shadcn/ui bila sesuai dengan repository.
- Lucide React.
- `pdf-lib` untuk operasi modifikasi PDF yang didukung.
- `pdfjs-dist` untuk merender dan membaca preview.
- `jszip` bila ZIP beberapa output dibutuhkan.
- Vitest atau runner test yang telah dipakai oleh repository.

Versi library harus diperiksa kompatibilitasnya saat implementasi. Jangan menambahkan package tanpa kebutuhan nyata.

### Deployment dan operasi

- Target hosting: Vercel, untuk penggunaan pribadi/nonkomersial sesuai batasan paket yang digunakan saat deployment.
- Tidak ada database, login, Docker, atau penyimpanan file permanen pada MVP.
- Pemrosesan file lokal pada browser merupakan default.
- Hindari mengirim PDF melalui Vercel Functions jika operasi dapat dilakukan lokal.
- Jika suatu tool membutuhkan proses server, jangan memasukkannya ke MVP tanpa desain, privasi, biaya, dan limit hosting yang jelas.
- Jangan mengklaim “unlimited” secara absolut. Tidak ada kuota akun bukan berarti tidak ada batas memori, ukuran file, atau kemampuan perangkat.

### Struktur kode

Struktur boleh disesuaikan dengan repository, dengan pemisahan yang jelas untuk:

- `app/` untuk halaman dan layout.
- `components/` untuk UI umum.
- `components/tools/` untuk UI masing-masing tool.
- `lib/pdf/` untuk operasi PDF.
- `lib/utils/` untuk validasi, format ukuran, dan helper.
- `types/` untuk tipe bersama.
- `tests/` untuk pengujian.

Hindari komponen raksasa yang mencampur UI, validasi, dan semua operasi PDF dalam satu file.

## 11. Privasi dan Penanganan File

- Beri tahu pengguna bahwa file diproses di browser hanya jika implementasi benar-benar tidak mengunggah file.
- Jangan mengirim dokumen ke analytics, logging, atau API eksternal.
- Jangan menyimpan konten file di localStorage atau sessionStorage.
- Bersihkan object URL, canvas, buffer, dan object sementara ketika tidak lagi digunakan.
- Validasi tipe file, ukuran, jumlah halaman, dan status proses sejauh memungkinkan.
- Jangan menampilkan stack trace kepada pengguna.
- Berikan peringatan saat file besar berisiko memakai memori berlebih.
- Jangan mengandalkan ekstensi file saja sebagai bukti bahwa konten merupakan PDF valid.

## 12. Aksesibilitas dan Responsivitas

- Semua kontrol harus dapat digunakan melalui keyboard.
- Field input memiliki label yang jelas.
- Kontras teks dan indikator state harus memadai.
- Error dan status proses disampaikan melalui teks, bukan warna saja.
- Target klik di layar sentuh harus cukup besar.
- Uji setidaknya pada lebar viewport 390px, 768px, 1024px, dan 1440px.

## 13. Pengujian dan Kriteria Rilis

MVP belum dianggap selesai sebelum:

1. Semua fitur yang ditandai aktif menjalankan operasi nyata.
2. Output dapat dibuka di PDF reader umum.
3. Merge mempertahankan urutan halaman.
4. Split menghasilkan rentang halaman yang benar dan menolak rentang invalid.
5. Organize mempertahankan urutan, penghapusan, dan rotasi sesuai pilihan.
6. Konversi gambar ke PDF menangani banyak gambar dengan benar.
7. PDF ke gambar menghasilkan gambar yang valid.
8. Watermark dan nomor halaman muncul di posisi yang dipilih.
9. Kompresi melaporkan perubahan ukuran secara jujur.
10. PDF rusak atau tidak didukung menghasilkan pesan error yang tepat.
11. Reset menghapus state yang relevan tanpa me-refresh seluruh aplikasi secara tidak perlu.
12. Tidak ada dokumen pengguna yang dikirim ke server jika klaim aplikasi menyatakan proses lokal.
13. Tidak ada error TypeScript, lint, test, atau production build yang diketahui dan belum didokumentasikan.
14. Tidak ada tombol atau kartu aktif yang menuju ke halaman kosong.
15. Tampilan responsive, keyboard focus, dan empty/loading/error states telah diperiksa.
16. Agent telah menjalankan audit langsung terhadap situs referensi dan audit hasil implementasi, atau melaporkan dengan jujur keterbatasan akses browsing.

### Test fixtures minimum

- PDF dua halaman untuk merge/split.
- PDF dengan setidaknya sepuluh halaman untuk organize.
- PDF dengan ukuran halaman atau orientasi berbeda.
- PDF rusak atau input non-PDF untuk menguji error.
- Beberapa JPG/PNG dengan dimensi berbeda.
- File PDF yang ukurannya sudah kecil/teroptimasi untuk memeriksa klaim kompresi.

## 14. Rencana Implementasi

### Tahap 1 — Audit dan fondasi

- Audit langsung iLovePDF dan dokumentasi tool yang relevan.
- Catat sitemap tool, pola layout, alur interaksi, kontrol khusus, empty state, dan responsive behavior.
- Buat screenshot referensi bila tersedia melalui browser tool.
- Buat design system original dan struktur proyek.

### Tahap 2 — UI utama

- Implementasikan header, footer, beranda, kategori tool, pencarian, tool cards, dan navigasi.
- Buat template halaman tool serta komponen unggah bersama.

### Tahap 3 — Engine PDF

- Implementasikan dan uji Merge, Split, Organize, Rotate, image-to-PDF, PDF-to-image, Watermark, dan Page Numbers.
- Audit kelayakan Compress PDF secara terpisah.

### Tahap 4 — Integrasi dan hardening

- Hubungkan UI ke operasi PDF nyata.
- Tambahkan loading, reset, validasi, error handling, cleanup, dan progres.
- Jalankan lint, typecheck, test, dan build.

### Tahap 5 — Audit visual dan fungsional

- Bandingkan screenshot MyPDFGweh dengan referensi live dalam viewport yang sama.
- Periksa semua tool aktif pada desktop dan mobile.
- Perbaiki defect prioritas tinggi.
- Perbarui README dan TODO.

## 15. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Browser kehabisan memori saat memproses PDF besar | Batasi operasi simultan, perlihatkan peringatan, bersihkan buffer, dan uji dokumen besar. Hindari menetapkan batas palsu tanpa pengukuran. |
| Kompresi tidak menghasilkan pengurangan ukuran | Laporkan ukuran aktual. Jangan mengklaim penurunan ukuran dan jangan merasterisasi diam-diam. |
| Browser compatibility untuk PDF.js atau worker | Uji worker/build produksi dan dokumentasikan browser yang didukung. |
| UI tampak selesai tetapi tool belum berfungsi | Gunakan feature checklist dan acceptance tests; tool yang belum siap tidak boleh tampil sebagai aktif. |
| Audit live site tidak tersedia di coding agent | Minta agent mencatat keterbatasan dan tidak mengarang temuan. Gunakan browser/Playwright jika tersedia. |
| Hosting gratis berubah batas dan ketentuannya | Periksa dokumen Vercel terbaru saat deployment dan jangan hard-code asumsi kuota ke produk. |

## 16. Audit Referensi Produk

Referensi utama yang harus diperiksa secara langsung oleh coding agent:

- Homepage Bahasa Indonesia: https://www.ilovepdf.com/id
- Homepage Bahasa Inggris: https://www.ilovepdf.com/
- Panduan resmi tool: https://www.ilovepdf.com/help/documentation
- Merge PDF: https://www.ilovepdf.com/merge_pdf
- Split PDF: https://www.ilovepdf.com/split_pdf
- Compress PDF: https://www.ilovepdf.com/compress_pdf
- Organize PDF: https://www.ilovepdf.com/organize-pdf
- Rotate PDF: https://www.ilovepdf.com/rotate_pdf
- JPG to PDF: https://www.ilovepdf.com/jpg_to_pdf
- PDF to JPG: https://www.ilovepdf.com/pdf_to_jpg
- Watermark: https://www.ilovepdf.com/pdf_add_watermark
- Page numbers: https://www.ilovepdf.com/add_pdf_page_number

Situs referensi dapat berubah. Agent harus memperlakukan browser audit saat eksekusi sebagai sumber kondisi terbaru dan mencatat tanggal akses, bukan hanya mengandalkan daftar ini.

## 17. Definisi Selesai

Sebuah tool hanya boleh diberi status **Done** ketika implementasi nyatanya tersedia, kriteria penerimaan lulus, error state ditangani, dan hasil output diuji. Jika baru selesai pada UI, statusnya **UI complete / processing not implemented** dan kartu tool tidak boleh dipromosikan sebagai fitur siap pakai.

Rilis MVP MyPDFGweh berarti fitur P0 yang aktif lulus pengujian, beranda dan halaman tool responsif, tidak ada alur utama yang menyesatkan, dan dokumentasi menjelaskan batasan yang tersisa.
