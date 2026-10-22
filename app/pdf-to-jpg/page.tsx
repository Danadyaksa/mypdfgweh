"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { convertPdfToImages, packageImagesToZip, RenderedPageImage } from "@/lib/pdf/pdf-to-images";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";
import { FileImage, Download, FileArchive, ArrowRight } from "lucide-react";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [scale, setScale] = useState<number>(1.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [renderedImages, setRenderedImages] = useState<RenderedPageImage[] | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

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

  const handleProcessConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPercent(0);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      const images = await convertPdfToImages(buffer, file.name, {
        format,
        scale,
        quality: 0.9,
        onProgress: (current, total) => {
          setProgressPercent((current / total) * 100);
        },
      });

      setRenderedImages(images);

      if (images.length > 1) {
        const { blob } = await packageImagesToZip(
          images,
          `${file.name.replace(/\.pdf$/i, "")}_gambar.zip`
        );
        setZipBlob(blob);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal mengonversi halaman PDF ke gambar.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (img: RenderedPageImage) => {
    downloadBlob(img.blob, img.filename);
  };

  const handleDownloadZip = () => {
    if (!zipBlob || !file) return;
    downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/i, "")}_gambar.zip`);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setRenderedImages(null);
    setZipBlob(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Konversi PDF ke JPG"
        subtitle="Ubah setiap halaman dokumen PDF Anda menjadi gambar JPG atau PNG resolusi tinggi."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Mengonversi ke Gambar..."
          subtitle="Merender halaman PDF menjadi gambar."
          progressPercent={progressPercent}
        />
      )}

      {!isProcessing && renderedImages && file && (
        <div className="space-y-6">
          <DownloadCard
            title="Halaman Berhasil Dikonversi ke Gambar!"
            filename={
              renderedImages.length === 1
                ? renderedImages[0].filename
                : `${renderedImages.length} Gambar Dihasilkan`
            }
            onDownload={() => handleDownloadSingle(renderedImages[0])}
            onDownloadZip={renderedImages.length > 1 ? handleDownloadZip : undefined}
            zipFilename="gambar_halaman.zip"
            onReset={handleReset}
          />

          {/* Gallery */}
          <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-stone-900">
                Pratinjau ({renderedImages.length} Gambar)
              </h3>
              {renderedImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-stone-900 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors w-full sm:w-auto min-h-[36px]"
                >
                  <FileArchive className="h-3.5 w-3.5" />
                  <span>Unduh Semua (ZIP)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {renderedImages.map((img) => (
                <div
                  key={img.pageNumber}
                  className="flex flex-col rounded-lg border border-stone-200 bg-stone-50 p-2 text-center"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-white border border-stone-200 mb-2 flex items-center justify-center">
                    <img
                      src={img.dataUrl}
                      alt={`Halaman ${img.pageNumber}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 truncate mb-1">
                    Hal {img.pageNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(img)}
                    className="inline-flex items-center justify-center gap-1 w-full rounded-md bg-white border border-stone-200 py-1.5 text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition-colors min-h-[32px]"
                  >
                    <Download className="h-3 w-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isProcessing && !renderedImages && (
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
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 truncate max-w-[150px] sm:max-w-sm">
                      {file.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Total {totalPages} Halaman
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600 min-h-[36px] inline-flex items-center"
                  >
                    Ganti File
                  </button>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Format Gambar
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormat("image/jpeg")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          format === "image/jpeg"
                            ? "border-rose-500 bg-rose-50 text-rose-800"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="font-bold text-xs block">JPG</span>
                        <span className="text-[11px] text-stone-500">Ukuran lebih hemat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat("image/png")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          format === "image/png"
                            ? "border-rose-500 bg-rose-50 text-rose-800"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <span className="font-bold text-xs block">PNG</span>
                        <span className="text-[11px] text-stone-500">Kualitas tanpa kompresi</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Kualitas Gambar
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setScale(1.0)}
                        className={`py-2.5 sm:py-2 text-xs font-bold rounded-md border transition-all min-h-[36px] ${
                          scale === 1.0
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => setScale(1.5)}
                        className={`py-2.5 sm:py-2 text-xs font-bold rounded-md border transition-all min-h-[36px] ${
                          scale === 1.5
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Tinggi
                      </button>
                      <button
                        type="button"
                        onClick={() => setScale(2.0)}
                        className={`py-2.5 sm:py-2 text-xs font-bold rounded-md border transition-all min-h-[36px] ${
                          scale === 2.0
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Sangat Tinggi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Ringkasan
                </h3>

                <div className="text-xs text-stone-600 space-y-2 py-2 border-y border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Halaman:</span>
                    <span className="font-semibold">{totalPages} Gambar</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessConvert}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <FileImage className="h-4 w-4" />
                  <span>Konversi ke JPG</span>
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
