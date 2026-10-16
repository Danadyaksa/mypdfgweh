"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
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
  title,
  description = "atau letakkan file di sini",
  buttonText = "Pilih file PDF",
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
      setErrorMessage("Pilih satu file dalam satu waktu.");
      onFilesSelected([filesArray[0]]);
      return;
    }

    if (filesArray.length > maxFiles) {
      setErrorMessage(`Maksimal ${maxFiles} file sekaligus.`);
    }

    const selected = filesArray.slice(0, maxFiles);
    onFilesSelected(selected);

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
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-150",
          isDragOver
            ? "border-rose-500 bg-rose-50/70"
            : "border-stone-300 bg-white hover:border-rose-400 shadow-2xs"
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

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-base font-bold text-white shadow-md hover:bg-rose-700 active:scale-[0.98] transition-all mb-4"
        >
          <UploadCloud className="h-5 w-5" />
          <span>{buttonText}</span>
        </button>

        <p className="text-sm text-stone-500 font-medium">
          {description}
        </p>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
