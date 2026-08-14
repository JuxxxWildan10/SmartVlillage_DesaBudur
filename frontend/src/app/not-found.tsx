"use client";

import Link from "next/link";
import { Home, ArrowLeft, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary/5 px-4 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold/8 rounded-full blur-3xl -z-10" />

      {/* Floating dots decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full -z-10"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="text-center max-w-lg mx-auto">

        {/* Animated 404 Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="relative mb-8 inline-block"
        >
          {/* SVG Illustration — person lost in village */}
          <svg viewBox="0 0 280 200" className="w-72 h-52 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <rect x="0" y="170" width="280" height="30" rx="4" fill="#f0fdf4" />
            {/* Path/road */}
            <rect x="115" y="150" width="50" height="20" rx="2" fill="#d1fae5" />
            
            {/* House 1 (left) */}
            <rect x="20" y="120" width="60" height="50" rx="4" fill="#bbf7d0" />
            <polygon points="20,120 80,120 50,85" fill="#16a34a" />
            <rect x="37" y="140" width="16" height="30" rx="2" fill="#6b7280" />
            <rect x="53" y="130" width="16" height="14" rx="2" fill="#93c5fd" />
            {/* Tree left */}
            <rect x="94" y="148" width="6" height="22" rx="2" fill="#92400e" />
            <ellipse cx="97" cy="140" rx="14" ry="16" fill="#4ade80" />
            
            {/* House 2 (right) */}
            <rect x="200" y="110" width="60" height="60" rx="4" fill="#dbeafe" />
            <polygon points="198,112 262,112 230,72" fill="#1d4ed8" />
            <rect x="218" y="135" width="16" height="35" rx="2" fill="#6b7280" />
            <rect x="236" y="122" width="16" height="14" rx="2" fill="#fde68a" />
            {/* Tree right */}
            <rect x="178" y="148" width="6" height="22" rx="2" fill="#92400e" />
            <ellipse cx="181" cy="138" rx="16" ry="18" fill="#22c55e" />

            {/* Person (confused, looking at map) */}
            {/* Body */}
            <rect x="128" y="130" width="22" height="30" rx="4" fill="#1B5E20" />
            {/* Head */}
            <circle cx="139" cy="122" r="12" fill="#fbbf24" />
            {/* Hair */}
            <path d="M127,118 Q139,108 151,118" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="135" cy="121" r="1.5" fill="#1f2937" />
            <circle cx="143" cy="121" r="1.5" fill="#1f2937" />
            {/* Mouth — confused */}
            <path d="M135,127 Q139,124 143,127" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            {/* Question marks */}
            <text x="155" y="115" fontSize="14" fill="#D4AF37" fontWeight="bold">?</text>
            <text x="115" y="108" fontSize="10" fill="#D4AF37" fontWeight="bold">?</text>
            {/* Map/paper in hand */}
            <rect x="148" y="135" width="18" height="14" rx="2" fill="#fef9c3" transform="rotate(-15, 148, 135)" />
            <line x1="151" y1="138" x2="162" y2="138" stroke="#6b7280" strokeWidth="1" />
            <line x1="151" y1="142" x2="160" y2="142" stroke="#6b7280" strokeWidth="1" />
          </svg>

          {/* 404 number overlay */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-2"
          >
            <span className="text-5xl font-black text-primary font-heading">404</span>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-heading mb-3 leading-tight">
            Waduh! Sepertinya Anda <br className="hidden sm:block" />
            nyasar dari balai desa 🗺️
          </h1>
          <p className="text-gray-500 mb-8 text-base max-w-sm mx-auto leading-relaxed">
            Halaman yang Anda cari di portal Smart Village Desa Budur mungkin telah dipindahkan atau tidak ada.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-gray-700 font-bold border-2 border-gray-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} /> Beranda Desa
          </Link>
        </motion.div>

        {/* Suggestion links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-gray-400 mb-3 font-medium">Mungkin Anda mencari:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/layanan", label: "Layanan Publik" },
              { href: "/pengaduan", label: "Pengaduan" },
              { href: "/berita", label: "Berita Desa" },
              { href: "/profil", label: "Profil Desa" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
