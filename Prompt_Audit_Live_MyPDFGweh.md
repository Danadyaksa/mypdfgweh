# Prompt untuk AI Coding Agent: Live Website Audit + Implementasi MyPDFGweh

Gunakan prompt ini setelah memberikan `PRD_MyPDFGweh.md` kepada agent. Jika ada instruksi lama yang masih menyebut nama sementara lain, gunakan **MyPDFGweh** sebagai nama produk final.

---

Bertindaklah sebagai Senior Frontend Engineer, QA Engineer, dan Product Design Auditor. Kerjakan audit langsung berbasis browser terhadap website iLovePDF yang saat ini online, lalu audit proyek MyPDFGweh secara langsung. Jangan hanya menebak dari pengetahuan sebelumnya atau berdasarkan screenshot lama.

## A. Sumber yang harus diperiksa secara live

Buka melalui browser/web access yang tersedia:

1. https://www.ilovepdf.com/id
2. https://www.ilovepdf.com/help/documentation
3. https://www.ilovepdf.com/merge_pdf
4. https://www.ilovepdf.com/split_pdf
5. https://www.ilovepdf.com/compress_pdf
6. https://www.ilovepdf.com/organize-pdf
7. https://www.ilovepdf.com/rotate_pdf
8. https://www.ilovepdf.com/jpg_to_pdf
9. https://www.ilovepdf.com/pdf_to_jpg
10. https://www.ilovepdf.com/pdf_add_watermark
11. https://www.ilovepdf.com/add_pdf_page_number

Gunakan website yang live pada waktu audit. Catat tanggal akses. Jika halaman dialihkan, diperbarui, tidak tersedia, atau sebagian kontennya tidak dapat diakses, catat kondisi yang sebenarnya. Jangan mengarang hasil audit.

## B. Cara audit website referensi

Jika browser automation, computer-use, Playwright, atau screenshot browser tersedia, gunakan untuk memeriksa halaman secara nyata. Prioritaskan:

- Homepage pada viewport desktop 1440×900 dan mobile 390×844.
- Satu halaman tool sederhana, minimal Merge PDF dan Compress PDF.
- Organize PDF atau Split PDF untuk memeriksa pratinjau, pilihan halaman, dan kontrol spesifik.
- Posisi header, lebar konten, hierarki judul, warna, typography, spacing, radius kartu, bentuk tombol, ikon, footer, dan perilaku responsive.
- Alur nyata dari memilih file hingga pengaturan, processing state, error/success state, serta download, sebatas yang dapat diuji tanpa mengunggah dokumen sensitif atau melakukan tindakan akun.
- Kategori tool, nama dan deskripsi tool, pencarian jika tersedia, serta bagaimana halaman utama membawa pengguna menuju tool.

Gunakan file PDF dummy atau file uji non-sensitif jika interaksi upload perlu diuji. Jangan unggah dokumen privat pengguna ke website referensi.

Jangan mencoba menyalin source code, membongkar mekanisme internal yang dilindungi, menyalin logo/aset proprietari, atau meniru brand iLovePDF secara persis. Yang diaudit adalah informasi produk yang terlihat publik, alur pengguna, dan pola desain umum. MyPDFGweh wajib mempunyai identitas visual original.

Jika agent tidak memiliki browser atau kemampuan untuk membuka situs secara live, berhenti sejenak dan nyatakan keterbatasan tersebut dalam laporan. Jangan berpura-pura telah melihat halaman atau membuat hasil observasi palsu. Tetap lanjutkan audit repository lokal dan tandai bagian referensi live sebagai belum diverifikasi.

## C. Hasil audit referensi yang wajib dibuat

Buat file `docs/ILOVEPDF_LIVE_AUDIT.md` yang berisi:

- Tanggal dan metode akses.
- Daftar halaman yang benar-benar berhasil dibuka.
- Ringkasan kategori serta tool yang terlihat pada homepage.
- Pola layout yang terlihat pada homepage dan halaman tool.
- Langkah interaksi yang dapat diverifikasi pada tiap tool yang diperiksa.
- Screenshot referensi jika tool lingkungan mengizinkannya. Simpan hanya screenshot untuk dokumentasi pengembangan dan jangan memakainya sebagai aset di produk.
- Hal yang bagus untuk dijadikan prinsip UX dan hal yang tidak relevan bagi MyPDFGweh.
- Temuan yang belum dapat diverifikasi serta alasannya.

Bedakan jelas antara **observed live**, **inferred**, dan **not verified**. Jangan menyebut ukuran, posisi, atau perilaku UI sebagai fakta bila tidak diperiksa.

## D. Audit repository MyPDFGweh

Sebelum mengubah kode, periksa file dan struktur repository saat ini. Jangan menghapus pekerjaan yang sudah benar. Pastikan nama produk konsisten menjadi `MyPDFGweh` pada logo teks, metadata, title, deskripsi, footer, README, dan dokumentasi. Hilangkan nama sementara yang lama, kecuali jika muncul dalam catatan sejarah yang memang perlu dipertahankan.

Cocokkan implementasi lokal dengan PRD. Buat atau perbarui:

- `docs/IMPLEMENTATION_AUDIT.md`
- `docs/FEATURE_MATRIX.md`
- `TODO.md`

