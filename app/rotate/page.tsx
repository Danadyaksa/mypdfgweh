"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { rotatePdf } from "@/lib/pdf/rotate";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";
import { RotateCw, FileText, ArrowRight, Check } from "lucide-react";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [targetMode, setTargetMode] = useState<"all" | "custom">("all");
  const [customPagesStr, setCustomPagesStr] = useState<string>("1");
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
      const count = doc.getPageCount();
      setTotalPages(count);
      setCustomPagesStr(`1-${count}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Gagal membaca file PDF: ${msg}`);
      setFile(null);
    }
  };

  const handleProcessRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      let pageIndices: number[] | undefined = undefined;

      if (targetMode === "custom") {
        const parts = customPagesStr.split(",").map((p) => p.trim()).filter(Boolean);
        const indices: number[] = [];

        for (const part of parts) {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map((s) => parseInt(s.trim(), 10));
            if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
              throw new Error(`Rentang halaman "${part}" tidak valid.`);
            }
            for (let p = start; p <= end; p++) indices.push(p - 1);
          } else {
            const p = parseInt(part, 10);
            if (isNaN(p) || p < 1 || p > totalPages) {
              throw new Error(`Nomor halaman "${part}" di luar batas (1-${totalPages}).`);
            }
            indices.push(p - 1);
          }
        }
        pageIndices = Array.from(new Set(indices));
      }

      const rotatedBytes = await rotatePdf(buffer, rotationAngle, pageIndices);
      const blob = new Blob([rotatedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal memutar file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(resultBlob, `${cleanName}_diputar_${rotationAngle}deg.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setResultBlob(null);
    setErrorMessage(null);
    setRotationAngle(90);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Edit PDF"
        title="Putar Orientasi File PDF"
        subtitle="Ubah orientasi halaman PDF Anda sebesar 90°, 180°, atau 270° searah jarum jam secara permanen."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Sedang Memutar Dokumen..."
          subtitle="Menyesuaikan orientasi halaman PDF dalam memori browser."
        />
      )}

      {!isProcessing && resultBlob && file && (
        <DownloadCard
          title="Rotasi Dokumen Selesai!"
          filename={`${file.name.replace(/\.pdf$/i, "")}_diputar_${rotationAngle}deg.pdf`}
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
              title="Pilih file PDF untuk diputar"
              description="Tarik dan lepas dokumen PDF ke sini atau klik tombol untuk memilih."
              buttonText="Pilih File PDF"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Document Info and visual selector */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 truncate max-w-sm">
                        {file.name}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {totalPages} Halaman Terdeteksi
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-medium text-stone-400 hover:text-rose-600"
                  >
                    Ganti File
                  </button>
                </div>

                {/* Angle choice */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Pilih Sudut Rotasi (Searah Jarum Jam)
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {[90, 180, 270].map((angle) => (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => setRotationAngle(angle as 90 | 180 | 270)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-sm font-bold transition-all ${
                          rotationAngle === angle
                            ? "border-rose-500 bg-rose-50/80 text-rose-700 shadow-xs ring-2 ring-rose-500/20"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <RotateCw
                          className="h-6 w-6 mb-2 transition-transform duration-300"
                          style={{ transform: `rotate(${angle}deg)` }}
                        />
                        <span>{angle}°</span>
                      </button>
                    ))}
                  </div>

                  {/* Target page mode */}
                  <div className="pt-4 border-t border-stone-100 space-y-3">
                    <span className="text-xs font-bold text-stone-700 block">
                      Target Halaman yang Diputar
                    </span>

                    <div className="flex rounded-xl bg-stone-100 p-1">
                      <button
                        type="button"
                        onClick={() => setTargetMode("all")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          targetMode === "all"
                            ? "bg-white text-rose-600 shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Semua Halaman ({totalPages})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetMode("custom")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          targetMode === "custom"
                            ? "bg-white text-rose-600 shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Halaman Tertentu Saja
                      </button>
                    </div>

                    {targetMode === "custom" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-500">
                          Masukkan nomor atau rentang (contoh: 1, 3-5):
                        </label>
                        <input
                          type="text"
                          value={customPagesStr}
                          onChange={(e) => setCustomPagesStr(e.target.value)}
                          placeholder="1-2"
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-mono text-stone-800"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan Rotasi
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Sudut Putar:</span>
                    <span className="font-bold text-rose-600">{rotationAngle}° Searah Jarum Jam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Cakupan:</span>
                    <span className="font-semibold">
                      {targetMode === "all" ? "Semua Halaman" : `Hal: ${customPagesStr}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessRotate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <RotateCw className="h-4 w-4" />
                  <span>Terapkan Rotasi</span>
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
