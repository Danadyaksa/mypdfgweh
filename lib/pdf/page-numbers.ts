import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

export interface PageNumberOptions {
  position?:
    | "bottom-center"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "top-right"
    | "top-left";
  startPage?: number; // 1-indexed, starting document page
  startNumber?: number; // the starting number count
  fontSize?: number;
  margin?: number;
  format?: "number" | "page-of-total";
  colorHex?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "").trim();
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255 || 0.2;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255 || 0.2;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255 || 0.2;
  return { r, g, b };
}

/**
 * Adds dynamic page numbering to a PDF document based on actual page dimensions.
 */
export async function addPageNumbersToPdf(
  buffer: ArrayBuffer,
  options: PageNumberOptions = {}
): Promise<Uint8Array> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const startPage = Math.max(1, options.startPage || 1);
  const startNumber = options.startNumber !== undefined ? options.startNumber : 1;
  const fontSize = options.fontSize || 11;
  const margin = options.margin !== undefined ? options.margin : 28;
  const position = options.position || "bottom-center";
  const format = options.format || "page-of-total";
  const color = hexToRgb(options.colorHex || "#52525b");

  for (let i = startPage - 1; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    const currentNumber = startNumber + (i - (startPage - 1));
    const totalCount = totalPages - (startPage - 1) + (startNumber - 1);

    const text =
      format === "page-of-total"
        ? `Halaman ${currentNumber} dari ${totalCount}`
        : `${currentNumber}`;

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x = 0;
    let y = 0;

    switch (position) {
      case "bottom-center":
        x = width / 2 - textWidth / 2;
        y = margin;
        break;
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "top-center":
        x = width / 2 - textWidth / 2;
        y = height - margin - textHeight;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin - textHeight;
        break;
      case "top-left":
        x = margin;
        y = height - margin - textHeight;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }

  return await pdfDoc.save();
}
