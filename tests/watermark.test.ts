import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { addWatermarkToPdf } from "../lib/pdf/watermark";
import { addPageNumbersToPdf } from "../lib/pdf/page-numbers";
import { createTestPdf } from "./fixtures";

describe("Watermark and Page Numbers", () => {
  it("should add text watermark to all pages", async () => {
    const testPdfBytes = await createTestPdf(2);
    const watermarkedBytes = await addWatermarkToPdf(testPdfBytes.buffer as ArrayBuffer, {
      text: "RAHASIA",
      fontSize: 36,
      opacity: 0.5,
      rotationDegrees: 45,
      position: "center",
    });

    expect(watermarkedBytes).toBeInstanceOf(Uint8Array);
    const doc = await PDFDocument.load(watermarkedBytes);
    expect(doc.getPageCount()).toBe(2);
  });

  it("should add watermark to selected pages only", async () => {
    const testPdfBytes = await createTestPdf(3);
    const watermarkedBytes = await addWatermarkToPdf(testPdfBytes.buffer as ArrayBuffer, {
      text: "DRAFT",
      pageIndices: [0, 2],
    });

    const doc = await PDFDocument.load(watermarkedBytes);
    expect(doc.getPageCount()).toBe(3);
  });

  it("should reject empty watermark text", async () => {
    const testPdfBytes = await createTestPdf(1);
    await expect(
      addWatermarkToPdf(testPdfBytes.buffer as ArrayBuffer, { text: "   " })
    ).rejects.toThrow("Teks tanda air tidak boleh kosong");
  });

  it("should add page numbers with custom positions and formats", async () => {
    const testPdfBytes = await createTestPdf(4);
    const numberedBytes = await addPageNumbersToPdf(testPdfBytes.buffer as ArrayBuffer, {
      position: "bottom-center",
      startPage: 2,
      startNumber: 1,
      format: "page-of-total",
    });

    expect(numberedBytes).toBeInstanceOf(Uint8Array);
    const doc = await PDFDocument.load(numberedBytes);
    expect(doc.getPageCount()).toBe(4);
  });
});
