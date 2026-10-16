import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Laptop, CheckCircle, ArrowRight, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Tentang Proyek
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          Tentang MyPDFGweh
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-500 leading-relaxed">
          Platform utilitas PDF modern yang lahir dari kebutuhan akan alat pengolah dokumen pribadi yang cepat, bebas hambatan, dan mengutamakan privasi penuh.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-stone-900">
          Mengapa Kami Membangun MyPDFGweh?
        </h2>
        <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
          <p>
            Banyak layanan PDF online di internet yang mewajibkan pengguna mengunggah dokumen pribadi atau pekerjaan mereka ke server cloud eksternal. Seringkali hal tersebut disertai dengan iklan yang mengganggu, batas kuota unggah harian, atau dinding berbayar (paywall) tersembunyi.
          </p>
          <p>
            <strong>MyPDFGweh</strong> dibangun dengan pendekatan yang berbeda: <em>Functional First & Privacy by Default</em>. Kami memanfaatkan kemajuan teknologi web modern seperti <strong>WebAssembly</strong> dan <strong>Web Workers</strong> di dalam browser. Hal ini memungkinkan seluruh kalkulasi pemrosesan PDF dilakukan langsung oleh perangkat Anda tanpa perlu mengunggah satu byte pun ke internet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <Shield className="h-6 w-6 text-rose-600 mb-2" />
            <h4 className="font-bold text-sm text-stone-900">100% Privasi</h4>
            <p className="text-xs text-stone-500 mt-1">Dokumen tidak pernah keluar dari memori browser Anda.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <Sparkles className="h-6 w-6 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-stone-900">Bebas Hambatan</h4>
            <p className="text-xs text-stone-500 mt-1">Tanpa perlu registrasi, login, atau berlangganan akun.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <Laptop className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-bold text-sm text-stone-900">Hosting Efisien</h4>
            <p className="text-xs text-stone-500 mt-1">Didesain khusus untuk hosting ringan tanpa server backend berat.</p>
          </div>
        </div>
      </div>

      {/* Feature Capabilities */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 text-center">
          Peralatan Inti yang Didukung
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Gabungkan Dokumen (Merge)",
              desc: "Satukan banyak PDF menjadi satu dokumen dengan urutan kustom.",
            },
            {
              title: "Pisahkan Dokumen (Split)",
              desc: "Ekstrak rentang halaman atau pecah setiap lembar menjadi PDF mandiri.",
            },
            {
              title: "Atur & Urutkan Halaman (Organize)",
              desc: "Geser posisi lembaran, rotasi visual, dan hapus halaman tak terpakai.",
            },
            {
              title: "Konversi Gambar ke PDF",
              desc: "Ubah foto JPG/PNG menjadi file PDF tata letak A4/Letter/Fit.",
            },
            {
              title: "Ekspor PDF ke Gambar",
              desc: "Render lembaran PDF ke gambar JPG/PNG resolusi tinggi dengan opsi ZIP.",
            },
            {
              title: "Tanda Air & Nomor Halaman",
              desc: "Sematkan watermark teks dan penomoran otomatis yang presisi.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs"
            >
              <CheckCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all"
        >
          <span>Jelajahi Semua Peralatan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
