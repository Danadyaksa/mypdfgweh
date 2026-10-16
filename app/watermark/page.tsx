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
import { Stamp, ArrowRight, FileText } from "lucide-react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [text, setText] = useState<string>("RAHASIA / CONFIDENTIAL");
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ToolHeader
        category="Edit PDF"
        title="Tambahkan Tanda Air (Watermark) Teks"
        subtitle="Lindungi hak cipta atau tandai status dokumen (Rahasia, Draft, Salinan) dengan teks kustom yang elegan."
      />

      {errorMessage && (
        <div className="mb-6">
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        </div>
      )}

      {isProcessing && (
        <ProcessingState
          title="Menyematkan Tanda Air..."
          subtitle="Menggambar teks watermark ke setiap halaman dokumen PDF di memori browser."
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
              title="Pilih file PDF untuk diberi tanda air"
              description="Seret dan lepas dokumen PDF ke sini atau klik tombol untuk memilih."
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
                      Total {totalPages} Halaman Dokumen
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

                {/* Settings Card */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Teks Tanda Air
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="CONTOH: DOKUMEN RAHASIA"
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Font size */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Ukuran Font ({fontSize} pt)
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

                    {/* Opacity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Opasitas ({Math.round(opacity * 100)}%)
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
                    {/* Position */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Posisi Teks
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as WatermarkOptions["position"])}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800"
                      >
                        <option value="center">Tengah (Center)</option>
                        <option value="top-center">Atas Tengah</option>
                        <option value="bottom-center">Bawah Tengah</option>
                        <option value="top-left">Pojok Kiri Atas</option>
                        <option value="top-right">Pojok Kanan Atas</option>
                        <option value="bottom-left">Pojok Kiri Bawah</option>
                        <option value="bottom-right">Pojok Kanan Bawah</option>
                      </select>
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Sudut Kemiringan
                      </label>
                      <select
                        value={rotationDegrees}
                        onChange={(e) => setRotationDegrees(Number(e.target.value))}
                        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-800"
                      >
                        <option value="45">Diagonal Miring (45°)</option>
                        <option value="0">Mendatar (0°)</option>
                        <option value="90">Vertikal (90°)</option>
                        <option value="-45">Diagonal Mundur (-45°)</option>
                      </select>
                    </div>
                  </div>

                  {/* Color picker */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Warna Tanda Air
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
                              ? "scale-125 border-stone-900 ring-2 ring-rose-400"
                              : "border-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action sidebar */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs h-fit space-y-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Pratinjau Pengaturan
                </h3>

                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 aspect-[3/4] flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-2 border border-dashed border-stone-300 rounded pointer-events-none" />
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Stamp className="h-4 w-4" />
                  <span>Sematkan Watermark</span>
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
