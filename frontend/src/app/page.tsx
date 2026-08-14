"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight, FileText, Activity, ShieldCheck, Users,
  Megaphone, Calendar, BookOpen, Phone, Clock, MapPin,
  ChevronDown, MessageSquare, AlertCircle
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  SkeletonBeritaCard,
  SkeletonArtikelCard,
} from "@/components/shared/SkeletonCard";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-gold mb-2 font-heading tabular-nums">
      {count.toLocaleString("id-ID")}
    </div>
  );
}

// ─── Scroll Indicator ─────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 text-xs z-10">
      <span className="font-medium tracking-wider text-[10px] uppercase">Scroll</span>
      <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5">
        <div style={{ animation: "scroll-indicator 1.5s ease-in-out infinite" }}
          className="w-1 h-2 bg-white/60 rounded-full" />
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  badge, badgeIcon, title, subtitle, badgeClass = "bg-primary/10 text-primary"
}: {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  badgeClass?: string;
}) {
  return (
    <div className="text-center mb-14">
      <div className={`inline-flex items-center gap-2 ${badgeClass} px-4 py-2 rounded-full text-sm font-bold mb-4`}>
        {badgeIcon} {badge}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">{title}</h2>
      {subtitle && <p className="text-gray-500 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [stats, setStats] = useState({
    total_penduduk: 0, total_kk: 0, target_sdgs: 0, total_umkm: 0
  });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [runningText, setRunningText] = useState("Memuat Info Desa...");
  const [latestBerita, setLatestBerita] = useState<any[]>([]);
  const [latestArtikel, setLatestArtikel] = useState<any[]>([]);
  const [beritaLoading, setBeritaLoading] = useState(true);
  const [artikelLoading, setArtikelLoading] = useState(true);
  const [beritaError, setBeritaError] = useState(false);
  const [artikelError, setArtikelError] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then(res => {
        if (res.data.status === "success") {
          setStats(res.data.data.statistics);
          setStatsLoaded(true);
        }
      })
      .catch(err => console.error("Error fetching stats", err));

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/running-text`)
      .then(res => { if (res.data.status === "success") setRunningText(res.data.data.text); })
      .catch(() => {});

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((b: any) => b.status === "Published");
          setLatestBerita(published.slice(0, 3));
        } else {
          setBeritaError(true);
        }
      })
      .catch(() => setBeritaError(true))
      .finally(() => setBeritaLoading(false));

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artikel`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((a: any) => a.status === "Published");
          setLatestArtikel(published.slice(0, 3));
        } else {
          setArtikelError(true);
        }
      })
      .catch(() => setArtikelError(true))
      .finally(() => setArtikelLoading(false));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen">

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/65 to-primary-dark/80 backdrop-blur-[2px]" />

        {/* Decorative Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block bg-black/40 backdrop-blur-md px-5 py-2 rounded-full mb-6 text-yellow-300 font-bold text-sm border border-yellow-300/30 shadow-lg"
            >
              ✨ Smart Village System Terintegrasi
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-heading"
            >
              Selamat Datang di <br />
              <span className="text-gold drop-shadow-lg">Desa Budur</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Portal layanan digital resmi Pemerintah Desa Budur, Kecamatan Ciwaringin.
              Melayani masyarakat dengan transparan, cepat, dan inovatif.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/layanan"
                className="group bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/40 hover:shadow-primary/60 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Layanan Publik
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sdgs"
                className="group bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 border border-white/20 shadow-lg hover:-translate-y-0.5"
              >
                Capaian SDGs (Pembangunan) Desa <Activity size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator />

        {/* Running Text / News Ticker */}
        <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-md border-t border-white/10 text-white overflow-hidden flex items-center">
          <div className="relative z-20 bg-primary-dark/95 text-gold font-bold px-4 md:px-8 py-3 shrink-0 flex items-center gap-2 shadow-[10px_0_20px_-5px_rgba(0,0,0,0.5)]">
            <Megaphone size={18} /> <span className="hidden md:inline">INFO DESA</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap animate-[ticker_25s_linear_infinite] inline-block font-medium pl-[100%] hover:[animation-play-state:paused] cursor-default py-3">
              {runningText}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Layanan Cepat Section ──────────────────────────────────── */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1B5E20 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <SectionHeader
            badge="Digital"
            badgeIcon={<Activity size={14} />}
            title={<>Layanan <span className="text-primary">Digital</span> Desa</>}
            subtitle="Akses berbagai layanan administrasi desa secara online tanpa harus antre di balai desa."
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <ServiceCard
                icon={<FileText size={32} className="text-blue-600" />}
                iconBg="bg-blue-50 group-hover:bg-blue-100"
                accentColor="border-t-blue-500"
                title="e-Surat"
                desc="Pengajuan Surat Keterangan Usaha, Domisili, dan lainnya secara online."
                href="/layanan/surat"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ServiceCard
                icon={<ShieldCheck size={32} className="text-primary" />}
                iconBg="bg-green-50 group-hover:bg-green-100"
                accentColor="border-t-primary"
                title="Pengaduan Warga"
                desc="Sampaikan aspirasi dan keluhan Anda langsung kepada Pemerintah Desa."
                href="/pengaduan"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ServiceCard
                icon={<Users size={32} className="text-amber-600" />}
                iconBg="bg-amber-50 group-hover:bg-amber-100"
                accentColor="border-t-amber-500"
                title="UMKM & BUMDes"
                desc="Eksplorasi produk lokal dan dukung pertumbuhan ekonomi desa."
                href="/umkm"
              />
            </motion.div>
          </motion.div>

          <div className="text-center mt-10">
            <Link href="/layanan"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm border border-primary/20 px-5 py-2.5 rounded-full hover:bg-primary/5"
            >
              Lihat Semua Layanan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Panduan Alur Layanan ───────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader
            badge="Panduan"
            badgeIcon={<BookOpen size={14} />}
            title="Cara Menggunakan Layanan Online"
            subtitle="Ikuti 4 langkah mudah ini untuk mengurus administrasi desa tanpa harus antre."
            badgeClass="bg-blue-100 text-blue-700"
          />

          <div className="relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-primary/20 to-blue-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Buat Akun</h4>
                <p className="text-sm text-gray-500">Daftar menggunakan NIK dan data diri Anda di portal web.</p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">2</div>
                <h4 className="font-bold text-gray-900 mb-2">Pilih Layanan</h4>
                <p className="text-sm text-gray-500">Pilih menu e-Surat atau Pengaduan sesuai dengan kebutuhan.</p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">3</div>
                <h4 className="font-bold text-gray-900 mb-2">Isi Formulir</h4>
                <p className="text-sm text-gray-500">Lengkapi formulir yang disediakan dengan informasi yang benar.</p>
              </div>
              
              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">4</div>
                <h4 className="font-bold text-gray-900 mb-2">Selesai</h4>
                <p className="text-sm text-gray-500">Tunggu proses verifikasi dan Anda akan menerima notifikasi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Statistik Section ──────────────────────────────────────── */}
      <section className="py-24 bg-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        {/* Top wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" className="fill-gray-50 w-full" preserveAspectRatio="none">
            <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 Z" />
          </svg>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 60" className="fill-white w-full" preserveAspectRatio="none">
            <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 Z" />
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">Data Resmi</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Desa Budur dalam Angka
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              {statsLoaded
                ? <AnimatedCounter target={stats.total_penduduk} />
                : <div className="skeleton h-12 w-24 mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
              }
              <div className="text-sm md:text-base text-gray-300 font-medium">Penduduk</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {statsLoaded
                ? <AnimatedCounter target={stats.total_kk} />
                : <div className="skeleton h-12 w-24 mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
              }
              <div className="text-sm md:text-base text-gray-300 font-medium">Kepala Keluarga</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {statsLoaded
                ? <AnimatedCounter target={stats.target_sdgs} />
                : <div className="skeleton h-12 w-24 mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
              }
              <div className="text-sm md:text-base text-gray-300 font-medium">Target SDGs</div>
              <p className="text-[10px] text-gray-400 mt-1 opacity-70">Program Pembangunan Berkelanjutan</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {statsLoaded
                ? <AnimatedCounter target={stats.total_umkm} />
                : <div className="skeleton h-12 w-24 mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
              }
              <div className="text-sm md:text-base text-gray-300 font-medium">UMKM Aktif</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Berita & Acara Desa ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold mb-3">
                <Calendar size={14} /> Jadwal & Acara
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">Berita & Acara Desa</h2>
            </div>
            <Link href="/berita" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {beritaError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-red-100">
              <AlertCircle size={32} className="mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-1">Gagal Memuat Berita</h3>
              <p className="text-sm opacity-80 max-w-md">Mohon maaf, sistem sedang mengalami kendala jaringan saat memuat berita dan acara desa. Silakan muat ulang halaman ini.</p>
            </div>
          ) : beritaLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <SkeletonBeritaCard key={i} />)}
            </div>
          ) : latestBerita.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">Belum ada jadwal acara yang dipublikasikan.</p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {latestBerita.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link href="/berita"
                    className="group block cursor-pointer bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{item.kategori}</span>
                      {item.tanggal_acara && new Date(item.tanggal_acara) >= new Date() && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">🟢 Akan Datang</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">{item.judul}</h3>
                    {item.tanggal_acara && (
                      <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium mb-1">
                        <Calendar size={13} />
                        {new Date(item.tanggal_acara).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}
                    {item.lokasi_acara && <p className="text-xs text-gray-500">📍 {item.lokasi_acara}</p>}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/berita" className="inline-flex items-center gap-2 text-primary font-bold text-sm">
              Lihat Semua Acara <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Artikel Edukasi ─────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold mb-3">
                <BookOpen size={14} /> Edukasi Warga
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">Artikel & Edukasi</h2>
            </div>
            <Link href="/artikel" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {artikelError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-red-100">
              <AlertCircle size={32} className="mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-1">Gagal Memuat Artikel</h3>
              <p className="text-sm opacity-80 max-w-md">Mohon maaf, sistem sedang mengalami kendala jaringan saat memuat artikel edukasi. Silakan muat ulang halaman ini.</p>
            </div>
          ) : artikelLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <SkeletonArtikelCard key={i} />)}
            </div>
          ) : latestArtikel.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {latestArtikel.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link href={`/artikel/${item.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-44 overflow-hidden bg-orange-50">
                      {item.gambar_url ? (
                        <img
                          src={item.gambar_url.startsWith("http") ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${item.gambar_url}`}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-orange-200" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">{item.kategori}</span>
                      <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-base">{item.judul}</h3>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/artikel" className="inline-flex items-center gap-2 text-primary font-bold text-sm">
              Lihat Semua Artikel <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Jam Operasional & Kontak Cepat ─────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            badge="Hubungi Kami"
            badgeIcon={<Phone size={14} />}
            title={<>Jam Operasional & <span className="text-primary">Kontak Cepat</span></>}
            subtitle="Balai Desa Budur siap melayani Anda. Hubungi kami atau kunjungi langsung."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jam Buka */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                <Clock size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl font-heading mb-4">Jam Operasional</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Senin – Jumat</span>
                  <span className="font-bold text-primary">08.00 – 15.00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Sabtu & Minggu</span>
                  <span className="font-medium text-red-500">Tutup</span>
                </div>
                <div className="pt-3 border-t border-primary/10">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Portal Online 24 Jam
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Alamat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8 border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <MapPin size={28} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl font-heading mb-3">Lokasi Kantor</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Jl. Raya Desa Budur No. 1, Kec. Ciwaringin, Kab. Cirebon, Jawa Barat 45167
              </p>
              <a
                href="https://maps.google.com/?q=Desa+Budur+Ciwaringin+Cirebon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
              >
                Buka di Maps <ArrowRight size={14} />
              </a>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                  <MessageSquare size={28} />
                </div>
                <h3 className="font-bold text-white text-xl font-heading mb-3">Hubungi via WhatsApp</h3>
                <p className="text-green-100 text-sm mb-5">Ada pertanyaan? Langsung hubungi aparat desa melalui WhatsApp.</p>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-green-50 transition-colors"
                >
                  Chat Sekarang <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-primary-dark via-primary to-primary-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-20 translate-y-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-4xl text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
            Belum Punya Akun Warga? 
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Daftar sekarang untuk mengakses layanan e-Surat, Pengaduan, dan fitur eksklusif warga Desa Budur lainnya. Gratis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-gold hover:bg-gold-light text-primary-dark font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-gold/40 hover:-translate-y-0.5"
            >
              Daftar Sekarang — Gratis
            </Link>
            <Link
              href="/auth/login"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-4 rounded-full transition-all border border-white/30"
            >
              Sudah Punya Akun? Login
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}

// ─── Service Card Component ───────────────────────────────────────────────────
function ServiceCard({
  icon, iconBg, accentColor, title, desc, href
}: {
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="block group h-full">
      <div className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 border-t-4 ${accentColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full`}>
        <div className={`w-16 h-16 rounded-xl ${iconBg} flex items-center justify-center mb-6 transition-all duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-500 line-clamp-3 text-sm leading-relaxed mb-4">{desc}</p>
        <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
          Akses Layanan <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
