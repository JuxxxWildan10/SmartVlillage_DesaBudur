"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, MessageSquare, Heart, Users, Search, ArrowRight, Sparkles, Shield } from "lucide-react";

const layananList = [
  {
    id: "esurat",
    icon: FileText,
    title: "e-Surat",
    description: "Ajukan surat keterangan secara online. Proses, lacak, dan unduh dokumen PDF resmi dari rumah.",
    href: "/layanan/surat",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
    badge: "Online 24 Jam",
    badgeColor: "bg-blue-100 text-blue-700",
    requiresAuth: true,
  },
  {
    id: "pengaduan",
    icon: MessageSquare,
    title: "Pengaduan & Aspirasi",
    description: "Sampaikan keluhan atau aspirasi Anda langsung ke pemerintah desa dengan mudah.",
    href: "/pengaduan",
    bg: "bg-orange-50",
    textColor: "text-orange-600",
    badge: "Respon Cepat",
    badgeColor: "bg-orange-100 text-orange-700",
    requiresAuth: true,
  },
  {
    id: "bansos",
    icon: Heart,
    title: "Cek Status Bansos",
    description: "Cek apakah KK Anda terdaftar sebagai penerima bantuan sosial (PKH, BLT, BPNT).",
    href: "/bansos",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
    badge: "Tanpa Login",
    badgeColor: "bg-rose-100 text-rose-700",
    requiresAuth: false,
  },
  {
    id: "forum",
    icon: Users,
    title: "Forum Warga",
    description: "Diskusikan isu desa, ajukan pertanyaan, atau berbagi informasi bersama warga Budur.",
    href: "/forum",
    bg: "bg-purple-50",
    textColor: "text-purple-600",
    badge: "Diskusi Terbuka",
    badgeColor: "bg-purple-100 text-purple-700",
    requiresAuth: false,
  },
  {
    id: "lacak",
    icon: Search,
    title: "Lacak Surat",
    description: "Lacak status pengajuan surat Anda kapan saja menggunakan kode tracking.",
    href: "/layanan/surat",
    bg: "bg-teal-50",
    textColor: "text-teal-600",
    badge: "Realtime",
    badgeColor: "bg-teal-100 text-teal-700",
    requiresAuth: false,
  },
  {
    id: "sdgs",
    icon: Sparkles,
    title: "SDGs Desa",
    description: "Pantau capaian 17 Tujuan Pembangunan Berkelanjutan (SDGs) di Desa Budur.",
    href: "/sdgs",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
    badge: "Transparansi",
    badgeColor: "bg-emerald-100 text-emerald-700",
    requiresAuth: false,
  },
];

export default function LayananPage() {
  const router = useRouter();

  const handleLayanan = (item: typeof layananList[0]) => {
    if (item.requiresAuth) {
      const role = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
      if (!role) {
        router.push(`/auth/login?redirect=${item.href}`);
        return;
      }
    }
    router.push(item.href);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} /> Layanan Digital Desa Budur
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">
            Semua Layanan<br />
            <span className="text-primary">dalam Satu Tempat</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Nikmati kemudahan layanan pemerintahan Desa Budur tanpa perlu antri. Cepat, mudah, dan transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {layananList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleLayanan(item)}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-7 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 ${item.bg} ${item.textColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors font-heading">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{item.description}</p>

                {item.requiresAuth && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Shield size={12} /> Membutuhkan login
                  </div>
                )}

                <div className={`flex items-center gap-2 ${item.textColor} font-bold text-sm group-hover:gap-3 transition-all`}>
                  Akses Layanan <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">Belum Punya Akun?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Daftarkan diri Anda untuk mengakses layanan e-Surat dan Pengaduan Online. Gratis dan mudah.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Daftar Sekarang
              </Link>
              <Link href="/auth/login" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-white/30">
                Sudah Punya Akun? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
