import JSZip from "jszip";

export async function packagePdfsToZip(
  files: { filename: string; pdfBytes: Uint8Array }[],
  zipFilename: string = "dokumen-terpisah.zip"
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.filename, file.pdfBytes);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    blob: zipBlob,
    filename: zipFilename.endsWith(".zip") ? zipFilename : `${zipFilename}.zip`,
  };
}
