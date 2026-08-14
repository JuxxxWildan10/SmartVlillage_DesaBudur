import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Smart Village - Desa Budur",
  description: "Portal resmi pemerintahan Desa Budur, Kabupaten Cirebon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased text-gray-800">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
