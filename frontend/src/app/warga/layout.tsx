"use client";

import Sidebar from "@/components/warga/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import toast from "react-hot-toast";

export default function WargaLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    
    if (!role || role !== "Warga") {
      router.push("/auth/login?redirect=/warga");
    } else {
      setIsAuth(true);
      setUserName(localStorage.getItem("user_name") || "Warga");

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
            toast.success(`Surat Anda diperbarui: ${e.surat.jenis_surat}`);
          });

        // Listen for Pengaduan
        window.Echo.channel('pengaduan-channel')
          .listen('.status-updated', (e: any) => {
            toast.success(`Pengaduan Anda diperbarui: ${e.pengaduan.judul}`);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer di mobile, statis di desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 overflow-y-auto min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30 px-4 md:px-8 py-4 flex justify-between items-center">
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
              <span className="hidden sm:inline">Portal Layanan Mandiri</span>
              <span className="sm:hidden">Layanan Warga</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm text-gray-900">{userName}</p>
              <p className="text-xs text-primary">Warga Desa</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


