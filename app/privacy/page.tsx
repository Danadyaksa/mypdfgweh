import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          Kebijakan Privasi & Ketentuan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-500 leading-relaxed font-normal">
          Informasi mengenai pemrosesan file, penyimpanan data, dan privasi pengguna di MyPDFGweh.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">
            1. Pemrosesan Dokumen
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            Aplikasi MyPDFGweh memproses file dokumen Anda secara langsung di dalam peramban web (browser). Dokumen tidak diunggah atau disimpan di basis data server kami. Begitu proses selesai dan Anda mengunduh hasil atau menutup tab, data sementara akan langsung dibersihkan dari memori browser.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">
            2. Informasi Akun dan Pelacakan
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            Kami tidak mewajibkan pembuatan akun, tidak meminta informasi kartu kredit, dan tidak menyimpan data dokumen Anda. Penggunaan aplikasi ini sepenuhnya terbuka dan bebas digunakan.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">
            3. Batasan Teknis Perangkat
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-normal">
            Karena pengolahan dokumen berjalan langsung menggunakan daya komputasi perangkat Anda, file PDF yang sangat besar (ratusan megabyte atau ribuan halaman) memerlukan memori RAM yang memadai pada komputer atau ponsel Anda agar pemrosesan berjalan optimal.
          </p>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-stone-800 transition-all"
        >
          <span>Kembali ke Beranda</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
