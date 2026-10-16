# Matriks Fitur MyPDFGweh (Feature Matrix)

**Versi:** 1.0.0  
**Tanggal:** 17 Oktober 2026  
**Status Evaluasi:** Rencana Implementasi MVP & Pelacakan  

Keterangan Status:
- `Done`: Implementasi logika pemrosesan riil selesai, UI terintegrasi, dan pengujian diverifikasi.
- `Partial`: Sebagian fungsionalitas berjalan, namun masih ada batasan teknis.
- `UI only`: Tampilan ada, namun belum ada pemrosesan nyata (tidak boleh diaktifkan sebagai tool siap pakai).
- `Not started`: Belum diimplementasikan.
- `Blocked`: Dibatasi oleh keterbatasan pustaka / browser tanpa server.

---

## 1. Fitur Prioritas P0 (Wajib MVP)

| ID | Fitur | Status Target | Arsitektur & Pustaka | Deskripsi & Cakupan |
|---|---|---|---|---|
| **F-01** | **Merge PDF** | `Done` | Client-side (`pdf-lib`) | Memilih $\ge 2$ file PDF, ubah urutan via drag-and-drop / panah, hapus file antrean, gabungkan ke 1 file PDF utuh. |
| **F-02** | **Split PDF** | `Done` | Client-side (`pdf-lib`, `jszip`) | Parsing jumlah halaman, validasi rentang custom (misal `1-3, 5, 8-10`), hasilkan file terpisah atau ZIP unduhan. |
| **F-03** | **Organize PDF** | `Done` | Client-side (`pdf-lib`, `pdfjs-dist`) | Render thumbnail visual tiap halaman, ubah urutan halaman secara bebas, rotasi per halaman, hapus halaman tertentu, reset susunan. |
| **F-04** | **Rotate PDF** | `Done` | Client-side (`pdf-lib`, `pdfjs-dist`) | Rotasi semua halaman atau halaman terpilih dalam kelipatan 90°, 180°, 270°, pratinjau perubahan visual, ekspor PDF valid. |
| **F-05** | **JPG/PNG to PDF** | `Done` | Client-side (`pdf-lib`) | Konversi multiple image (JPG, PNG), atur urutan, orientasi (portrait/landscape), ukuran kertas (A4, Letter, Fit), dan margin. |
| **F-06** | **PDF to JPG/PNG** | `Done` | Client-side (`pdfjs-dist`, `jszip`) | Render halaman dokumen ke canvas, ekspor per halaman ke format JPG/PNG, opsi pengunduhan per gambar atau bundle ZIP. |
| **F-07** | **Add Watermark** | `Done` | Client-side (`pdf-lib`) | Tambah teks tanda air, kendali ukuran, warna, opasitas, rotasi sudut, posisi (9 kuadran), pratinjau visual. |
| **F-08** | **Add Page Numbers** | `Done` | Client-side (`pdf-lib`) | Sisipkan nomor halaman pada footer/header (kiri, tengah, kanan), atur nomor awal, format penomoran, ukuran margin. |
| **F-09** | **Compress PDF** | `Done` | Client-side (`pdf-lib`) | Optimasi struktur objek PDF, pembersihan metadata duplikat & streams, pengukuran transparan (sebelum, sesudah, delta byte, persentase). |
| **F-10** | **Search Tools** | `Done` | Client-side (React State) | Pencarian instan dan filter berdasarkan nama alat dan kategori pada homepage. |
| **F-11** | **Responsive Navigation**| `Done` | Tailwind CSS / Mobile Drawer | Navigasi ramah desktop dan mobile (390px, 768px, 1024px, 1440px), breadcrumb pada tiap tool page. |
| **F-12** | **Error & State Handling**| `Done` | React State / Toasts | Validasi tipe file, error dialog saat file rusak, indikator loading/processing nyata, reset state bersih. |

---

## 2. Fitur P1 & P2 (Non-MVP / Roadmap Masa Depan)

| Fitur | Status Saat Ini | Alasan / Catatan |
|---|---|---|
| PDF ke Word / Excel / PPT | `Not started` (P2) | Memerlukan OCR / rendering parser kompleks yang membutuhkan server backend berat atau lisensi komersial. |
| OCR PDF & Terjemahan AI | `Not started` (P2) | Di luar cakupan hosting gratis dan bertentangan dengan privasi tanpa server lokal. |
| Proteksi Kata Sandi (Password) | `Not started` (P2) | Memerlukan dukungan enkripsi RC4/AES-256 yang kompatibel penuh dengan berbagai PDF reader. |
| Tanda Tangan Elektronik Digital | `Not started` (P2) | Memerlukan sertifikat PKI x509 dan infrastruktur penandatanganan kriptografis. |
