"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Download, RotateCcw, FileArchive, Sparkles } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DownloadCardProps {
  title?: string;
  filename: string;
  fileSizeBytes?: number;
  onDownload: () => void;
  onReset: () => void;
  onDownloadZip?: () => void;
  zipFilename?: string;
  extraStats?: {
    label: string;
    value: string;
  }[];
}

export function DownloadCard({
  title = "Dokumen Selesai Diproses!",
  filename,
  fileSizeBytes,
  onDownload,
  onReset,
  onDownloadZip,
  zipFilename,
  extraStats,
}: DownloadCardProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#e11d48", "#f43f5e", "#fb7185", "#cbd5e1"],
      });
    } catch {
      // Ignore if confetti fails in some environments
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-10 sm:p-14 text-center shadow-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 ring-4 ring-emerald-50">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-3 ring-1 ring-inset ring-emerald-600/20">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Berhasil Diselesaikan</span>
      </div>

      <h3 className="text-2xl font-extrabold text-stone-900 mb-2">
        {title}
      </h3>
      <p className="text-sm font-medium text-stone-600 max-w-md mb-2 truncate">
        {filename}
      </p>

      {fileSizeBytes !== undefined && (
        <span className="text-xs text-stone-400 mb-6 font-mono">
          Ukuran: {formatBytes(fileSizeBytes)}
        </span>
      )}

      {/* Extra stats (e.g. for compression savings) */}
      {extraStats && extraStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md my-6 p-4 rounded-2xl bg-stone-50 border border-stone-100">
          {extraStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[11px] text-stone-400 font-medium">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-stone-800">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mt-4">
        <button
          type="button"
          onClick={onDownload}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 active:scale-[0.98] transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Unduh Dokumen</span>
        </button>

        {onDownloadZip && (
          <button
            type="button"
            onClick={onDownloadZip}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all"
          >
            <FileArchive className="h-4 w-4 text-stone-500" />
            <span>Unduh ZIP {zipFilename ? `(${zipFilename})` : ""}</span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Olah File Lain</span>
      </button>
    </div>
  );
}
