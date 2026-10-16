import { PDFDocument, PageSizes } from "pdf-lib";

export interface ImageInputItem {
  name: string;
  buffer: ArrayBuffer;
  type: string; // "image/jpeg" | "image/png" etc.
}

export interface ImagesToPdfOptions {
  pageSize: "A4" | "Letter" | "Fit";
  orientation: "portrait" | "landscape";
  margin: number; // in points (e.g., 0, 20, 36)
}

/**
 * Converts multiple JPG or PNG images into a clean PDF document.
 */
export async function imagesToPdf(
  images: ImageInputItem[],
  options: ImagesToPdfOptions = { pageSize: "A4", orientation: "portrait", margin: 20 }
): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error("Pilih setidaknya satu file gambar.");
  }

  const pdfDoc = await PDFDocument.create();

  for (const img of images) {
    let embeddedImage;
    const isPng =
      img.type === "image/png" || img.name.toLowerCase().endsWith(".png");

    try {
      if (isPng) {
        embeddedImage = await pdfDoc.embedPng(img.buffer);
      } else {
        embeddedImage = await pdfDoc.embedJpg(img.buffer);
      }
    } catch {
      // Fallback try the other format in case mimetype was slightly mismatched
      try {
        if (isPng) {
          embeddedImage = await pdfDoc.embedJpg(img.buffer);
        } else {
          embeddedImage = await pdfDoc.embedPng(img.buffer);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Gagal memuat gambar "${img.name}": format tidak didukung (${msg})`);
      }
    }

    const imgDims = embeddedImage.scale(1);

    if (options.pageSize === "Fit") {
      const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
      });
    } else {
      let [baseWidth, baseHeight] =
        options.pageSize === "Letter" ? PageSizes.Letter : PageSizes.A4;

      if (options.orientation === "landscape") {
        [baseWidth, baseHeight] = [baseHeight, baseWidth];
      }

      const margin = Math.max(0, options.margin);
      const availableWidth = baseWidth - margin * 2;
      const availableHeight = baseHeight - margin * 2;

      // Calculate scale to fit within page bounds maintaining aspect ratio
      const scaleFactor = Math.min(
        availableWidth / imgDims.width,
        availableHeight / imgDims.height,
        1 // Don't upscale smaller images unless desired
      );

      const drawWidth = imgDims.width * scaleFactor;
      const drawHeight = imgDims.height * scaleFactor;

      // Center the image inside margins
      const x = margin + (availableWidth - drawWidth) / 2;
      const y = margin + (availableHeight - drawHeight) / 2;

      const page = pdfDoc.addPage([baseWidth, baseHeight]);
      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  return await pdfDoc.save();
}
