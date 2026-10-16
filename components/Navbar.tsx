"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { TOOLS_CONFIG } from "@/types/tools";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/20 transition-transform group-hover:scale-105">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-stone-900">
                MyPDF<span className="text-rose-600">Gweh</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10">
                Lokal
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">
              Pengolah Dokumen Pribadi
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Tools Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsDropdownOpen(true)}
            onMouseLeave={() => setIsToolsDropdownOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              Semua Alat PDF
            </button>

            {isToolsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-stone-900/5 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-semibold text-stone-400 px-3 py-1.5 uppercase tracking-wider">
                  Alat Tersedia
                </div>
                <div className="grid gap-1">
                  {TOOLS_CONFIG.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      onClick={() => setIsToolsDropdownOpen(false)}
                    >
                      <span className="font-medium">{tool.name}</span>
                      <span className="text-xs text-stone-400">{tool.categoryLabel}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Tentang
          </Link>

          <Link
            href="/privacy"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Privasi & Keamanan
          </Link>
        </nav>

        {/* Right CTA / Badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Diproses di Browser</span>
          </div>
          <Link
            href="/merge"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            Mulai Sekarang
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Dokumen aman! Semua proses berjalan di memori ponsel / komputer Anda.</span>
          </div>

          <div className="text-xs font-semibold uppercase text-stone-400 tracking-wider pt-2">
            Peralatan Populer
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TOOLS_CONFIG.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="flex flex-col rounded-xl border border-stone-100 bg-stone-50/50 p-2.5 text-xs font-medium text-stone-800 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{tool.name}</span>
                <span className="text-[10px] text-stone-400">{tool.categoryLabel}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
            <Link
              href="/about"
              className="px-2 py-1.5 text-sm font-medium text-stone-700 hover:text-rose-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang MyPDFGweh
            </Link>
            <Link
              href="/privacy"
              className="px-2 py-1.5 text-sm font-medium text-stone-700 hover:text-rose-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Komitmen Privasi & Keterbatasan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
