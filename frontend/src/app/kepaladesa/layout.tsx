"use client";

import Sidebar from "@/components/kepaladesa/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Menu } from "lucide-react";

export default function KepalaDesaLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("Kepala Desa");
  const [userRole, setUserRole] = useState("Kepala Desa");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Basic Auth Check for Kepala Desa
    const role = localStorage.getItem("user_role");
    if (!role || role !== "Kepala Desa") {
      router.push("/auth/login?redirect=/kepaladesa");
    } else {
      setIsAuth(true);
      setUserName(localStorage.getItem("user_name") || "Kepala Desa");
      setUserRole(role);
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Buka Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-bold text-gray-800 text-base md:text-xl font-heading">
              <span className="hidden sm:inline">Kepala Desa Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">{userName}</p>
              <p className="text-xs text-primary">{userRole}</p>
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
