"use client";

import Sidebar from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import toast from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("Admin Desa");
  const [userRole, setUserRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (!role || (role !== "Admin" && role !== "Super Admin" && role !== "Perangkat Desa" && role !== "Staff")) {
      router.push("/auth/login?redirect=/admin");
    } else {
      setIsAuth(true);
      setUserRole(role);
      const name = localStorage.getItem("user_name");
      if (name) setUserName(name);

      // Setup Pusher for Realtime Notifications
      if (typeof window !== "undefined" && !window.Echo) {
        window.Pusher = Pusher;
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'dummy_key',
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1',
          wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST ? process.env.NEXT_PUBLIC_PUSHER_HOST : `ws-${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}.pusher.com`,
          wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT ? Number(process.env.NEXT_PUBLIC_PUSHER_PORT) : 80,
          wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT ? Number(process.env.NEXT_PUBLIC_PUSHER_PORT) : 443,
          forceTLS: (process.env.NEXT_PUBLIC_PUSHER_SCHEME ?? 'https') === 'https',
          enabledTransports: ['ws', 'wss'],
        });

        // Listen for Surat
        window.Echo.channel('surat-channel')
          .listen('.status-updated', (e: any) => {
            toast.success(`Surat warga diperbarui: ${e.surat.jenis_surat}`);
          });

        // Listen for Pengaduan
        window.Echo.channel('pengaduan-channel')
          .listen('.status-updated', (e: any) => {
            toast.success(`Pengaduan diperbarui: ${e.pengaduan.judul}`);
          });
      }
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — di mobile jadi drawer, di desktop tetap */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Hamburger — hanya di mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Buka Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-bold text-gray-800 text-base md:text-xl font-heading">
              <span className="hidden sm:inline">Sistem Informasi Manajemen Desa</span>
              <span className="sm:hidden">Admin Panel</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm text-gray-900">{userName}</p>
              <p className="text-xs text-green-600">{userRole}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

