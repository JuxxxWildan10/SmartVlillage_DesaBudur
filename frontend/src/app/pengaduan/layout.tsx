import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan Pengaduan Warga - Desa Budur",
  description: "Sampaikan laporan, keluhan, maupun aspirasi Anda kepada Pemerintah Desa Budur. Identitas Anda dijamin kerahasiaannya.",
};

export default function PengaduanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
