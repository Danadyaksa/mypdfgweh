"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FilePlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  maxFiles?: number;
}

export function FileDropzone({
  onFilesSelected,
  accept = "application/pdf",
  multiple = false,
  title = "Pilih file PDF",
  description = "atau seret dan lepas dokumen Anda langsung ke sini",
  buttonText = "Pilih Dokumen PDF",
  maxFiles = 25,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateAndDispatchFiles = (fileList: FileList | null) => {
    setErrorMessage(null);
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    if (!multiple && filesArray.length > 1) {
      setErrorMessage("Fitur ini hanya menerima 1 file dalam satu waktu.");
      onFilesSelected([filesArray[0]]);
      return;
    }

    if (filesArray.length > maxFiles) {
      setErrorMessage(`Maksimal ${maxFiles} file sekaligus untuk menjaga performa memori browser.`);
    }

    const selected = filesArray.slice(0, maxFiles);
    onFilesSelected(selected);

    // Reset input value so selecting the same file again triggers onChange
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    validateAndDispatchFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndDispatchFiles(e.target.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200",
          isDragOver
            ? "border-rose-500 bg-rose-50/60 scale-[1.01]"
            : "border-stone-300 bg-white hover:border-rose-400 hover:bg-stone-50/50 shadow-sm"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200 group-hover:scale-110 transition-transform duration-200 mb-5">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 active:scale-[0.98] transition-all"
        >
          <FilePlus className="h-4 w-4" />
          <span>{buttonText}</span>
        </button>

        <p className="mt-4 text-[11px] text-stone-400 font-medium">
          Privasi terjamin: Dokumen tidak meninggalkan memori perangkat Anda.
        </p>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200/80">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
