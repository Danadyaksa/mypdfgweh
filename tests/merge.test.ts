import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfFiles } from "../lib/pdf/merge";
import { createTestPdf } from "./fixtures";

describe("Merge PDF Engine", () => {
  it("should merge two PDFs and preserve page order and count", async () => {
    const pdf1Bytes = await createTestPdf(2, "Doc 1 Hal");
    const pdf2Bytes = await createTestPdf(3, "Doc 2 Hal");

    const mergedBytes = await mergePdfFiles([
      { name: "doc1.pdf", buffer: pdf1Bytes.buffer as ArrayBuffer },
      { name: "doc2.pdf", buffer: pdf2Bytes.buffer as ArrayBuffer },
    ]);

    expect(mergedBytes).toBeInstanceOf(Uint8Array);

    const resultDoc = await PDFDocument.load(mergedBytes);
    expect(resultDoc.getPageCount()).toBe(5);
  });

  it("should throw error if fewer than 2 files are provided", async () => {
    const pdf1Bytes = await createTestPdf(1);
    await expect(
      mergePdfFiles([{ name: "single.pdf", buffer: pdf1Bytes.buffer as ArrayBuffer }])
    ).rejects.toThrow("Pilih setidaknya 2 file PDF");
  });

  it("should throw error when a file is corrupted", async () => {
    const validBytes = await createTestPdf(1);
    const corruptedBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    await expect(
      mergePdfFiles([
        { name: "valid.pdf", buffer: validBytes.buffer as ArrayBuffer },
        { name: "corrupt.pdf", buffer: corruptedBuffer as ArrayBuffer },
      ])
    ).rejects.toThrow("bukan file PDF yang valid atau rusak");
  });
});
