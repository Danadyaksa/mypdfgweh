"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { FileQueueList } from "@/components/FileQueueList";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { mergePdfFiles } from "@/lib/pdf/merge";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { Layers, ArrowRight } from "lucide-react";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFilename, setOutputFilename] = useState("dokumen_tergabung.pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setErrorMessage(null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleProcessMerge = async () => {
    if (files.length < 2) {
      setErrorMessage("Pilih minimal 2 file PDF untuk digabungkan.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const inputItems = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          buffer: await fileToArrayBuffer(file),
        }))
      );

      const mergedBytes = await mergePdfFiles(inputItems);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal menggabungkan file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const finalName = outputFilename.endsWith(".pdf")
      ? outputFilename
      : `${outputFilename}.pdf`;
    downloadBlob(resultBlob, finalName);
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setErrorMessage(null);
    setOutputFilename("dokumen_tergabung.pdf");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Atur PDF"
        title="Gabungkan File PDF"
        subtitle="Satukan beberapa dokumen PDF menjadi satu file berurutan secara cepat tanpa batasan kuota."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Sedang Menggabungkan Dokumen..."
          subtitle="Menyatukan seluruh halaman sesuai urutan yang Anda tentukan di browser."
        />
      )}

      {!isProcessing && resultBlob && (
        <DownloadCard
          title="Dokumen PDF Berhasil Digabungkan!"
          filename={outputFilename}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {!isProcessing && !resultBlob && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <FileDropzone
              multiple
              onFilesSelected={handleFilesSelected}
              title="Pilih beberapa file PDF"
              description="Tarik dan lepas file ke sini atau klik tombol untuk memilih dokumen dari perangkat Anda."
              buttonText="Pilih File PDF"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <FileQueueList
                  files={files}
                  onRemove={handleRemove}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onAddMore={handleFilesSelected}
                />
              </div>

              {/* Sidebar Settings */}
              <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    Pengaturan Gabung
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Gunakan tombol panah untuk menata urutan dokumen sebelum digabungkan.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-700">
                      Nama File Hasil
                    </label>
                    <input
                      type="text"
                      value={outputFilename}
                      onChange={(e) => setOutputFilename(e.target.value)}
                      placeholder="nama_file.pdf"
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={files.length < 2}
                    onClick={handleProcessMerge}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Gabungkan PDF ({files.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-medium text-stone-400 hover:text-stone-700 py-1 transition-colors"
                  >
                    Batal & Bersihkan Antrean
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
