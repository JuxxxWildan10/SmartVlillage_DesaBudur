import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Pengumuman - Desa Budur",
  description: "Kumpulan berita terbaru, informasi penting, dan pengumuman resmi dari Pemerintah Desa Budur.",
};

export default function BeritaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
