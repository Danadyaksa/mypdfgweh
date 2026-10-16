import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          Tentang MyPDFGweh
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-500 leading-relaxed font-normal">
          Peralatan PDF online yang dirancang untuk memudahkan pekerjaan dokumen sehari-hari secara cepat dan praktis.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-stone-900">
          Solusi Pengolahan Dokumen PDF
        </h2>
        <div className="space-y-3 text-sm text-stone-600 leading-relaxed font-normal">
          <p>
            MyPDFGweh hadir untuk memberikan kemudahan bagi siapa saja yang perlu mengolah file PDF tanpa ribet. Tidak perlu memasang aplikasi berat di komputer atau ponsel Anda, dan tidak perlu mendaftar akun.
          </p>
          <p>
            Semua fungsi seperti menggabungkan lembaran dokumen, memisahkan halaman, mengompres ukuran file, hingga mengonversi gambar dapat dilakukan langsung melalui browser web Anda dalam beberapa klik.
          </p>
        </div>
      </div>

      {/* Feature Capabilities */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Fitur yang Tersedia
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: "Gabungkan PDF",
              desc: "Satukan banyak dokumen PDF menjadi satu file berurutan.",
            },
            {
              title: "Pisahkan PDF",
              desc: "Ekstrak rentang halaman atau pecah setiap halaman menjadi dokumen terpisah.",
            },
            {
              title: "Atur Halaman PDF",
              desc: "Ubah urutan, putar posisi, atau hapus halaman tertentu.",
            },
            {
              title: "Kompres PDF",
              desc: "Kurangi ukuran file PDF dengan menjaga kualitas teks dokumen.",
            },
            {
              title: "JPG ke PDF",
              desc: "Ubah gambar JPG, PNG, atau WEBP menjadi file PDF.",
            },
            {
              title: "PDF ke JPG",
              desc: "Ekspor lembaran PDF menjadi gambar resolusi tinggi.",
            },
            {
              title: "Tanda Air",
              desc: "Bubuhkan teks watermark pada posisi yang Anda tentukan.",
            },
            {
              title: "Nomor Halaman",
              desc: "Tambahkan penomoran halaman otomatis di header atau footer.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200"
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

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all"
        >
          <span>Mulai Menggunakan Alat</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
