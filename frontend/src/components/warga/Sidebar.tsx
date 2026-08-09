import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, MessageSquare, Home, LogOut } from "lucide-react";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Dashboard Warga", icon: LayoutDashboard, href: "/warga" },
    { name: "Riwayat e-Surat", icon: FileText, href: "/warga/surat" },
    { name: "Riwayat Pengaduan", icon: MessageSquare, href: "/warga/pengaduan" },
    { name: "Kembali ke Beranda", icon: Home, href: "/" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_nik");
    onClose?.();
    window.location.href = "/auth/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-heading font-bold text-2xl text-primary">Desa Budur</h2>
        <p className="text-xs text-gray-500 mt-1">Layanan Warga Pintar</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary-50 text-primary font-bold shadow-sm border border-primary/20" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-primary" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
