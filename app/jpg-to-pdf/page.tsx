"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { FileQueueList } from "@/components/FileQueueList";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { imagesToPdf, ImagesToPdfOptions } from "@/lib/pdf/images-to-pdf";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { Image, FilePlus, ArrowRight } from "lucide-react";

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Fit">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(20);
  const [outputFilename, setOutputFilename] = useState("gambar_tergabung.pdf");
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

  const handleProcessConvert = async () => {
    if (files.length === 0) {
      setErrorMessage("Pilih setidaknya satu file gambar.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const imageInputs = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          buffer: await fileToArrayBuffer(file),
          type: file.type || (file.name.endsWith(".png") ? "image/png" : "image/jpeg"),
        }))
      );

      const options: ImagesToPdfOptions = {
        pageSize,
        orientation,
        margin,
      };

      const pdfBytes = await imagesToPdf(imageInputs, options);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal mengonversi gambar ke PDF.");
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
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Konversi PDF"
        title="Konversi Gambar (JPG/PNG) ke PDF"
        subtitle="Ubah kumpulan foto atau tangkapan layar menjadi dokumen PDF profesional dalam ukuran A4, Letter, atau Fit."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Sedang Menyusun Dokumen PDF..."
          subtitle="Menggabungkan foto dan menyesuaikan resolusi secara proporsional."
        />
      )}

      {!isProcessing && resultBlob && (
        <DownloadCard
          title="PDF dari Gambar Berhasil Dibuat!"
          filename={outputFilename}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      )}

      {!isProcessing && !resultBlob && (
        <div>
          {files.length === 0 ? (
            <FileDropzone
              accept="image/jpeg,image/png,image/webp"
              multiple
              onFilesSelected={handleFilesSelected}
              title="Pilih gambar JPG, PNG, atau WEBP"
              description="Tarik dan lepas gambar Anda ke sini atau klik tombol untuk memilih."
              buttonText="Pilih Foto & Gambar"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <FileQueueList
                  accept="image/jpeg,image/png,image/webp"
                  files={files}
                  onRemove={handleRemove}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onAddMore={handleFilesSelected}
                />
              </div>

              {/* Sidebar Settings */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Pengaturan Tata Letak
                </h3>

                {/* Page Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Ukuran Halaman
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as "A4" | "Letter" | "Fit")}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800"
                  >
                    <option value="A4">A4 (Standard 210 x 297 mm)</option>
                    <option value="Letter">Letter (216 x 279 mm)</option>
                    <option value="Fit">Fit (Ukuran Asli Gambar)</option>
                  </select>
                </div>

                {/* Orientation */}
                {pageSize !== "Fit" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Orientasi Kertas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrientation("portrait")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          orientation === "portrait"
                            ? "border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500/20"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Tegak (Portrait)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrientation("landscape")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          orientation === "landscape"
                            ? "border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500/20"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Mendatar (Landscape)
                      </button>
                    </div>
                  </div>
                )}

                {/* Margin */}
                {pageSize !== "Fit" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Batas Tepi (Margin)
                    </label>
                    <select
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800"
                    >
                      <option value="0">Tanpa Margin (Penuh)</option>
                      <option value="20">Kecil (20 pt)</option>
                      <option value="36">Normal (36 pt)</option>
                    </select>
                  </div>
                )}

                {/* Output filename */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <label className="text-xs font-semibold text-stone-700">
                    Nama File Hasil
                  </label>
                  <input
                    type="text"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleProcessConvert}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Image className="h-4 w-4" />
                  <span>Konversi ({files.length} Foto) ke PDF</span>
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
