import JSZip from "jszip";

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

export interface PdfToImageOptions {
  format?: "image/jpeg" | "image/png";
  quality?: number; // 0.1 to 1.0 (for JPEG)
  scale?: number; // 1.0 = 72dpi, 2.0 = 144dpi
  selectedPages?: number[]; // 1-indexed
  onProgress?: (current: number, total: number) => void;
}

export interface RenderedPageImage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  filename: string;
}

/**
 * Converts PDF pages to high-resolution JPG or PNG images directly in the browser.
 */
export async function convertPdfToImages(
  buffer: ArrayBuffer,
  baseFilename: string,
  options: PdfToImageOptions = {}
): Promise<RenderedPageImage[]> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdfDoc = await loadingTask.promise;

  const totalPages = pdfDoc.numPages;
  const format = options.format || "image/jpeg";
  const ext = format === "image/png" ? "png" : "jpg";
  const quality = options.quality ?? 0.9;
  const scale = options.scale ?? 1.5;

  const cleanBaseName = baseFilename.replace(/\.pdf$/i, "");
  const pagesToRender: number[] = [];

  if (options.selectedPages && options.selectedPages.length > 0) {
    for (const p of options.selectedPages) {
      if (p >= 1 && p <= totalPages) {
        pagesToRender.push(p);
      }
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pagesToRender.push(i);
    }
  }

  const results: RenderedPageImage[] = [];

  try {
    for (let idx = 0; idx < pagesToRender.length; idx++) {
      const pageNum = pagesToRender[idx];
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Fill white background before rendering (especially important for JPEG)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      const dataUrl = canvas.toDataURL(format, quality);

      // Convert dataUrl to Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b || new Blob()),
          format,
          quality
        );
      });

      // Cleanup canvas
      canvas.width = 0;
      canvas.height = 0;

      results.push({
        pageNumber: pageNum,
        blob,
        dataUrl,
        filename: `${cleanBaseName}_halaman_${pageNum}.${ext}`,
      });

      if (options.onProgress) {
        options.onProgress(idx + 1, pagesToRender.length);
      }
    }
  } finally {
    await pdfDoc.destroy();
  }

  return results;
}

/**
 * Packages multiple images into a single downloadable ZIP archive.
 */
export async function packageImagesToZip(
  images: RenderedPageImage[],
  zipFilename: string = "halaman-pdf.zip"
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();

  for (const img of images) {
    zip.file(img.filename, img.blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    blob: zipBlob,
    filename: zipFilename.endsWith(".zip") ? zipFilename : `${zipFilename}.zip`,
  };
}
