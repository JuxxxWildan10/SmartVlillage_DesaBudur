"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PanicButton from "../shared/PanicButton";
import BackToTop from "../shared/BackToTop";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isWarga = pathname?.startsWith("/warga");
  const isKepalaDesa = pathname?.startsWith("/kepaladesa");

  if (isAdmin || isWarga || isKepalaDesa) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <PanicButton />
      <BackToTop />
    </>
  );
}
