"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { generatePdfThumbnails, PageThumbnail } from "@/lib/pdf/preview";
import { organizePdf, PageAction } from "@/lib/pdf/organize";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import {
  RotateCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  LayoutGrid,
  Check,
  Undo2,
} from "lucide-react";

interface ManagedPage {
  id: string;
  originalIndex: number;
  thumbnail: PageThumbnail;
  rotation: number;
  isDeleted: boolean;
}

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setIsLoadingThumbnails(true);

    try {
      const buffer = await fileToArrayBuffer(selected);
      setFileBuffer(buffer);

      const thumbs = await generatePdfThumbnails(buffer, 80, 0.5);
      const initialPages: ManagedPage[] = thumbs.map((th, idx) => ({
        id: `page-${idx}`,
        originalIndex: idx,
        thumbnail: th,
        rotation: 0,
        isDeleted: false,
      }));

      setPages(initialPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Gagal memuat pratinjau halaman PDF: ${msg}`);
      setFile(null);
    } finally {
      setIsLoadingThumbnails(false);
    }
  };

  const handleRotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleToggleDeletePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, isDeleted: !p.isDeleted } : p
      )
    );
  };

  const handleMovePage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    setPages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleResetArrangement = () => {
    setPages((prev) =>
      [...prev]
        .sort((a, b) => a.originalIndex - b.originalIndex)
        .map((p) => ({ ...p, rotation: 0, isDeleted: false }))
    );
  };

  const handleProcessOrganize = async () => {
    if (!fileBuffer || !file) return;

    const activePages = pages.filter((p) => !p.isDeleted);
    if (activePages.length === 0) {
      setErrorMessage("Pilih setidaknya satu halaman untuk disimpan.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const actions: PageAction[] = activePages.map((p) => ({
        originalPageIndex: p.originalIndex,
        rotation: p.rotation,
      }));

      const organizedBytes = await organizePdf(fileBuffer, actions);
      const blob = new Blob([organizedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal mengatur halaman PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(resultBlob, `${cleanName}_teratur.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setFileBuffer(null);
    setPages([]);
    setResultBlob(null);
    setErrorMessage(null);
  };

  const activePagesCount = pages.filter((p) => !p.isDeleted).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Atur PDF"
        title="Atur Urutan & Orientasi Halaman PDF"
        subtitle="Ubah posisi halaman, putar sudut orientasi, atau buang halaman yang tidak diinginkan dengan pratinjau visual instan."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isLoadingThumbnails && (
        <ProcessingState
          title="Membuat Pratinjau Halaman..."
          subtitle="Merender thumbnail visual seluruh halaman di browser Anda."
        />
      )}

      {isProcessing && (
        <ProcessingState
          title="Menerapkan Perubahan Urutan..."
          subtitle="Menghasilkan dokumen PDF baru sesuai susunan yang Anda tentukan."
        />
      )}

      {!isProcessing && !isLoadingThumbnails && resultBlob && file && (
        <DownloadCard
          title="Halaman Dokumen Berhasil Disusun!"
          filename={`${file.name.replace(/\.pdf$/i, "")}_teratur.pdf`}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {!isProcessing && !isLoadingThumbnails && !resultBlob && (
        <div>
          {!file ? (
            <FileDropzone
              onFilesSelected={handleFileSelected}
              multiple={false}
              title="Pilih file PDF untuk diatur"
              description="Tarik dan lepas dokumen PDF ke sini untuk melihat dan menata halaman secara visual."
              buttonText="Pilih File PDF"
            />
          ) : (
            <div className="space-y-6">
              {/* Top toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {file.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Menyimpan {activePagesCount} dari {pages.length} halaman
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetArrangement}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Kembalikan Urutan Asli</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors"
                  >
                    Ganti File
                  </button>

                  <button
                    type="button"
                    disabled={activePagesCount === 0}
                    onClick={handleProcessOrganize}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Simpan & Buat PDF</span>
                  </button>
                </div>
              </div>

              {/* Grid of pages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`relative flex flex-col items-center rounded-2xl border p-3 bg-white transition-all shadow-xs ${
                      p.isDeleted
                        ? "border-red-200 bg-red-50/40 opacity-60"
                        : "border-stone-200/90 hover:border-rose-400 hover:shadow-md"
                    }`}
                  >
                    {/* Page badge */}
                    <div className="flex items-center justify-between w-full mb-2 px-1">
                      <span className="text-[11px] font-bold text-stone-600">
                        Hal {p.originalIndex + 1}
                      </span>
                      {p.rotation !== 0 && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {p.rotation}°
                        </span>
                      )}
                    </div>

                    {/* Thumbnail Image */}
                    <div className="relative w-full aspect-[3/4] flex items-center justify-center overflow-hidden rounded-xl bg-stone-100 border border-stone-100">
                      <img
                        src={p.thumbnail.dataUrl}
                        alt={`Halaman ${p.originalIndex + 1}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-200"
                        style={{ transform: `rotate(${p.rotation}deg)` }}
                      />

                      {p.isDeleted && (
                        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                          Dihapus
                        </div>
                      )}
                    </div>

                    {/* Page Controls */}
                    <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMovePage(idx, "left")}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                          title="Geser ke kiri"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === pages.length - 1}
                          onClick={() => handleMovePage(idx, "right")}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                          title="Geser ke kanan"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRotatePage(idx)}
                          className="p-1 text-stone-400 hover:text-rose-600"
                          title="Putar 90 derajat"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDeletePage(idx)}
                          className={`p-1 transition-colors ${
                            p.isDeleted
                              ? "text-emerald-600 hover:text-emerald-700"
                              : "text-stone-400 hover:text-rose-600"
                          }`}
                          title={p.isDeleted ? "Pulihkan halaman" : "Hapus halaman"}
                        >
                          {p.isDeleted ? (
                            <Undo2 className="h-3.5 w-3.5" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
