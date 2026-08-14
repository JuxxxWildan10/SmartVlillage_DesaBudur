"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileText, MessageSquare, Heart, Users, Search,
  ArrowRight, Sparkles, Shield, Lock, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const layananList = [
  {
    id: "esurat",
    icon: FileText,
    title: "e-Surat",
    description: "Ajukan surat keterangan secara online. Proses, lacak, dan unduh dokumen PDF resmi dari rumah.",
    href: "/layanan/surat",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accentColor: "border-t-blue-500",
    hoverBg: "hover:border-blue-200",
    badge: "Online 24 Jam",
    badgeColor: "bg-blue-100 text-blue-700",
    requiresAuth: true,
    category: "auth",
  },
  {
    id: "pengaduan",
    icon: MessageSquare,
    title: "Pengaduan & Aspirasi",
    description: "Sampaikan keluhan atau aspirasi Anda langsung ke pemerintah desa dengan mudah.",
    href: "/pengaduan",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    accentColor: "border-t-orange-500",
    hoverBg: "hover:border-orange-200",
    badge: "Respon Cepat",
    badgeColor: "bg-orange-100 text-orange-700",
    requiresAuth: true,
    category: "auth",
  },
  {
    id: "bansos",
    icon: Heart,
    title: "Cek Status Bansos",
    description: "Cek apakah KK Anda terdaftar sebagai penerima bantuan sosial (PKH, BLT, BPNT).",
    href: "/bansos",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentColor: "border-t-rose-500",
    hoverBg: "hover:border-rose-200",
    badge: "Tanpa Login",
    badgeColor: "bg-rose-100 text-rose-700",
    requiresAuth: false,
    category: "public",
  },
  {
    id: "forum",
    icon: Users,
    title: "Forum Warga",
    description: "Diskusikan isu desa, ajukan pertanyaan, atau berbagi informasi bersama warga Budur.",
    href: "/forum",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    accentColor: "border-t-purple-500",
    hoverBg: "hover:border-purple-200",
    badge: "Diskusi Terbuka",
    badgeColor: "bg-purple-100 text-purple-700",
    requiresAuth: false,
    category: "public",
  },
  {
    id: "lacak",
    icon: Search,
    title: "Lacak Surat",
    description: "Lacak status pengajuan surat Anda kapan saja menggunakan kode tracking.",
    href: "/layanan/surat",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    accentColor: "border-t-teal-500",
    hoverBg: "hover:border-teal-200",
    badge: "Realtime",
    badgeColor: "bg-teal-100 text-teal-700",
    requiresAuth: false,
    category: "public",
  },
  {
    id: "sdgs",
    icon: Sparkles,
    title: "SDGs Desa",
    description: "Pantau capaian 17 Tujuan Pembangunan Berkelanjutan (SDGs) di Desa Budur.",
    href: "/sdgs",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "border-t-emerald-500",
    hoverBg: "hover:border-emerald-200",
    badge: "Transparansi",
    badgeColor: "bg-emerald-100 text-emerald-700",
    requiresAuth: false,
    category: "public",
  },
];

type FilterType = "all" | "public" | "auth";

const filters: { label: string; value: FilterType; icon: React.ReactNode; count: number }[] = [
  { label: "Semua Layanan", value: "all", icon: <Globe size={14} />, count: layananList.length },
  { label: "Tanpa Login", value: "public", icon: <Globe size={14} />, count: layananList.filter(l => !l.requiresAuth).length },
  { label: "Perlu Login", value: "auth", icon: <Lock size={14} />, count: layananList.filter(l => l.requiresAuth).length },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LayananPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loginTooltip, setLoginTooltip] = useState<string | null>(null);

  const filtered = layananList.filter(item =>
    activeFilter === "all" ? true : item.category === activeFilter
  );

  const handleLayanan = (item: typeof layananList[0]) => {
    if (item.requiresAuth) {
      const role = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
      if (!role) {
        setLoginTooltip(item.id);
        setTimeout(() => setLoginTooltip(null), 2500);
        return;
      }
    }
    router.push(item.href);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
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
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeFilter === f.value
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {f.icon}
              {f.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeFilter === f.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((item) => {
              const Icon = item.icon;
              const showTooltip = loginTooltip === item.id;
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <div
                    onClick={() => handleLayanan(item)}
                    className={`group relative bg-white rounded-3xl shadow-sm border border-gray-100 border-t-4 ${item.accentColor} ${item.hoverBg} p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    {/* Auth tooltip */}
                    <AnimatePresence>
                      {showTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-xs px-4 py-2 rounded-xl shadow-lg z-10 whitespace-nowrap font-medium"
                        >
                          🔒 Login terlebih dahulu untuk mengakses layanan ini
                          <Link href="/auth/login" onClick={e => e.stopPropagation()} className="ml-2 text-gold-light underline">
                            Login
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-14 h-14 ${item.iconBg} ${item.iconColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
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

                    <div className={`flex items-center gap-2 ${item.iconColor} font-bold text-sm group-hover:gap-3 transition-all`}>
                      Akses Layanan <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
