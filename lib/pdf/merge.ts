import { PDFDocument } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

export interface MergeInputFile {
  name: string;
  buffer: ArrayBuffer;
}

/**
 * Merges multiple PDF files into a single PDF in the given order.
 * @throws Error if fewer than 2 files are provided or if any file is corrupted.
 */
export async function mergePdfFiles(files: MergeInputFile[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Pilih setidaknya 2 file PDF untuk digabungkan.");
  }

  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!isValidPdfHeader(file.buffer)) {
      throw new Error(`File "${file.name}" bukan file PDF yang valid atau rusak.`);
    }

    try {
      const srcDoc = await PDFDocument.load(file.buffer, {
        ignoreEncryption: true,
      });

      const pageCount = srcDoc.getPageCount();
      if (pageCount === 0) {
        continue;
      }

      const copiedPages = await mergedPdf.copyPages(
        srcDoc,
        srcDoc.getPageIndices()
      );

      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Gagal membaca file "${file.name}": ${msg}`);
    }
  }

  if (mergedPdf.getPageCount() === 0) {
    throw new Error("Dokumen hasil tidak memiliki halaman apa pun.");
  }

  return await mergedPdf.save();
}
