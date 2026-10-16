"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { addPageNumbersToPdf, PageNumberOptions } from "@/lib/pdf/page-numbers";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";
import { FileDigit, ArrowRight } from "lucide-react";

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberOptions["position"]>("bottom-center");
  const [format, setFormat] = useState<"number" | "page-of-total">("page-of-total");
  const [startPage, setStartPage] = useState<number>(1);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(11);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(selected);
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setTotalPages(doc.getPageCount());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Gagal membaca file PDF: ${msg}`);
      setFile(null);
    }
  };

  const handleProcessPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      const numberedBytes = await addPageNumbersToPdf(buffer, {
        position,
        format,
        startPage,
        startNumber,
        fontSize,
      });

      const blob = new Blob([numberedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal menambahkan nomor halaman.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(resultBlob, `${cleanName}_bernomor.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setResultBlob(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Tambahkan nomor halaman ke PDF"
        subtitle="Sisipkan penomoran halaman otomatis pada posisi header atau footer dokumen Anda."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Menambahkan Nomor Halaman..."
          subtitle="Menyematkan nomor halaman pada dokumen."
        />
      )}

      {!isProcessing && resultBlob && file && (
        <DownloadCard
          title="Nomor Halaman Berhasil Ditambahkan!"
          filename={`${file.name.replace(/\.pdf$/i, "")}_bernomor.pdf`}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {!isProcessing && !resultBlob && (
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
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 truncate max-w-sm">
                      {file.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Total {totalPages} Halaman
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600"
                  >
                    Ganti File
                  </button>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Posisi Penomoran
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "top-left", label: "Kiri Atas" },
                        { id: "top-center", label: "Tengah Atas" },
                        { id: "top-right", label: "Kanan Atas" },
                        { id: "bottom-left", label: "Kiri Bawah" },
                        { id: "bottom-center", label: "Tengah Bawah" },
                        { id: "bottom-right", label: "Kanan Bawah" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setPosition(pos.id as PageNumberOptions["position"])}
                          className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                            position === pos.id
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Format Nomor
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormat("page-of-total")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          format === "page-of-total"
                            ? "border-rose-500 bg-rose-50 text-rose-800"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span className="font-bold text-xs block">Halaman n dari Total</span>
                        <span className="text-[11px] text-stone-500">Contoh: Halaman 1 dari 10</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat("number")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          format === "number"
                            ? "border-rose-500 bg-rose-50 text-rose-800"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span className="font-bold text-xs block">Angka Sederhana</span>
                        <span className="text-[11px] text-stone-500">Contoh: 1, 2, 3</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Mulai dari Halaman
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={startPage}
                        onChange={(e) => setStartPage(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Nomor Pertama
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={startNumber}
                        onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Posisi:</span>
                    <span className="font-semibold capitalize">{(position || "bottom-center").replace("-", " ")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPageNumbers}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <FileDigit className="h-4 w-4" />
                  <span>Tambahkan Nomor</span>
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
