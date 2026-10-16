import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, AlertTriangle, EyeOff, ServerOff, ArrowRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          Komitmen Keamanan & Privasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          Kebijakan Privasi & Batasan Teknis
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-500 leading-relaxed">
          Keterbukaan total mengenai bagaimana dokumen Anda diproses, di mana file disimpan, dan batas teknis yang berlaku.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ServerOff className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Nol Unggahan Server</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Aplikasi ini tidak memiliki endpoint API untuk menerima unggahan dokumen. Seluruh manipulasi biner PDF dikerjakan secara lokal melalui JavaScript di browser.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <EyeOff className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Tanpa Pelacakan Data</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Kami tidak mencatat nama file, teks dokumen, atau konten sensitif Anda. Tidak ada database atau penyimpanan cloud di balik MyPDFGweh.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Pembersihan Memori</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Object URL dan buffer memori sementara secara otomatis dibersihkan dan dilepas begitu Anda selesai mengunduh atau menekan tombol reset.
          </p>
        </div>
      </div>

      {/* Honest Technical Limitations */}
      <div className="rounded-3xl border border-amber-200/80 bg-amber-50/50 p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
          <h2 className="text-xl font-bold text-stone-900">
            Batasan Teknis yang Perlu Diketahui
          </h2>
        </div>

        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>
            Sebagai pengembang yang jujur, kami tidak membuat klaim manipulatif seperti &quot;tanpa batas ukuran sama sekali&quot; atau &quot;selalu berhasil memperkecil ukuran file 100%&quot;. Berikut adalah kondisi teknis yang perlu diperhatikan:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2 text-stone-600">
            <li>
              <strong>Batas Memori RAM Perangkat:</strong> Karena pemrosesan berjalan di memori browser pengguna, file PDF berukuran sangat besar (ratusan megabyte atau ribuan halaman) dapat menyebabkan konsumsi RAM browser meningkat secara signifikan tergantung spesifikasi perangkat Anda.
            </li>
            <li>
              <strong>Hasil Kompresi PDF:</strong> Kompresi pada browser dilakukan secara aman dan <em>lossless</em> melalui optimasi stream objek internal. Jika dokumen PDF Anda sudah terkompresi maksimal sebelumnya, ukuran file mungkin tidak berkurang drastis (kami tidak merasterisasi teks diam-diam agar teks tetap tajam dan dapat dicari).
            </li>
            <li>
              <strong>PDF Terenkripsi Kata Sandi:</strong> Dokumen yang dikunci dengan password proteksi hak cipta tingkat tinggi (AES-256) memerlukan pembukaan sandi terlebih dahulu sebelum dapat dimanipulasi halamannya.
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-stone-800 transition-all"
        >
          <span>Kembali ke Beranda</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
