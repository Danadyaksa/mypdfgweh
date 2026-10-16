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
  title: "mypdfgweh",
  description:
    "Solusi pengolahan file PDF cepat, mudah, dan aman langsung di browser Anda. Gabungkan, pisahkan, atur, putar, konversi, dan kompres PDF dengan praktis.",
  icons: {
    icon: "/mypdfgwehlogo.png",
    shortcut: "/mypdfgwehlogo.png",
    apple: "/mypdfgwehlogo.png",
  },
  keywords: [
    "PDF",
    "gabungkan pdf",
    "pisahkan pdf",
    "kompres pdf",
    "putar pdf",
    "gambar ke pdf",
    "pdf ke gambar",
    "watermark pdf",
    "MyPDFGweh",
  ],
  authors: [{ name: "Atilla Danadyaksa" }],
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
