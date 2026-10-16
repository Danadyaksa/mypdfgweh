import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { parsePageRangeToIndices, splitPdfByRanges, extractAllPages } from "../lib/pdf/split";
import { createTestPdf } from "./fixtures";

describe("Split PDF Engine", () => {
  it("should correctly parse valid range strings into 0-indexed indices", () => {
    const indices = parsePageRangeToIndices("1-3, 5, 8-10", 12);
    expect(indices).toEqual([0, 1, 2, 4, 7, 8, 9]);
  });

  it("should reject out of bounds ranges", () => {
    expect(() => parsePageRangeToIndices("1-15", 10)).toThrow("melebihi total halaman");
    expect(() => parsePageRangeToIndices("0-3", 10)).toThrow("harus bernilai 1 atau lebih");
    expect(() => parsePageRangeToIndices("5-2", 10)).toThrow("tidak boleh lebih besar");
  });

  it("should split PDF into specified ranges", async () => {
    const testPdfBytes = await createTestPdf(10);
    const results = await splitPdfByRanges(testPdfBytes.buffer as ArrayBuffer, "sample.pdf", [
      { name: "Bab1", rangeStr: "1-3" },
      { name: "Bab2", rangeStr: "4-6" },
    ]);

    expect(results).toHaveLength(2);
    expect(results[0].filename).toBe("sample_Bab1.pdf");
    expect(results[0].pageCount).toBe(3);

    const doc1 = await PDFDocument.load(results[0].pdfBytes);
    expect(doc1.getPageCount()).toBe(3);

    const doc2 = await PDFDocument.load(results[1].pdfBytes);
    expect(doc2.getPageCount()).toBe(3);
  });

  it("should extract all pages individually", async () => {
    const testPdfBytes = await createTestPdf(3);
    const results = await extractAllPages(testPdfBytes.buffer as ArrayBuffer, "sample.pdf");

    expect(results).toHaveLength(3);
    expect(results[0].filename).toBe("sample_hal_1.pdf");
    expect(results[1].filename).toBe("sample_hal_2.pdf");
    expect(results[2].filename).toBe("sample_hal_3.pdf");
  });
});
