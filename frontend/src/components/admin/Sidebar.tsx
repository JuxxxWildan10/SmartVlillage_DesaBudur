import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, MessageSquare, Users, Store, Gift,
  Megaphone, LogOut, Home, HeartPulse, Target, UserCog, TrendingUp, ScrollText, ChevronDown, ChevronRight, Building, BookOpen, Calendar
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  name: string;
  icon: any;
  href?: string;
  children?: { name: string; href: string; icon: any }[];
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

  const baseMenu: MenuItem[] = [
    { name: "Beranda Publik", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Data Keluarga", icon: Users, href: "/admin/keluarga" },
    { name: "Penduduk", icon: Users, href: "/admin/penduduk" },
    { name: "Kelola Surat", icon: FileText, href: "/admin/surat" },
    { name: "Pengaduan", icon: MessageSquare, href: "/admin/pengaduan" },
    { name: "UMKM", icon: Store, href: "/admin/umkm" },
    { name: "Bansos", icon: Gift, href: "/admin/bansos" },
    { name: "Berita & Acara", icon: Calendar, href: "/admin/berita" },
    { name: "Artikel", icon: BookOpen, href: "/admin/artikel" },
    { name: "Posyandu", icon: HeartPulse, href: "/admin/posyandu" },
    {
      name: "Pemerintahan",
      icon: UserCog,
      children: [
        { name: "Aparatur Desa", href: "/admin/aparatur", icon: UserCog },
        { name: "APBDes", href: "/admin/apbdes", icon: TrendingUp },
        { name: "Master Surat", href: "/admin/jenis-surat", icon: ScrollText },
        { name: "Regulasi & Dokumen", href: "/admin/dokumen", icon: FileText },
        { name: "Proyek Pembangunan", href: "/admin/pembangunan", icon: Building },
      ],
    },
    { name: "SDGs", icon: Target, href: "/admin/sdgs" },
  ];

  let menu = baseMenu;
  if (userRole === "Kepala Desa") {
    menu = baseMenu.filter(item => ["Beranda Publik", "Dashboard", "UMKM", "Pemerintahan", "SDGs"].includes(item.name));
    // Filter out aparatur and master surat for Kepala Desa
    menu = menu.map(item => {
      if (item.name === "Pemerintahan" && item.children) {
        return { ...item, children: item.children.filter(child => child.name === "APBDes" || child.name === "Proyek Pembangunan") };
      }
      return item;
    });
  } else if (userRole === "Staff" || userRole === "Perangkat Desa") {
    menu = baseMenu.filter(item => ["Beranda Publik", "Dashboard", "Kelola Surat", "Pengaduan"].includes(item.name));
  }

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: MenuItem) => item.children?.some(c => pathname === c.href) ?? false;

  const toggleGroup = (name: string) => {
    setExpandedGroup(prev => prev === name ? null : name);
  };

  return (
    <aside className="w-64 bg-primary-dark text-white h-full flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center p-1 overflow-hidden shadow-sm rounded-md border border-gray-100 shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Coat_of_arms_of_Cirebon_Regency.svg" alt="Logo Cirebon" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-gold-light">Desa Budur</h2>
          <p className="text-xs text-gray-300 mt-0.5">Admin Panel v2.0</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menu.map((item) => {
          if (item.children) {
            const open = expandedGroup === item.name || isGroupActive(item);
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    isGroupActive(item) ? "bg-primary/30 text-white font-bold" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="flex-1">{item.name}</span>
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {open && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                          isActive(child.href)
                            ? "bg-primary text-white shadow-md font-bold"
                            : "text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <child.icon size={16} />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.href!)
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
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_nik");
            localStorage.removeItem("user_role");
            onClose?.();
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
