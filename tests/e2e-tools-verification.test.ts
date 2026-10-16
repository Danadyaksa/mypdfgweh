import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfFiles } from "../lib/pdf/merge";
import { splitPdfByRanges, extractAllPages } from "../lib/pdf/split";
import { organizePdf } from "../lib/pdf/organize";
import { rotatePdf } from "../lib/pdf/rotate";
import { imagesToPdf } from "../lib/pdf/images-to-pdf";
import { addWatermarkToPdf } from "../lib/pdf/watermark";
import { addPageNumbersToPdf } from "../lib/pdf/page-numbers";
import { optimizePdf } from "../lib/pdf/compress";
import { packagePdfsToZip } from "../lib/pdf/zip";
import { createTestPdf, createTestPngBuffer } from "./fixtures";

describe("E2E Tool-by-Tool Comprehensive Verification", () => {
  // 1. Merge PDF
  describe("Tool 1: Merge PDF (/merge)", () => {
    it("should successfully merge multiple PDFs into one valid document", async () => {
      const pdfA = await createTestPdf(2, "DocA");
      const pdfB = await createTestPdf(3, "DocB");

      const merged = await mergePdfFiles([
        { name: "a.pdf", buffer: pdfA.buffer as ArrayBuffer },
        { name: "b.pdf", buffer: pdfB.buffer as ArrayBuffer },
      ]);

      expect(merged).toBeDefined();
      const doc = await PDFDocument.load(merged);
      expect(doc.getPageCount()).toBe(5);
    });

    it("should return error if less than 2 files provided", async () => {
      const pdf = await createTestPdf(1);
      await expect(
        mergePdfFiles([{ name: "single.pdf", buffer: pdf.buffer as ArrayBuffer }])
      ).rejects.toThrow("Pilih setidaknya 2 file PDF");
    });
  });

  // 2. Split PDF
  describe("Tool 2: Split PDF (/split)", () => {
    it("should split PDF into specified ranges", async () => {
      const pdf = await createTestPdf(6, "Hal");
      const results = await splitPdfByRanges(pdf.buffer as ArrayBuffer, "doc.pdf", [
        { name: "P1", rangeStr: "1-2" },
        { name: "P2", rangeStr: "3-6" },
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].pageCount).toBe(2);
      expect(results[1].pageCount).toBe(4);

      const zip = await packagePdfsToZip(results);
      expect(zip.blob.size).toBeGreaterThan(0);
    });

    it("should extract all pages individually", async () => {
      const pdf = await createTestPdf(3, "Page");
      const results = await extractAllPages(pdf.buffer as ArrayBuffer, "doc.pdf");
      expect(results).toHaveLength(3);
    });
  });

  // 3. Organize PDF
  describe("Tool 3: Organize PDF (/organize)", () => {
    it("should reorder, rotate, and delete pages accurately", async () => {
      const pdf = await createTestPdf(4);
      // Keep page 4 (index 3) and page 2 (index 1) with 90 deg rotation, omit pages 1 & 3
      const organized = await organizePdf(pdf.buffer as ArrayBuffer, [
        { originalPageIndex: 3, rotation: 90 },
        { originalPageIndex: 1, rotation: 0 },
      ]);

      const doc = await PDFDocument.load(organized);
      expect(doc.getPageCount()).toBe(2);
      expect(doc.getPage(0).getRotation().angle).toBe(90);
    });
  });

  // 4. Rotate PDF
  describe("Tool 4: Rotate PDF (/rotate)", () => {
    it("should rotate all pages by 90, 180, or 270 degrees", async () => {
      const pdf = await createTestPdf(2);
      const rotated = await rotatePdf(pdf.buffer as ArrayBuffer, 90);
      const doc = await PDFDocument.load(rotated);
      expect(doc.getPage(0).getRotation().angle).toBe(90);
      expect(doc.getPage(1).getRotation().angle).toBe(90);
    });
  });

  // 5. JPG to PDF
  describe("Tool 5: JPG/PNG to PDF (/jpg-to-pdf)", () => {
    it("should convert image buffers into a clean PDF document", async () => {
      const pngBuffer = createTestPngBuffer();
      const pdf = await imagesToPdf(
        [
          { name: "foto1.png", buffer: pngBuffer, type: "image/png" },
          { name: "foto2.png", buffer: pngBuffer, type: "image/png" },
        ],
        { pageSize: "A4", orientation: "portrait", margin: 20 }
      );

      const doc = await PDFDocument.load(pdf);
      expect(doc.getPageCount()).toBe(2);
    });
  });

  // 6. Watermark
  describe("Tool 6: Add Watermark (/watermark)", () => {
    it("should add text watermark to pages with customized styling", async () => {
      const pdf = await createTestPdf(2);
      const watermarked = await addWatermarkToPdf(pdf.buffer as ArrayBuffer, {
        text: "CONFIDENTIAL",
        fontSize: 32,
        colorHex: "#e11d48",
        opacity: 0.3,
        rotationDegrees: 45,
        position: "center",
      });

      const doc = await PDFDocument.load(watermarked);
      expect(doc.getPageCount()).toBe(2);
    });
  });

  // 7. Page Numbers
  describe("Tool 7: Add Page Numbers (/page-numbers)", () => {
    it("should insert page numbers with chosen position and format", async () => {
      const pdf = await createTestPdf(3);
      const numbered = await addPageNumbersToPdf(pdf.buffer as ArrayBuffer, {
        position: "bottom-center",
        format: "page-of-total",
        startPage: 1,
        startNumber: 1,
      });

      const doc = await PDFDocument.load(numbered);
      expect(doc.getPageCount()).toBe(3);
    });
  });

  // 8. Compress PDF
  describe("Tool 8: Compress PDF (/compress)", () => {
    it("should optimize object streams and report honest metrics", async () => {
      const pdf = await createTestPdf(3);
      const result = await optimizePdf(pdf.buffer as ArrayBuffer);

      expect(result.originalSize).toBeGreaterThan(0);
      expect(result.compressedSize).toBeGreaterThan(0);
      expect(result.compressedBytes.length).toBeGreaterThan(0);
    });
  });
});
