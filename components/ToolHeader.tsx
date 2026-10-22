import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  subtitle: string;
  category?: string;
}

export function ToolHeader({ title, subtitle }: ToolHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-2">
      <div className="flex justify-start mb-3 sm:mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors py-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Semua Alat</span>
        </Link>
      </div>

      <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
        {title}
      </h1>
      <p className="mt-2 text-xs sm:text-base text-stone-500 leading-relaxed font-normal">
        {subtitle}
      </p>
    </div>
  );
}
