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
    <div className="mb-8 text-center max-w-2xl mx-auto">
      <div className="flex justify-start mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Semua Alat</span>
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900">
        {title}
      </h1>
      <p className="mt-2 text-sm sm:text-base text-stone-500 leading-relaxed font-normal">
        {subtitle}
      </p>
    </div>
  );
}
