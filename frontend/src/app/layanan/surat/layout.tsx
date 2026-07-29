import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan e-Surat Mandiri - Desa Budur",
  description: "Ajukan surat keterangan (SKU, SKTM, Domisili, dll) secara online dan lacak statusnya dengan mudah melalui Smart Village Desa Budur.",
};

export default function SuratLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
