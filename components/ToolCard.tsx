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
} from "lucide-react";
import { ToolItem } from "@/types/tools";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  const getIconConfig = () => {
    switch (tool.id) {
      case "merge":
        return {
          icon: <Layers className="h-7 w-7 text-[#E11D48]" />,
          bg: "bg-rose-50",
        };
      case "split":
        return {
          icon: <Scissors className="h-7 w-7 text-[#EA580C]" />,
          bg: "bg-orange-50",
        };
      case "compress":
        return {
          icon: <Minimize2 className="h-7 w-7 text-[#16A34A]" />,
          bg: "bg-green-50",
        };
      case "organize":
        return {
          icon: <LayoutGrid className="h-7 w-7 text-[#2563EB]" />,
          bg: "bg-blue-50",
        };
      case "rotate":
        return {
          icon: <RotateCw className="h-7 w-7 text-[#7C3AED]" />,
          bg: "bg-purple-50",
        };
      case "jpg-to-pdf":
        return {
          icon: <Image className="h-7 w-7 text-[#D97706]" />,
          bg: "bg-amber-50",
        };
      case "pdf-to-jpg":
        return {
          icon: <FileImage className="h-7 w-7 text-[#0891B2]" />,
          bg: "bg-cyan-50",
        };
      case "watermark":
        return {
          icon: <Stamp className="h-7 w-7 text-[#DC2626]" />,
          bg: "bg-red-50",
        };
      case "page-numbers":
        return {
          icon: <FileDigit className="h-7 w-7 text-[#4F46E5]" />,
          bg: "bg-indigo-50",
        };
      default:
        return {
          icon: <Layers className="h-7 w-7 text-[#E11D48]" />,
          bg: "bg-rose-50",
        };
    }
  };

  const { icon, bg } = getIconConfig();

  return (
    <Link
      href={tool.href}
      className="group flex flex-col rounded-xl sm:rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-xs hover:border-rose-400 hover:shadow-md transition-all duration-150 active:scale-[0.99]"
    >
      <div className={`flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl ${bg} mb-3 sm:mb-4 group-hover:scale-105 transition-transform shrink-0`}>
        {icon}
      </div>

      <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors mb-1 sm:mb-2">
        {tool.name}
      </h3>
      <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
        {tool.shortDesc}
      </p>
    </Link>
  );
}
