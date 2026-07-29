"use client";

import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Basic Auth Check for Admin
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/login?redirect=/admin");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <h1 className="font-bold text-gray-800 text-xl font-heading">Sistem Informasi Manajemen Desa</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">Admin Desa</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
