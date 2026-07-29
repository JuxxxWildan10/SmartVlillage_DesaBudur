import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, MessageSquare, Users, Store, Gift, Megaphone, LogOut, Home } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Beranda Publik", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Data Keluarga", icon: Users, href: "/admin/keluarga" },
    { name: "Penduduk", icon: Users, href: "/admin/penduduk" },
    { name: "Kelola Surat", icon: FileText, href: "/admin/surat" },
    { name: "Pengaduan", icon: MessageSquare, href: "/admin/pengaduan" },
    { name: "UMKM", icon: Store, href: "/admin/umkm" },
    { name: "Bansos", icon: Gift, href: "/admin/bansos" },
    { name: "Berita", icon: Megaphone, href: "/admin/berita" },
  ];

  return (
    <aside className="w-64 bg-primary-dark text-white h-full flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-heading font-bold text-2xl text-gold-light">Desa Budur</h2>
        <p className="text-xs text-gray-300 mt-1">Admin Panel v1.0</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-white shadow-md font-bold" 
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => {
            localStorage.removeItem("auth_token");
            window.location.href = "/auth/login";
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
