import React from "react";
import Link from "next/link";
import { FileText, Shield, Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-stone-50/80 text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-stone-900">
                MyPDF<span className="text-rose-600">Gweh</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
              Alternatif modern, cepat, dan privasi-penuh untuk mengolah file PDF penting.
              Seluruh komputasi berjalan 100% di browser Anda tanpa mengunggah dokumen ke server mana pun.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-500 pt-2">
              <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
                <Shield className="h-3.5 w-3.5" />
                Zero Server Upload
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-medium bg-rose-50 px-2.5 py-1 rounded-md">
                <Sparkles className="h-3.5 w-3.5" />
                Gratis Tanpa Login
              </span>
            </div>
          </div>

          {/* Atur & Optimalkan PDF */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Atur & Optimasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/merge" className="hover:text-rose-600 transition-colors">
                  Gabungkan PDF
                </Link>
              </li>
              <li>
                <Link href="/split" className="hover:text-rose-600 transition-colors">
                  Pisahkan PDF
                </Link>
              </li>
              <li>
                <Link href="/organize" className="hover:text-rose-600 transition-colors">
                  Atur Halaman PDF
                </Link>
              </li>
              <li>
                <Link href="/compress" className="hover:text-rose-600 transition-colors">
                  Kompres PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Konversi & Edit */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Konversi & Edit
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-rose-600 transition-colors">
                  Gambar ke PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="hover:text-rose-600 transition-colors">
                  PDF ke Gambar
                </Link>
              </li>
              <li>
                <Link href="/watermark" className="hover:text-rose-600 transition-colors">
                  Tambah Watermark
                </Link>
              </li>
              <li>
                <Link href="/page-numbers" className="hover:text-rose-600 transition-colors">
                  Nomor Halaman
                </Link>
              </li>
              <li>
                <Link href="/rotate" className="hover:text-rose-600 transition-colors">
                  Putar PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi & Hukum */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Informasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-rose-600 transition-colors">
                  Tentang Aplikasi
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-rose-600 transition-colors">
                  Komitmen Privasi
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-600 transition-colors"
                >
                  Repositori Kode
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-stone-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 MyPDFGweh. Dibuat dengan dedikasi untuk privasi pengguna.</p>
          <div className="flex items-center gap-1 text-stone-500">
            <span>Dijalankan di perangkat lokal</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>Hosting via Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
