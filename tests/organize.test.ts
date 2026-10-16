import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { organizePdf } from "../lib/pdf/organize";
import { rotatePdf } from "../lib/pdf/rotate";
import { createTestPdf } from "./fixtures";

describe("Organize and Rotate PDF Engine", () => {
  it("should reorder, rotate, and delete omitted pages", async () => {
    // PDF with 5 pages: [0, 1, 2, 3, 4]
    const testPdfBytes = await createTestPdf(5);

    // Keep page 3 (index 2) rotated 90 deg, and page 1 (index 0) rotated 0 deg, omitting pages 2, 4, 5
    const organizedBytes = await organizePdf(testPdfBytes.buffer as ArrayBuffer, [
      { originalPageIndex: 2, rotation: 90 },
      { originalPageIndex: 0, rotation: 0 },
    ]);

    const resultDoc = await PDFDocument.load(organizedBytes);
    expect(resultDoc.getPageCount()).toBe(2);

    const page1 = resultDoc.getPage(0);
    expect(page1.getRotation().angle).toBe(90);

    const page2 = resultDoc.getPage(1);
    expect(page2.getRotation().angle).toBe(0);
  });

  it("should rotate all pages in PDF", async () => {
    const testPdfBytes = await createTestPdf(3);
    const rotatedBytes = await rotatePdf(testPdfBytes.buffer as ArrayBuffer, 180);

    const doc = await PDFDocument.load(rotatedBytes);
    expect(doc.getPage(0).getRotation().angle).toBe(180);
    expect(doc.getPage(1).getRotation().angle).toBe(180);
    expect(doc.getPage(2).getRotation().angle).toBe(180);
  });

  it("should rotate only selected page indices", async () => {
    const testPdfBytes = await createTestPdf(3);
    const rotatedBytes = await rotatePdf(testPdfBytes.buffer as ArrayBuffer, 90, [1]);

    const doc = await PDFDocument.load(rotatedBytes);
    expect(doc.getPage(0).getRotation().angle).toBe(0);
    expect(doc.getPage(1).getRotation().angle).toBe(90);
    expect(doc.getPage(2).getRotation().angle).toBe(0);
  });
});
