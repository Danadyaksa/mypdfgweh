/**
 * Client-side PDF page rendering and thumbnail generation using PDF.js.
 */

let pdfjsLibInstance: typeof import("pdfjs-dist") | null = null;

async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js rendering hanya dapat dijalankan di browser.");
  }

  if (!pdfjsLibInstance) {
    const lib = await import("pdfjs-dist");
    if (!lib.GlobalWorkerOptions.workerSrc) {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
    pdfjsLibInstance = lib;
  }
  return pdfjsLibInstance;
}

export interface PageThumbnail {
  pageIndex: number; // 0-indexed
  pageNumber: number; // 1-indexed
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Renders a specific page of a PDF buffer into a base64 image data URL.
 */
export async function renderPdfPageToDataUrl(
  buffer: ArrayBuffer,
  pageNumber: number, // 1-indexed
  scale: number = 0.5
): Promise<{ dataUrl: string; width: number; height: number }> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;

  try {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Gagal menginisialisasi canvas context.");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // In modern pdfjs-dist v4, render takes canvasContext or canvas
    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    // Clean up canvas
    canvas.width = 0;
    canvas.height = 0;

    return {
      dataUrl,
      width: viewport.width,
      height: viewport.height,
    };
  } finally {
    await pdfDoc.destroy();
  }
}

/**
 * Loads a PDF and generates thumbnails for all pages (or up to maxPages).
 */
export async function generatePdfThumbnails(
  buffer: ArrayBuffer,
  maxPages: number = 50,
  scale: number = 0.4
): Promise<PageThumbnail[]> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;

  const totalPages = pdfDoc.numPages;
  const count = Math.min(totalPages, maxPages);
  const thumbnails: PageThumbnail[] = [];

  try {
    for (let i = 1; i <= count; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        thumbnails.push({
          pageIndex: i - 1,
          pageNumber: i,
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        });

        canvas.width = 0;
        canvas.height = 0;
      }
    }
  } finally {
    await pdfDoc.destroy();
  }

  return thumbnails;
}

/**
 * Reads total number of pages from a PDF buffer in browser.
 */
export async function getPdfPageCount(buffer: ArrayBuffer): Promise<number> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  await pdfDoc.destroy();
  return numPages;
}
