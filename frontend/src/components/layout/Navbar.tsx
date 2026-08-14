"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role) {
      setIsAuth(true);
      setUserRole(role);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      router.push("/auth/admin-login");
    }
    setTimeout(() => setClickCount(0), 2000);
  };

  const navBg = (scrolled || !isHome)
    ? "bg-primary/97 backdrop-blur-md shadow-lg shadow-black/20 py-3"
    : "bg-transparent py-5";

  const getDashboardHref = () => {
    if (userRole === "Kepala Desa") return "/kepaladesa";
    if (["Admin", "Super Admin", "Perangkat Desa", "Staff"].includes(userRole)) return "/admin";
    return "/warga";
  };

  const getDashboardLabel = () => {
    if (userRole === "Kepala Desa") return "Kepala Desa";
    if (["Admin", "Super Admin", "Perangkat Desa", "Staff"].includes(userRole)) return "Admin";
    return "Warga";
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">

        {/* Logo */}
        <div onClick={handleLogoClick} className="cursor-pointer flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white flex items-center justify-center p-1 overflow-hidden shadow-lg shadow-black/20 group-hover:rotate-12 transition-all duration-300 rounded-md">
            <img src="/logo-cirebon.png" alt="Logo Cirebon" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-tight text-white drop-shadow-sm">
              Desa Budur
            </h1>
            <p className="text-xs text-gold-light drop-shadow-sm">Kabupaten Cirebon</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLinks currentPath={pathname} />

          {isAuth ? (
            <Link
              href={getDashboardHref()}
              className="bg-gold hover:bg-gold-light text-primary-dark font-bold px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-gold/40 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <User size={16} /> Dashboard {getDashboardLabel()}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gold hover:bg-gold-light text-primary-dark font-bold px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-gold/40 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <User size={16} /> Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu — Animated Slide Down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-primary-dark border-t border-white/10"
          >
            <div className="flex flex-col p-4 max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar pb-6">
              <NavLinksMobile currentPath={pathname} closeMenu={() => setMobileMenuOpen(false)} />
              {isAuth ? (
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 bg-gold text-primary-dark font-bold px-6 py-3 rounded-xl text-center flex items-center justify-center gap-2"
                >
                  <User size={18} /> Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 bg-gold text-primary-dark font-bold px-6 py-3 rounded-xl text-center flex items-center justify-center gap-2"
                >
                  <User size={18} /> Masuk Akun
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Nav Groups Data ──────────────────────────────────────────────────────────
const navGroups = [
  {
    name: "Profil",
    items: [
      { name: "Profil Desa", href: "/profil" },
      { name: "Peta Geografis", href: "/gis" },
      { name: "Statistik Kependudukan", href: "/statistik" },
      { name: "Transparansi APBDes", href: "/transparansi", desc: "Anggaran Pendapatan & Belanja" },
      { name: "Potensi Wisata", href: "/potensi" },
      { name: "SDGs Desa", href: "/sdgs", desc: "Tujuan Pembangunan Berkelanjutan" },
    ],
  },
  {
    name: "Layanan Warga",
    items: [
      { name: "e-Surat", href: "/layanan/surat" },
      { name: "Pengaduan", href: "/pengaduan" },
      { name: "Forum Warga", href: "/forum" },
    ],
  },
  {
    name: "Informasi",
    items: [
      { name: "Artikel Edukasi", href: "/artikel" },
      { name: "Jadwal Posyandu", href: "/posyandu" },
      { name: "Bansos", href: "/bansos" },
      { name: "UMKM & BUMDes", href: "/umkm" },
    ],
  },
];

// ─── Desktop NavLinks ─────────────────────────────────────────────────────────
function NavLinks({ currentPath }: { currentPath: string }) {
  const isActive = (items: { href: string }[]) =>
    items.some(i => currentPath.startsWith(i.href));
  const isHomePage = currentPath === "/";

  return (
    <>
      <Link
        href="/"
        className={`relative font-medium transition-colors hover:text-gold-light text-white text-sm ${
          isHomePage ? "text-gold-light" : ""
        }`}
      >
        Beranda
        {isHomePage && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-light rounded-full" />
        )}
      </Link>

      <Link
        href="/umkm"
        className={`relative font-medium transition-colors hover:text-gold-light text-white text-sm ${
          currentPath.startsWith("/umkm") ? "text-gold-light" : ""
        }`}
      >
        Beli Produk Desa
        {currentPath.startsWith("/umkm") && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-light rounded-full" />
        )}
      </Link>

      {navGroups.map((group) => (
        <DropdownGroup
          key={group.name}
          group={group}
          isActive={isActive(group.items)}
          currentPath={currentPath}
        />
      ))}
    </>
  );
}

// ─── Desktop Dropdown Group ───────────────────────────────────────────────────
function DropdownGroup({
  group, isActive, currentPath,
}: {
  group: typeof navGroups[0];
  isActive: boolean;
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className={`relative font-medium transition-colors hover:text-gold-light flex items-center gap-1 text-sm ${
          isActive ? "text-gold-light" : "text-white"
        }`}
      >
        {group.name}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-light rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="py-2">
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                    currentPath.startsWith(item.href)
                      ? "bg-primary/5 text-primary font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  {currentPath.startsWith(item.href) && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.desc && <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile NavLinks ──────────────────────────────────────────────────────────
function NavLinksMobile({ currentPath, closeMenu }: { currentPath: string; closeMenu: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <>
      <Link
        href="/"
        onClick={closeMenu}
        className={`block py-3 border-b border-white/10 font-medium text-white ${
          currentPath === "/" ? "text-gold-light font-bold" : ""
        }`}
      >
        Beranda
      </Link>
      <Link
        href="/umkm"
        onClick={closeMenu}
        className={`block py-3 border-b border-white/10 font-medium text-white ${
          currentPath.startsWith("/umkm") ? "text-gold-light font-bold" : ""
        }`}
      >
        Beli Produk Desa
      </Link>
      {navGroups.map((group) => (
        <div key={group.name} className="border-b border-white/10">
          <button
            className="w-full flex items-center justify-between py-3 font-bold text-gold-light text-left"
            onClick={() => setOpenGroup(openGroup === group.name ? null : group.name)}
          >
            {group.name}
            <ChevronDown
              size={16}
              className={`transition-transform ${openGroup === group.name ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openGroup === group.name && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4 pb-2"
              >
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={`block py-2 text-sm transition-colors ${
                        currentPath.startsWith(item.href)
                          ? "text-gold-light font-semibold"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {currentPath.startsWith(item.href) ? "→ " : ""}{item.name}
                      {item.desc && <span className="block text-[10px] text-white/50 mt-0.5">{item.desc}</span>}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
