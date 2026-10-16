import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MyPDFGweh | Solusi Pengolah PDF Pribadi Cepat & Aman di Browser",
  description:
    "Alternatif modern untuk iLovePDF yang 100% memproses file langsung di browser Anda. Gabungkan, pisahkan, atur, putar, konversi, dan kompres PDF tanpa risiko privasi.",
  keywords: [
    "PDF",
    "gabungkan pdf",
    "pisahkan pdf",
    "kompres pdf",
    "putar pdf",
    "gambar ke pdf",
    "pdf ke gambar",
    "watermark pdf",
    "client-side pdf",
    "MyPDFGweh",
  ],
  authors: [{ name: "MyPDFGweh Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FBFBF9] text-stone-900 antialiased selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
