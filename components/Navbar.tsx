"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X, ChevronDown } from "lucide-react";
import { TOOLS_CONFIG } from "@/types/tools";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white font-bold shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              MyPDF<span className="text-rose-600">Gweh</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/merge"
              className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors"
            >
              Gabungkan PDF
            </Link>
            <Link
              href="/split"
              className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors"
            >
              Pisahkan PDF
            </Link>
            <Link
              href="/compress"
              className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors"
            >
              Kompres PDF
            </Link>

            {/* All Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsToolsDropdownOpen(true)}
              onMouseLeave={() => setIsToolsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors"
              >
                <span>Semua Alat PDF</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isToolsDropdownOpen && (
                <div className="absolute top-full left-0 w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-lg animate-in fade-in zoom-in-95 duration-100 z-50">
                  <div className="grid gap-0.5">
                    {TOOLS_CONFIG.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        onClick={() => setIsToolsDropdownOpen(false)}
                      >
                        <span>{tool.name}</span>
                        <span className="text-[11px] text-stone-400 font-normal">
                          {tool.categoryLabel}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Tentang
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Privasi
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-stone-100 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka menu navigasi"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {TOOLS_CONFIG.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="flex flex-col rounded-lg border border-stone-100 bg-stone-50 p-2.5 text-xs font-semibold text-stone-800 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{tool.name}</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {tool.categoryLabel}
                </span>
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-around text-xs font-medium text-stone-600">
            <Link
              href="/about"
              className="py-1 hover:text-rose-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang
            </Link>
            <span className="text-stone-300">•</span>
            <Link
              href="/privacy"
              className="py-1 hover:text-rose-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Privasi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
