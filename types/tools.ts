export type ToolCategory =
  | "all"
  | "organize"
  | "optimize"
  | "convert"
  | "edit";

export interface ToolItem {
  id: string;
  name: string;
  shortDesc: string;
  category: ToolCategory;
  categoryLabel: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: string;
  isPopular?: boolean;
}

export const TOOLS_CONFIG: ToolItem[] = [
  {
    id: "merge",
    name: "Gabungkan PDF",
    shortDesc: "Satukan beberapa file PDF menjadi satu dokumen berurutan dengan mudah.",
    category: "organize",
    categoryLabel: "Atur PDF",
    href: "/merge",
    icon: "Layers",
    isPopular: true,
  },
  {
    id: "split",
    name: "Pisahkan PDF",
    shortDesc: "Ekstrak rentang halaman tertentu atau pisahkan setiap halaman menjadi file mandiri.",
    category: "organize",
    categoryLabel: "Atur PDF",
    href: "/split",
    icon: "Scissors",
    isPopular: true,
  },
  {
    id: "organize",
    name: "Atur Halaman PDF",
    shortDesc: "Susun ulang halaman, putar orientasi per halaman, atau hapus halaman yang tidak diperlukan.",
    category: "organize",
    categoryLabel: "Atur PDF",
    href: "/organize",
    icon: "LayoutGrid",
  },
  {
    id: "rotate",
    name: "Putar PDF",
    shortDesc: "Putar seluruh atau halaman PDF terpilih dalam kelipatan 90°, 180°, atau 270°.",
    category: "edit",
    categoryLabel: "Edit PDF",
    href: "/rotate",
    icon: "RotateCw",
  },
  {
    id: "jpg-to-pdf",
    name: "Gambar ke PDF",
    shortDesc: "Ubah foto JPG atau PNG menjadi dokumen PDF dengan tata letak A4, Letter, atau Fit.",
    category: "convert",
    categoryLabel: "Konversi PDF",
    href: "/jpg-to-pdf",
    icon: "Image",
    isPopular: true,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF ke Gambar",
    shortDesc: "Render halaman PDF menjadi gambar berkualitas tinggi (JPG / PNG) dan unduh satuan atau ZIP.",
    category: "convert",
    categoryLabel: "Konversi PDF",
    href: "/pdf-to-jpg",
    icon: "FileImage",
  },
  {
    id: "watermark",
    name: "Tambah Tanda Air",
    shortDesc: "Sisipkan teks watermark dengan kendali penuh atas ukuran, opasitas, rotasi, dan posisi.",
    category: "edit",
    categoryLabel: "Edit PDF",
    href: "/watermark",
    icon: "Stamp",
  },
  {
    id: "page-numbers",
    name: "Nomor Halaman",
    shortDesc: "Beri nomor halaman otomatis pada header atau footer dokumen sesuai ukuran asli.",
    category: "edit",
    categoryLabel: "Edit PDF",
    href: "/page-numbers",
    icon: "FileDigit",
  },
  {
    id: "compress",
    name: "Kompres PDF",
    shortDesc: "Optimalkan ukuran file PDF secara transparan dengan pelaporan byte sebelum dan sesudah yang jujur.",
    category: "optimize",
    categoryLabel: "Optimalkan PDF",
    href: "/compress",
    icon: "Minimize2",
    isPopular: true,
  },
];
