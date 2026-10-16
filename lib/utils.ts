import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function isImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  return (
    validTypes.includes(file.type) ||
    /\.(jpe?g|png|webp)$/i.test(file.name)
  );
}

/**
 * Validates whether an ArrayBuffer has the '%PDF-' magic bytes header.
 */
export function isValidPdfHeader(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 5) return false;
  const headerBytes = new Uint8Array(buffer.slice(0, 5));
  const header = String.fromCharCode(...headerBytes);
  return header === "%PDF-";
}
