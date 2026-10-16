import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="flex items-start justify-between rounded-2xl bg-rose-50 border border-rose-200/80 p-4 text-rose-900 shadow-xs animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            Terjadi Kesalahan
          </span>
          <p className="text-sm text-rose-800 leading-relaxed font-medium mt-0.5">
            {message}
          </p>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-700 transition-colors p-1"
          aria-label="Tutup pesan error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