Gunakan status fitur yang jujur:
- `Done`: logic sungguhan dan test/validasi output lulus.
- `Partial`: sebagian alur berfungsi, tetapi ada keterbatasan signifikan.
- `UI only`: tampilan ada, operasi belum nyata.
- `Not started`: belum dibuat.
- `Blocked`: terhambat oleh batas library, environment, atau infrastruktur.

Tool dengan status `UI only`, `Not started`, atau `Blocked` tidak boleh tampak seperti tool aktif siap dipakai. Nonaktifkan dengan penjelasan yang jujur atau keluarkan dari daftar tool aktif.

## E. Audit visual langsung atas MyPDFGweh

Jalankan aplikasi lokal jika repository mendukungnya. Gunakan browser, screenshot, atau Playwright jika tersedia. Ambil screenshot beranda dan minimal dua halaman tool pada:

- Desktop 1440×900.
- Mobile 390×844.

Periksa:

- Visual hierarchy dan kejelasan nilai utama produk.
- Jarak antar elemen dan konsistensi grid.
- Navigasi, search, tool cards, upload area, file list, thumbnail, settings, tombol aksi, loading, error, success, dan download state.
- Responsivitas, overflow, clipping, tombol bertumpuk, teks terpotong, fokus keyboard, kontras, target sentuh, serta `prefers-reduced-motion`.
- Konsistensi antara homepage dan halaman tool.
- Komponen yang terlalu ramai, repetitif, atau terlihat seperti template default.
- Semua tombol dan kartu yang tampak interaktif benar-benar melakukan aksi.

Bandingkan referensi dan MyPDFGweh pada ukuran viewport yang sama. Jangan mengejar pixel-perfect copy. Ambil pelajaran dari hirarki, kelancaran alur, dan konsistensi, kemudian terapkan dengan sistem desain MyPDFGweh yang original.

## F. Audit fungsional file PDF

Jalankan operasi nyata dengan fixtures non-sensitif dan periksa outputnya. Minimal audit:

- Merge: dua file, urutan halaman, output valid.
- Split: rentang valid, rentang tidak valid, jumlah halaman output.
- Organize: drag/reorder, remove page, rotate, reset, kecocokan preview dengan output.
- Image to PDF: banyak gambar dengan ukuran berbeda.
- PDF to image: render halaman, format output, unduh banyak halaman.
- Watermark dan page numbers: posisi, rentang halaman, output valid.
- Compress: ukuran sebelum/sesudah, hasil tidak lebih besar secara keliru dilaporkan sukses mengurangi ukuran.
- Error path: file non-PDF, file rusak, input kosong, operasi dibatalkan, dan kegagalan library.

Jika browser automation dapat membantu, gunakan Playwright untuk smoke test UI. Gunakan unit test untuk logic PDF. Jangan menyatakan output benar hanya karena tombol berhasil diklik.

## G. Audit keamanan, privasi, dan performa

- Pastikan tidak ada upload file ke API server atau pihak ketiga jika produk mengklaim file diproses di browser.
- Cari penggunaan network request, analytics, external API, localStorage, sessionStorage, Blob URL, canvas, dan buffer yang berhubungan dengan file.
- Pastikan temporary object URL dan resource yang bisa dilepas dibersihkan.
- Evaluasi ukuran bundle, dinamika import library berat, pemakaian memori, dan apakah PDF.js worker dikonfigurasi dengan benar pada production build.
- Jangan menambahkan limit kuota buatan untuk jumlah penggunaan. Boleh menampilkan peringatan berbasis ukuran atau memori jika masuk akal.
- Jangan mengklaim “unlimited”, “100% secure”, atau pengurangan ukuran yang selalu berhasil.

## H. Urutan tindakan setelah audit

1. Buat `docs/ILOVEPDF_LIVE_AUDIT.md` terlebih dahulu.
2. Buat matriks status setiap fitur berdasarkan PRD.
3. Perbaiki defect P0 dan semua aksi UI yang palsu sebelum menambah fitur baru.
4. Perbaiki layout visual dan responsivitas berdasarkan temuan screenshot.
5. Lengkapi testing untuk fitur yang sudah diperbaiki.
6. Jalankan lint, typecheck, unit test, e2e/smoke test jika tersedia, dan production build.
7. Perbarui `README.md` dan `TODO.md`.

Jangan sekadar memberikan rekomendasi. Lakukan perubahan kode yang aman di repository, verifikasi hasilnya, lalu laporkan yang telah benar-benar dikerjakan.

## I. Laporan akhir wajib

Berikan laporan dengan bagian:

1. Live reference audit: halaman yang diperiksa dan tanggal akses.
2. UI differences: temuan utama dari screenshot desktop dan mobile.
3. Feature matrix: status fitur terhadap PRD.
4. Defect yang ditemukan dan perbaikannya.
5. Unit/e2e test serta build yang benar-benar dijalankan dan hasilnya.
6. Keterbatasan yang masih tersisa.
7. File dokumentasi dan file kode yang berubah.
8. Langkah lanjutan yang memiliki prioritas.

Jangan mengarang screenshot, hasil browser, test, atau build. Jika alat tidak tersedia, tulis secara eksplisit bahwa pemeriksaan tersebut belum dilakukan.

Mulai sekarang dengan memeriksa repository dan mengakses website referensi secara live. Lanjutkan ke audit, implementasi perbaikan, dan verifikasi tanpa berhenti pada perencanaan saja.
