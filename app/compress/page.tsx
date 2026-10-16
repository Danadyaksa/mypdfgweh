"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { optimizePdf, CompressionResult } from "@/lib/pdf/compress";
import { downloadBlob, fileToArrayBuffer, formatBytes } from "@/lib/utils";
import { Minimize2, ArrowRight, Info, TrendingDown, AlertCircle } from "lucide-react";

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
    downloadBlob(blob, `${cleanName}_teroptimasi.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Optimalkan PDF"
        title="Kompres & Optimalkan File PDF"
        subtitle="Optimasi struktur objek PDF dan stream data secara transparan tanpa merusak keterbacaan teks asli."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Mengoptimalkan Struktur Objek Dokumen..."
          subtitle="Menghilangkan redundansi data dan mengompresi stream objek di browser."
        />
      )}

      {!isProcessing && result && file && (
        <div className="space-y-6">
          <DownloadCard
            title={
              result.isSmaller
                ? "Ukuran Dokumen Berhasil Dioptimasi!"
                : "Dokumen Telah Teroptimasi Maksimal"
            }
            filename={`${file.name.replace(/\.pdf$/i, "")}_teroptimasi.pdf`}
            fileSizeBytes={result.compressedSize}
            onDownload={handleDownload}
            onReset={handleReset}
            extraStats={[
              { label: "Ukuran Awal", value: formatBytes(result.originalSize) },
              { label: "Ukuran Akhir", value: formatBytes(result.compressedSize) },
              {
                label: result.isSmaller ? "Pengurangan" : "Perubahan",
                value: result.isSmaller
                  ? `-${formatBytes(result.savingsBytes)} (${result.savingsPercent.toFixed(1)}%)`
                  : "+0% (Sudah Optimal)",
              },
            ]}
          />

          {!result.isSmaller && (
            <div className="flex items-start gap-3 rounded-2xl bg-stone-50 border border-stone-200 p-4 text-xs text-stone-600">
              <Info className="h-5 w-5 text-stone-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Catatan Kejujuran:</strong> Dokumen PDF ini sudah memiliki kompresi internal yang sangat padat sebelum diproses, sehingga optimasi struktur objek tidak dapat mengecilkannya lebih jauh tanpa merusak resolusi teks asli (kami tidak melakukan rasterisasi teks diam-diam). File hasil tetap sepenuhnya valid dan siap diunduh.
              </p>
            </div>
          )}
        </div>
      )}

      {!isProcessing && !result && (
        <div>
          {!file ? (
            <FileDropzone
              onFilesSelected={handleFileSelected}
              multiple={false}
              title="Pilih file PDF untuk dikompres"
              description="Tarik dan lepas dokumen PDF ke sini atau klik tombol untuk memilih."
              buttonText="Pilih File PDF"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 truncate max-w-sm">
                      {file.name}
                    </h4>
                    <p className="text-xs text-stone-400">
                      Ukuran Asli: {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-medium text-stone-400 hover:text-rose-600"
                  >
                    Ganti File
                  </button>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Metode Optimasi Transparan
                  </h4>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-stone-700 leading-relaxed">
                      <strong className="text-emerald-950 font-bold block mb-1">
                        Pembersihan Objek & Kompresi Stream (Lossless)
                      </strong>
                      Menyusun ulang cross-reference table dan mengompresi stream objek internal. Dokumen tetap memiliki teks tajam yang dapat dicari (searchable text) tanpa distorsi visual.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-3 text-xs text-stone-500">
                    <AlertCircle className="h-5 w-5 text-stone-400 shrink-0 mt-0.5" />
                    <span>
                      Kami berkomitmen jujur: hasil pengurangan ukuran diukur dalam byte riil setelah kompresi dan ditampilkan apa adanya tanpa angka klaim manipulatif.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan File
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Ukuran Saat Ini:</span>
                    <span className="font-bold text-stone-900">{formatBytes(file.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Metode:</span>
                    <span className="font-semibold text-rose-600">Object Stream Compression</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessCompress}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>Kompres PDF Sekarang</span>
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
