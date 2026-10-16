import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingStateProps {
  title?: string;
  subtitle?: string;
  progressPercent?: number;
}

export function ProcessingState({
  title = "Sedang Memproses Dokumen...",
  subtitle = "Mohon tunggu sebentar, file diproses langsung di memori browser Anda.",
  progressPercent,
}: ProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-6 ring-4 ring-rose-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 max-w-md mb-6">{subtitle}</p>

      {progressPercent !== undefined && (
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs font-semibold text-stone-500">
            <span>Kemajuan</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
