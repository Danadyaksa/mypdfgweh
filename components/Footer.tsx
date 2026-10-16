import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-stone-900">
                MyPDF<span className="text-rose-600">Gweh</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm leading-relaxed">
              Peralatan PDF online untuk membantu menyelesaikan pekerjaan dokumen Anda dengan cepat dan mudah langsung dari browser.
            </p>
          </div>

          {/* Atur PDF */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Atur PDF
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Konversi & Edit
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-rose-600 transition-colors">
                  JPG ke PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="hover:text-rose-600 transition-colors">
                  PDF ke JPG
                </Link>
              </li>
              <li>
                <Link href="/watermark" className="hover:text-rose-600 transition-colors">
                  Tambahkan Tanda Air
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

          {/* Perusahaan / Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Informasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-rose-600 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-rose-600 transition-colors">
                  Hukum & Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-stone-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
          <p>© 2026 MyPDFGweh. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 font-medium">
            Dibuat oleh <span className="font-semibold text-stone-600">Aksa</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
