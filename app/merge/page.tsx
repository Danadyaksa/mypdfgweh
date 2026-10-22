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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Gabungkan file PDF"
        subtitle="Gabungkan PDF dengan urutan yang Anda inginkan dengan penggabungan PDF termudah."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Menggabungkan PDF..."
          subtitle="Menyatukan dokumen Anda sesuai urutan yang dipilih."
        />
      )}

      {!isProcessing && resultBlob && (
        <DownloadCard
          title="File PDF Berhasil Digabungkan!"
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
              buttonText="Pilih beberapa file PDF"
              description="atau letakkan PDF di sini"
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
              <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs h-fit space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    Pengaturan
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Gunakan panah untuk mengubah urutan sebelum menggabungkan.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Nama File Hasil
                    </label>
                    <input
                      type="text"
                      value={outputFilename}
                      onChange={(e) => setOutputFilename(e.target.value)}
                      placeholder="nama_file.pdf"
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-xs font-medium text-stone-800 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={files.length < 2}
                    onClick={handleProcessMerge}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Gabungkan PDF ({files.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-stone-400 hover:text-stone-700 py-1 transition-colors"
                  >
                    Batal
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
