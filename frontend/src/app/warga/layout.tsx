"use client";

import Sidebar from "@/components/warga/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WargaLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role");
    
    if (!token || role !== "Warga") {
      router.push("/auth/login?redirect=/warga");
    } else {
      setIsAuth(true);
      setUserName(localStorage.getItem("user_name") || "Warga");
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <h1 className="font-bold text-gray-800 text-xl font-heading">Portal Layanan Mandiri</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">{userName}</p>
              <p className="text-xs text-primary">Warga Desa</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
