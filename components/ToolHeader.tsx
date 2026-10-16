import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  subtitle: string;
  category: string;
}

export function ToolHeader({ title, subtitle, category }: ToolHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Kembali ke Semua Alat</span>
        </Link>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Proses Lokal di Browser
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
          {category}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {title}
        </h1>
        <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
