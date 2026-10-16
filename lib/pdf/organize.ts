import { PDFDocument, degrees } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

export interface PageAction {
  originalPageIndex: number; // 0-indexed
  rotation: number; // 0, 90, 180, 270
}

/**
 * Reorders, rotates, or deletes pages from an existing PDF.
 */
export async function organizePdf(
  buffer: ArrayBuffer,
  pageActions: PageAction[]
): Promise<Uint8Array> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }
  if (pageActions.length === 0) {
    throw new Error("Pilih setidaknya satu halaman untuk disimpan.");
  }

  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const newDoc = await PDFDocument.create();

  // Validate indices
  const pageIndices = pageActions.map((action) => {
    if (action.originalPageIndex < 0 || action.originalPageIndex >= totalPages) {
      throw new Error(`Indeks halaman ${action.originalPageIndex + 1} tidak ditemukan.`);
    }
    return action.originalPageIndex;
  });

  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

  for (let i = 0; i < copiedPages.length; i++) {
    const page = copiedPages[i];
    const action = pageActions[i];
    
    // Add page rotation
    const currentRotation = page.getRotation().angle;
    const newRotation = (currentRotation + (action.rotation % 360) + 360) % 360;
    page.setRotation(degrees(newRotation));

    newDoc.addPage(page);
  }

  return await newDoc.save();
}
