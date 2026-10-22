"use client";

import React, { useState } from "react";
import { ToolHeader } from "@/components/ToolHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { ProcessingState } from "@/components/ProcessingState";
import { DownloadCard } from "@/components/DownloadCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { addWatermarkToPdf, WatermarkOptions } from "@/lib/pdf/watermark";
import { downloadBlob, fileToArrayBuffer } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";
import { Stamp, ArrowRight } from "lucide-react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [text, setText] = useState<string>("RAHASIA");
  const [fontSize, setFontSize] = useState<number>(48);
  const [colorHex, setColorHex] = useState<string>("#e11d48");
  const [opacity, setOpacity] = useState<number>(0.25);
  const [rotationDegrees, setRotationDegrees] = useState<number>(45);
  const [position, setPosition] = useState<WatermarkOptions["position"]>("center");
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

  const handleProcessWatermark = async () => {
    if (!file) return;
    if (!text.trim()) {
      setErrorMessage("Masukkan teks tanda air.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await fileToArrayBuffer(file);
      const watermarkedBytes = await addWatermarkToPdf(buffer, {
        text,
        fontSize,
        colorHex,
        opacity,
        rotationDegrees,
        position,
      });

      const blob = new Blob([watermarkedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "Gagal menambahkan tanda air pada file PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(resultBlob, `${cleanName}_watermark.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setResultBlob(null);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <ToolHeader
        title="Tambahkan tanda air ke PDF"
        subtitle="Bubuhkan cap teks tanda air ke dokumen PDF Anda dalam hitungan detik."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Menambahkan Tanda Air..."
          subtitle="Membubuhkan teks watermark ke dokumen."
        />
      )}

      {!isProcessing && resultBlob && file && (
        <DownloadCard
          title="Tanda Air Berhasil Ditambahkan!"
          filename={`${file.name.replace(/\.pdf$/i, "")}_watermark.pdf`}
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
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-xs">
                  <div className="min-w-0 pr-2">
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
                    className="text-xs font-semibold text-stone-400 hover:text-rose-600 shrink-0"
                  >
                    Ganti File
                  </button>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Teks Tanda Air
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="CONTOH: DOKUMEN RAHASIA"
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-base sm:text-sm text-stone-800 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Ukuran ({fontSize} pt)
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="80"
                        step="4"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-rose-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Transparansi ({Math.round(opacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-rose-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Posisi
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as WatermarkOptions["position"])}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-base sm:text-xs text-stone-800"
                      >
                        <option value="center">Tengah</option>
                        <option value="top-center">Atas Tengah</option>
                        <option value="bottom-center">Bawah Tengah</option>
                        <option value="top-left">Kiri Atas</option>
                        <option value="top-right">Kanan Atas</option>
                        <option value="bottom-left">Kiri Bawah</option>
                        <option value="bottom-right">Kanan Bawah</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Rotasi
                      </label>
                      <select
                        value={rotationDegrees}
                        onChange={(e) => setRotationDegrees(Number(e.target.value))}
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-base sm:text-xs text-stone-800"
                      >
                        <option value="45">Miring 45°</option>
                        <option value="0">Mendatar 0°</option>
                        <option value="90">Tegak 90°</option>
                        <option value="-45">Miring -45°</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Warna
                    </label>
                    <div className="flex items-center gap-3">
                      {["#e11d48", "#ef4444", "#2563eb", "#16a34a", "#52525b", "#000000"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColorHex(c)}
                          style={{ backgroundColor: c }}
                          className={`h-7 w-7 rounded-full border-2 transition-transform ${
                            colorHex.toLowerCase() === c.toLowerCase()
                              ? "scale-110 border-stone-900"
                              : "border-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Pratinjau
                </h3>

                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 aspect-[3/4] flex items-center justify-center overflow-hidden relative">
                  <span
                    className="font-bold text-center px-2 select-none"
                    style={{
                      fontSize: `${Math.min(fontSize / 2.5, 20)}px`,
                      color: colorHex,
                      opacity: opacity,
                      transform: `rotate(${rotationDegrees}deg)`,
                    }}
                  >
                    {text || "Teks Watermark"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProcessWatermark}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Stamp className="h-4 w-4" />
                  <span>Tambahkan Tanda Air</span>
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
