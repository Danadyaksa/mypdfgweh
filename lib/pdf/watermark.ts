import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { isValidPdfHeader } from "../utils";

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  colorHex?: string;
  opacity?: number;
  rotationDegrees?: number;
  position?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  pageIndices?: number[];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
      g: parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
      b: parseInt(cleanHex[2] + cleanHex[2], 16) / 255,
    };
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255 || 0;
  return { r, g, b };
}

/**
 * Adds a customizable text watermark to a PDF document.
 */
export async function addWatermarkToPdf(
  buffer: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  if (!isValidPdfHeader(buffer)) {
    throw new Error("File PDF tidak valid atau rusak.");
  }
  if (!options.text || !options.text.trim()) {
    throw new Error("Teks tanda air tidak boleh kosong.");
  }

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const fontSize = options.fontSize || 48;
  const color = hexToRgb(options.colorHex || "#e11d48");
  const opacity = Math.min(1, Math.max(0.05, options.opacity ?? 0.3));
  const rotationAngle = options.rotationDegrees ?? 45;
  const position = options.position || "center";

  const targetSet = options.pageIndices
    ? new Set(options.pageIndices)
    : null;

  for (let i = 0; i < pages.length; i++) {
    if (targetSet && !targetSet.has(i)) {
      continue;
    }

    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x = 0;
    let y = 0;

    switch (position) {
      case "center":
        x = width / 2 - (textWidth / 2) * Math.cos((rotationAngle * Math.PI) / 180);
        y = height / 2 - (textWidth / 2) * Math.sin((rotationAngle * Math.PI) / 180);
        break;
      case "top-left":
        x = 50;
        y = height - 50 - textHeight;
        break;
      case "top-right":
        x = width - textWidth - 50;
        y = height - 50 - textHeight;
        break;
      case "bottom-left":
        x = 50;
        y = 50;
        break;
      case "bottom-right":
        x = width - textWidth - 50;
        y = 50;
        break;
      case "top-center":
        x = width / 2 - textWidth / 2;
        y = height - 50 - textHeight;
        break;
      case "bottom-center":
        x = width / 2 - textWidth / 2;
        y = 50;
        break;
    }

    page.drawText(options.text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotationAngle),
    });
  }

  return await pdfDoc.save();
}
