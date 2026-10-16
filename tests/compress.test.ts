import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { optimizePdf } from "../lib/pdf/compress";
import { imagesToPdf } from "../lib/pdf/images-to-pdf";
import { createTestPdf, createTestPngBuffer } from "./fixtures";

describe("Compress and Images-to-PDF Engine", () => {
  it("should compress PDF and report honest byte metrics", async () => {
    const testPdfBytes = await createTestPdf(3);
    const result = await optimizePdf(testPdfBytes.buffer as ArrayBuffer);

    expect(result.originalSize).toBeGreaterThan(0);
    expect(result.compressedSize).toBeGreaterThan(0);
    expect(typeof result.savingsBytes).toBe("number");
    expect(typeof result.savingsPercent).toBe("number");
    expect(typeof result.isSmaller).toBe("boolean");
    expect(result.compressedBytes).toBeInstanceOf(Uint8Array);

    const doc = await PDFDocument.load(result.compressedBytes);
    expect(doc.getPageCount()).toBe(3);
  });

  it("should convert images into a valid PDF document with A4 orientation", async () => {
    const pngBuffer = createTestPngBuffer();
    const pdfBytes = await imagesToPdf(
      [
        { name: "sample1.png", buffer: pngBuffer, type: "image/png" },
        { name: "sample2.png", buffer: pngBuffer, type: "image/png" },
      ],
      { pageSize: "A4", orientation: "portrait", margin: 20 }
    );

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    const doc = await PDFDocument.load(pdfBytes);
    expect(doc.getPageCount()).toBe(2);
  });
});
