import { PDFDocument } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

/**
 * Parses page range strings like "1-3, 5, 8-10" into 0-indexed page numbers.
 * @throws Error if any page number is out of bounds or syntax is invalid.
 */
export function parsePageRangeToIndices(
  rangeStr: string,
  totalPages: number
): number[] {
  const trimmed = rangeStr.trim();
  if (!trimmed) {
    throw new Error("Rentang halaman tidak boleh kosong.");
  }

  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Rentang halaman tidak valid.");
  }

  const indices: number[] = [];

  for (const part of parts) {
    if (part.includes("-")) {
      const bounds = part.split("-").map((b) => b.trim());
      if (bounds.length !== 2) {
        throw new Error(`Format rentang "${part}" tidak valid. Gunakan format seperti "1-3".`);
      }
      const start = parseInt(bounds[0], 10);
      const end = parseInt(bounds[1], 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Nomor halaman pada "${part}" bukan angka yang valid.`);
      }
      if (start < 1 || end < 1) {
        throw new Error(`Nomor halaman harus bernilai 1 atau lebih.`);
      }
      if (start > end) {
        throw new Error(`Awal rentang (${start}) tidak boleh lebih besar dari akhir rentang (${end}).`);
      }
      if (end > totalPages) {
        throw new Error(`Halaman ${end} melebihi total halaman dokumen (${totalPages}).`);
      }

      for (let p = start; p <= end; p++) {
        indices.push(p - 1); // 0-indexed
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum)) {
        throw new Error(`Halaman "${part}" bukan angka yang valid.`);
      }
      if (pageNum < 1) {
        throw new Error(`Nomor halaman harus bernilai 1 atau lebih.`);
      }
      if (pageNum > totalPages) {
        throw new Error(`Halaman ${pageNum} melebihi total halaman dokumen (${totalPages}).`);
      }
      indices.push(pageNum - 1);
    }
  }

  if (indices.length === 0) {
    throw new Error("Tidak ada halaman yang dipilih.");
  }

  return indices;
}

export interface SplitRangeInput {
  name: string;
  rangeStr: string;
}

export interface SplitResultFile {
  filename: string;
  pdfBytes: Uint8Array;
  pageCount: number;
}

/**
 * Splits a PDF document according to custom range strings.
 */
export async function splitPdfByRanges(
  buffer: ArrayBuffer,
  originalFilename: string,
  ranges: SplitRangeInput[]
): Promise<SplitResultFile[]> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }

  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (totalPages === 0) {
    throw new Error("Dokumen tidak memiliki halaman.");
  }

  const baseName = originalFilename.replace(/\.pdf$/i, "");
  const results: SplitResultFile[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    const pageIndices = parsePageRangeToIndices(r.rangeStr, totalPages);

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      newDoc.addPage(page);
    }

    const bytes = await newDoc.save();
    const cleanName = r.name.trim() || `Part_${i + 1}`;
    results.push({
      filename: `${baseName}_${cleanName}.pdf`,
      pdfBytes: bytes,
      pageCount: pageIndices.length,
    });
  }

  return results;
}

/**
 * Extracts each page of a PDF into its own separate PDF document.
 */
export async function extractAllPages(
  buffer: ArrayBuffer,
  originalFilename: string
): Promise<SplitResultFile[]> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }

  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const baseName = originalFilename.replace(/\.pdf$/i, "");
  const results: SplitResultFile[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
    newDoc.addPage(copiedPage);

    const bytes = await newDoc.save();
    results.push({
      filename: `${baseName}_hal_${i + 1}.pdf`,
      pdfBytes: bytes,
      pageCount: 1,
    });
  }

  return results;
}
