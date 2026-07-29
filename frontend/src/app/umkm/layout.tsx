import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog UMKM & BUMDes - Desa Budur",
  description: "Dukung ekonomi lokal Desa Budur. Beli produk UMKM dan layanan BUMDes unggulan secara langsung dari warga.",
};

export default function UmkmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
