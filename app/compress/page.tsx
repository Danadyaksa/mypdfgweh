"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { optimizePdf, CompressionResult } from "@/lib/pdf/compress";
import { downloadBlob, fileToArrayBuffer, formatBytes } from "@/lib/utils";
import { Minimize2, ArrowRight } from "lucide-react";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setErrorMessage(null);
    setResult(null);
  };

  const handleProcessCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      const res = await optimizePdf(buffer);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal mengoptimalkan file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    const blob = new Blob([result.compressedBytes as unknown as BlobPart], { type: "application/pdf" });
    downloadBlob(blob, `${cleanName}_terkompres.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Kompres file PDF"
        subtitle="Kurangi ukuran file PDF dengan tetap mempertahankan kualitas dokumen."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Mengompres PDF..."
          subtitle="Mengoptimalkan ukuran dokumen Anda."
        />
      )}

      {!isProcessing && result && file && (
        <div className="space-y-6">
          <DownloadCard
            title={
              result.isSmaller
                ? "File PDF Berhasil Dikompres!"
                : "PDF Sudah Dalam Ukuran Optimal"
            }
            filename={`${file.name.replace(/\.pdf$/i, "")}_terkompres.pdf`}
            fileSizeBytes={result.compressedSize}
            onDownload={handleDownload}
            onReset={handleReset}
            extraStats={[
              { label: "Ukuran Awal", value: formatBytes(result.originalSize) },
              { label: "Ukuran Hasil", value: formatBytes(result.compressedSize) },
              {
                label: result.isSmaller ? "Pengurangan" : "Perubahan",
                value: result.isSmaller
                  ? `-${formatBytes(result.savingsBytes)} (${result.savingsPercent.toFixed(1)}%)`
                  : "0% (Optimal)",
              },
            ]}
          />
        </div>
      )}

      {!isProcessing && !result && (
        <div>
          {!file ? (
            <FileDropzone
              onFilesSelected={handleFileSelected}
              multiple={false}
              buttonText="Pilih file PDF"
              description="atau letakkan PDF di sini"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-xs">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-stone-900 truncate max-w-[150px] sm:max-w-sm">
                      {file.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Ukuran: {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600 shrink-0"
                  >
                    Ganti File
                  </button>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Tingkat Kompresi
                  </h4>

                  <div className="p-4 rounded-xl border-2 border-rose-500 bg-rose-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-stone-900">Kompresi Optimal</span>
                      <span className="text-xs font-bold text-rose-600">Direkomendasikan</span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Kualitas bagus, kompresi tinggi tanpa menghilangkan teks dokumen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan File
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ukuran Saat Ini:</span>
                    <span className="font-bold text-stone-900">{formatBytes(file.size)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessCompress}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>Kompres PDF</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
