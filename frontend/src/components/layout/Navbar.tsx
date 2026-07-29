"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";

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
    // Check Auth Status
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuth(true);
      setUserRole(localStorage.getItem("user_role") || "Warga");
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      router.push("/auth/admin-login");
    }
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  // Use solid dark background if scrolled OR if we are not on the homepage
  const navBg = (scrolled || !isHome) 
    ? "bg-primary/95 backdrop-blur-md shadow-md py-3" 
    : "bg-transparent py-5";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        
        {/* Logo */}
        <div onClick={handleLogoClick} className="cursor-pointer flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-full flex-center p-1 overflow-hidden shadow-lg shadow-black/20 group-hover:rotate-12 transition-all">
            <Leaf className="text-primary w-full h-full" />
          </div>
          <div>
            <h1 className={`font-heading font-bold text-lg leading-tight ${scrolled ? 'text-white' : 'text-white drop-shadow-md'}`}>
              Desa Budur
            </h1>
            <p className={`text-xs ${scrolled ? 'text-gold-light' : 'text-gold-light drop-shadow-md'}`}>Kabupaten Cirebon</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLinks scrolled={scrolled} />
          
          {isAuth ? (
            <Link href={userRole === 'Super Admin' ? '/admin' : '/warga'} className="bg-gold hover:bg-gold-light text-primary-dark font-bold px-6 py-2.5 rounded-full transition-all shadow-md flex items-center gap-2">
              <User size={18} /> Dashboard {userRole === 'Super Admin' ? 'Admin' : 'Warga'}
            </Link>
          ) : (
            <Link href="/auth/login" className="bg-gold hover:bg-gold-light text-primary-dark font-bold px-6 py-2.5 rounded-full transition-all shadow-md flex items-center gap-2">
              <User size={18} /> Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-primary shadow-xl border-t border-white/10">
          <div className="flex flex-col p-4">
            <NavLinks scrolled={true} mobile closeMenu={() => setMobileMenuOpen(false)} />
            {isAuth ? (
              <Link href={userRole === 'Super Admin' ? '/admin' : '/warga'} onClick={() => setMobileMenuOpen(false)} className="mt-4 bg-gold text-primary-dark font-bold px-6 py-3 rounded-xl text-center flex-center gap-2">
                <User size={18} /> Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="mt-4 bg-gold text-primary-dark font-bold px-6 py-3 rounded-xl text-center flex-center gap-2">
                <User size={18} /> Masuk Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ scrolled, mobile = false, closeMenu }: { scrolled: boolean, mobile?: boolean, closeMenu?: () => void }) {
  const groups = [
    { 
      name: "Profil", 
      items: [
        { name: "Profil Desa", href: "/profil" },
        { name: "Peta Geografis", href: "/gis" },
        { name: "Statistik Kependudukan", href: "/statistik" },
        { name: "Transparansi APBDes", href: "/transparansi" },
        { name: "Potensi Wisata", href: "/potensi" },
        { name: "SDGs Desa", href: "/sdgs" },
      ]
    },
    { 
      name: "Layanan Warga", 
      items: [
        { name: "e-Surat", href: "/layanan/surat" },
        { name: "Pengaduan", href: "/pengaduan" },
        { name: "Forum Warga", href: "/forum" },
      ]
    },
    { 
      name: "Informasi", 
      items: [
        { name: "Artikel Edukasi", href: "/artikel" },
        { name: "Jadwal Posyandu", href: "/posyandu" },
        { name: "Bansos", href: "/bansos" },
        { name: "UMKM & BUMDes", href: "/umkm" },
      ]
    }
  ];

  const textColor = scrolled || mobile ? 'text-white' : 'text-white drop-shadow-md';

  if (mobile) {
    return (
      <>
        <Link href="/" onClick={closeMenu} className={`block py-3 border-b border-white/10 font-medium ${textColor}`}>Beranda</Link>
        {groups.map((group) => (
          <div key={group.name} className="py-2 border-b border-white/10">
            <div className={`font-bold text-gold-light mb-2`}>{group.name}</div>
            <div className="pl-4 space-y-2">
              {group.items.map(item => (
                <Link key={item.name} href={item.href} onClick={closeMenu} className="block text-white hover:text-gold-light transition-colors text-sm">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <Link href="/" className={`font-medium transition-colors hover:text-gold-light ${textColor}`}>
        Beranda
      </Link>

      <Link href="/umkm" className={`font-medium transition-colors hover:text-gold-light ${textColor}`}>
        Beli Produk Desa
      </Link>
      
      {groups.map((group) => (
        <div key={group.name} className="relative group">
          <button className={`font-medium transition-colors hover:text-gold-light flex items-center gap-1 ${textColor}`}>
            {group.name}
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
            <div className="py-2">
              {group.items.map(item => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
