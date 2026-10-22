"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { splitPdfByRanges, extractAllPages, SplitResultFile } from "@/lib/pdf/split";
import { packagePdfsToZip } from "@/lib/pdf/zip";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";
import { Scissors, FileText, Plus, Trash2, ArrowRight } from "lucide-react";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [mode, setMode] = useState<"ranges" | "all">("ranges");
  const [ranges, setRanges] = useState<{ id: string; name: string; rangeStr: string }[]>([
    { id: "1", name: "Bagian_1", rangeStr: "1" },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<SplitResultFile[] | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(selected);
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setTotalPages(count);
      setRanges([{ id: "1", name: "Bagian_1", rangeStr: count > 1 ? `1-${Math.min(count, 2)}` : "1" }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Gagal membaca file PDF: ${msg}`);
      setFile(null);
    }
  };

  const handleAddRange = () => {
    setRanges((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: `Bagian_${prev.length + 1}`,
        rangeStr: totalPages ? `${totalPages}` : "1",
      },
    ]);
  };

  const handleRemoveRange = (id: string) => {
    if (ranges.length <= 1) return;
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRangeChange = (id: string, field: "name" | "rangeStr", value: string) => {
    setRanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleProcessSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      let outputFiles: SplitResultFile[] = [];

      if (mode === "all") {
        outputFiles = await extractAllPages(buffer, file.name);
      } else {
        outputFiles = await splitPdfByRanges(
          buffer,
          file.name,
          ranges.map((r) => ({ name: r.name, rangeStr: r.rangeStr }))
        );
      }

      setResults(outputFiles);

      if (outputFiles.length > 1) {
        const { blob } = await packagePdfsToZip(outputFiles, `${file.name.replace(/\.pdf$/i, "")}_hasil_pisah.zip`);
        setZipBlob(blob);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal memisahkan file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (fileResult: SplitResultFile) => {
    const blob = new Blob([fileResult.pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    downloadBlob(blob, fileResult.filename);
  };

  const handleDownloadZip = () => {
    if (!zipBlob || !file) return;
    downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/i, "")}_terpisah.zip`);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(null);
    setResults(null);
    setZipBlob(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Pisahkan file PDF"
        subtitle="Pisahkan satu halaman atau semuanya agar mudah dikonversi menjadi file PDF terpisah."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Memisahkan PDF..."
          subtitle="Mengekstrak halaman sesuai pilihan Anda."
        />
      )}

      {!isProcessing && results && (
        <div className="space-y-6">
          <DownloadCard
            title="Pemisahan Dokumen Berhasil!"
            filename={
              results.length === 1
                ? results[0].filename
                : `${results.length} Dokumen PDF Baru Dihasilkan`
            }
            onDownload={() => handleDownloadSingle(results[0])}
            onDownloadZip={results.length > 1 ? handleDownloadZip : undefined}
            zipFilename="dokumen_terpisah.zip"
            onReset={handleReset}
          />

          {results.length > 1 && (
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Unduh Tiap Hasil ({results.length})
              </h4>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {results.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 text-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="font-medium text-stone-800 truncate">
                        {r.filename}
                      </span>
                      <span className="text-xs text-stone-400">
                        ({r.pageCount} hal)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(r)}
                      className="px-3 py-1 bg-white border border-stone-200 text-xs font-semibold rounded-lg text-stone-700 hover:bg-stone-100 shrink-0"
                    >
                      Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isProcessing && !results && (
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
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate max-w-[150px] sm:max-w-sm">
                        {file.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {totalPages} Halaman
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600 shrink-0"
                  >
                    Ganti File
                  </button>
                </div>

                {/* Mode Selector */}
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex rounded-lg bg-stone-100 p-1">
                    <button
                      type="button"
                      onClick={() => setMode("ranges")}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                        mode === "ranges"
                          ? "bg-white text-rose-600 shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Pisahkan menurut rentang
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("all")}
                      className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                        mode === "all"
                          ? "bg-white text-rose-600 shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Ekstrak semua halaman
                    </button>
                  </div>

                  {mode === "ranges" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-700">
                          Rentang Halaman (contoh: 1-3, 5)
                        </span>
                        <button
                          type="button"
                          onClick={handleAddRange}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Tambah Rentang</span>
                        </button>
                      </div>

                      {ranges.map((r, idx) => (
                        <div
                          key={r.id}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100"
                        >
                          <div className="flex-1">
                            <label className="text-[10px] font-semibold text-stone-400 block mb-1">
                              Nama Bagian
                            </label>
                            <input
                              type="text"
                              value={r.name}
                              onChange={(e) => handleRangeChange(r.id, "name", e.target.value)}
                              placeholder={`Bagian_${idx + 1}`}
                              className="w-full rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-base sm:text-xs text-stone-800"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="text-[10px] font-semibold text-stone-400 block mb-1">
                              Rentang (Maks: {totalPages})
                            </label>
                            <input
                              type="text"
                              value={r.rangeStr}
                              onChange={(e) => handleRangeChange(r.id, "rangeStr", e.target.value)}
                              placeholder="1-3"
                              className="w-full rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-base sm:text-xs text-stone-800 font-mono"
                            />
                          </div>

                          {ranges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRange(r.id)}
                              className="self-end sm:self-center p-2 text-stone-400 hover:text-rose-600 sm:mt-4 transition-colors"
                              title="Hapus rentang"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                      Dokumen akan diekstrak menjadi <strong>{totalPages} file PDF</strong> (1 halaman per file) dan siap diunduh.
                    </div>
                  )}
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Halaman:</span>
                    <span className="font-semibold">{totalPages} Halaman</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessSplit}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Scissors className="h-4 w-4" />
                  <span>Pisahkan PDF</span>
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
