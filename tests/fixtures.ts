import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Creates a synthetic multi-page PDF document for testing purposes.
 */
export async function createTestPdf(pageCount: number = 2, titlePrefix: string = "Halaman"): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([400, 600]);
    page.drawText(`${titlePrefix} ${i}`, {
      x: 50,
      y: 500,
      size: 24,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  return await pdfDoc.save();
}

/**
 * Creates a minimal 1x1 PNG image fixture in ArrayBuffer format.
 */
export function createTestPngBuffer(): ArrayBuffer {
  // 1x1 transparent PNG base64
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
