import { PDFDocument, degrees } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

/**
 * Rotates all pages or specific page indices of a PDF document by rotationAngle degrees.
 */
export async function rotatePdf(
  buffer: ArrayBuffer,
  rotationAngle: 90 | 180 | 270,
  pageIndicesToRotate?: number[] // 0-indexed, if undefined: rotate all pages
): Promise<Uint8Array> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  if (pages.length === 0) {
    throw new Error("Dokumen tidak memiliki halaman.");
  }

  const targetSet = pageIndicesToRotate
    ? new Set(pageIndicesToRotate)
    : null;

  for (let i = 0; i < pages.length; i++) {
    if (!targetSet || targetSet.has(i)) {
      const page = pages[i];
      const currentAngle = page.getRotation().angle;
      const newAngle = (currentAngle + rotationAngle) % 360;
      page.setRotation(degrees(newAngle));
    }
  }

  return await pdfDoc.save();
}
