"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Scissors,
  LayoutGrid,
  RotateCw,
  Image,
  FileImage,
  Stamp,
  FileDigit,
  Minimize2,
  ArrowRight,
} from "lucide-react";
import { ToolItem } from "@/types/tools";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  const renderIcon = () => {
    const props = { className: "h-6 w-6 text-rose-600 transition-transform group-hover:scale-110 duration-200" };
    switch (tool.icon) {
      case "Layers":
        return <Layers {...props} />;
      case "Scissors":
        return <Scissors {...props} />;
      case "LayoutGrid":
        return <LayoutGrid {...props} />;
      case "RotateCw":
        return <RotateCw {...props} />;
      case "Image":
        return <Image {...props} />;
      case "FileImage":
        return <FileImage {...props} />;
      case "Stamp":
        return <Stamp {...props} />;
      case "FileDigit":
        return <FileDigit {...props} />;
      case "Minimize2":
        return <Minimize2 {...props} />;
      default:
        return <Layers {...props} />;
    }
  };

  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm hover:shadow-md hover:border-rose-300/80 transition-all duration-200 hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50/80 ring-1 ring-rose-200/50 group-hover:bg-rose-100/70 transition-colors">
            {renderIcon()}
          </div>
          {tool.isPopular && (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
              Populer
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors mb-2">
          {tool.name}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-400 group-hover:text-rose-600 transition-colors">
        <span>{tool.categoryLabel}</span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Buka Alat
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
