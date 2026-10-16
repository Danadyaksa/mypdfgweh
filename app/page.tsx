"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { TOOLS_CONFIG, ToolCategory } from "@/types/tools";
import { ToolCard } from "@/components/ToolCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const categories: { id: ToolCategory; label: string }[] = [
    { id: "all", label: "Semua" },
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
      <section className="w-full pt-10 pb-10 sm:pt-16 sm:pb-12 text-center px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Semua alat yang Anda butuhkan untuk bekerja dengan PDF di satu tempat
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Setiap alat yang Anda butuhkan untuk mengolah PDF dengan mudah dan cepat. Gabungkan, pisahkan, kompres, konversi, putar, dan edit dokumen dalam hitungan detik.
          </p>

          {/* Search bar */}
          <div className="mt-7 mx-auto max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari alat PDF..."
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-xs font-semibold text-stone-400 hover:text-stone-700"
                >
                  Batal
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs (iLovePDF style) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {filteredTools.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
            <p className="text-base font-semibold text-stone-800">
              Tidak ada alat yang cocok dengan &quot;{searchQuery}&quot;
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 rounded-lg bg-stone-100 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200"
            >
              Tampilkan Semua Alat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
