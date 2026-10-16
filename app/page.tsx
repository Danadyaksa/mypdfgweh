"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  FileCheck,
  Laptop,
} from "lucide-react";
import { TOOLS_CONFIG, ToolCategory } from "@/types/tools";
import { ToolCard } from "@/components/ToolCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const categories: { id: ToolCategory; label: string }[] = [
    { id: "all", label: "Semua Alat" },
    { id: "organize", label: "Atur PDF" },
    { id: "optimize", label: "Optimalkan PDF" },
    { id: "convert", label: "Konversi PDF" },
    { id: "edit", label: "Edit PDF" },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_CONFIG.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200/60 bg-gradient-to-b from-stone-50/60 via-white to-[#FBFBF9]">
        {/* Subtle decorative grid/glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/70 px-4 py-1.5 text-xs font-semibold text-rose-700 shadow-xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span>Alternatif iLovePDF yang 100% Mengutamakan Privasi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.15]">
            Olah File PDF Anda <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600">
              Tanpa Pernah Mengunggah ke Server
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Gabungkan, pisahkan, susun, putar, kompres, dan konversi dokumen PDF Anda seketika.
            Seluruh pemrosesan berjalan 100% di memori browser lokal tanpa database, tanpa login, dan tanpa batasan kuota.
          </p>

          {/* Search bar */}
          <div className="mt-8 mx-auto max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari alat (contoh: gabungkan, pisahkan, kompres, gambar...)"
                className="w-full rounded-2xl border border-stone-200/90 bg-white py-4 pl-12 pr-4 text-sm font-medium text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-stone-400 hover:text-stone-700"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-rose-600 text-white shadow-sm shadow-rose-600/20"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">
              Daftar Peralatan PDF
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Menampilkan {filteredTools.length} dari {TOOLS_CONFIG.length} alat aktif yang siap digunakan
            </p>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-semibold text-stone-800">
              Tidak ada alat yang cocok dengan &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Coba gunakan kata kunci lain seperti &quot;merge&quot;, &quot;split&quot;, &quot;watermark&quot;, atau klik reset.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* 3-Step Simple How It Works */}
      <section className="w-full border-t border-stone-200/80 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              Cara Kerja Sederhana dalam 3 Langkah
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Tidak perlu instalasi aplikasi desktop atau membuat akun. Semua selesai dalam sekejap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Pilih Dokumen
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tarik dan lepas file PDF atau gambar dari komputer maupun ponsel Anda. File langsung dibaca di browser.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Atur & Sesuaikan
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tentukan urutan, pilih rentang halaman, posisikan tanda air, atau sesuaikan orientasi sesuai kebutuhan Anda.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">
                Unduh Seketika
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Klik proses dan hasilkan dokumen PDF baru secara instan. Unduh satu file atau arsip ZIP sekaligus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee & Architecture */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-stone-200/90 bg-gradient-to-br from-stone-900 to-stone-850 p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 ring-1 ring-inset ring-rose-500/30 mb-4">
              <ShieldCheck className="h-4 w-4 text-rose-400" />
              Jaminan Privasi Penuh
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Mengapa MyPDFGweh Jauh Lebih Aman untuk Dokumen Sensitif?
            </h2>
            <p className="mt-3 text-sm text-stone-300 leading-relaxed">
              Layanan komersial gratis umumnya mengirim file Anda ke server cloud pihak ketiga untuk diproses di backend mereka.
              Di MyPDFGweh, kami menggunakan arsitektur <strong>WebAssembly & Web Worker</strong> murni. File tidak pernah meninggalkan memori perangkat Anda.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-rose-400">
                <Laptop className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Memori Lokal</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Operasi PDF dikerjakan oleh CPU perangkat Anda secara langsung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-emerald-400">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Nol Database</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Tidak ada penyimpanan file permanen, cookies pelacak, atau profil akun.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Tanpa Kuota Harian</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Gunakan sepuasnya tanpa batasan jumlah file buatan atau paywall tersembunyi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
