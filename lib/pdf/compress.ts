import { PDFDocument } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

export interface CompressionResult {
  compressedBytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savingsBytes: number;
  savingsPercent: number;
  isSmaller: boolean;
}

/**
 * Optimizes PDF object streams and cross-reference structures.
 * Reports actual byte differences transparently without misleading claims.
 */
export async function optimizePdf(buffer: ArrayBuffer): Promise<CompressionResult> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }

  const originalSize = buffer.byteLength;
  const pdfDoc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
  });

  // Save with compressed object streams enabled
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const compressedSize = compressedBytes.length;
  const savingsBytes = originalSize - compressedSize;
  const savingsPercent = originalSize > 0 ? (savingsBytes / originalSize) * 100 : 0;
  const isSmaller = savingsBytes > 0;

  return {
    compressedBytes,
    originalSize,
    compressedSize,
    savingsBytes,
    savingsPercent,
    isSmaller,
  };
}
