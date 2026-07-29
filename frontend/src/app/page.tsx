"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Activity, ShieldCheck, Users, Megaphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({
    total_penduduk: 0,
    total_kk: 0,
    target_sdgs: 0,
    total_umkm: 0
  });
  const [runningText, setRunningText] = useState("Memuat Info Desa...");

  useEffect(() => {
    // Fetch stats
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then(res => {
        if (res.data.status === "success") {
          setStats(res.data.data.statistics);
        }
      })
      .catch(err => console.error("Error fetching stats", err));

    // Fetch running text
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/running-text`)
      .then(res => {
        if (res.data.status === "success") {
          setRunningText(res.data.data.text);
        }
      })
      .catch(err => console.error("Error fetching running text", err));
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Placeholder for Video/Drone Photo */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-primary-dark/70 backdrop-blur-sm" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block glass px-4 py-2 rounded-full mb-6 text-gold-light font-medium text-sm">
              ✨ Smart Village System Terintegrasi
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-heading">
              Selamat Datang di <br/>
              <span className="text-gold">Desa Budur</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Portal layanan digital resmi Pemerintah Desa Budur, Kecamatan Ciwaringin. Melayani masyarakat dengan transparan, cepat, dan inovatif.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/layanan" className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/50 flex-center gap-2">
                Layanan Publik <ArrowRight size={20} />
              </Link>
              <Link href="/sdgs" className="glass hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all flex-center gap-2">
                Capaian SDGs Desa <Activity size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Running Text / News Ticker */}
        <div className="absolute bottom-0 w-full glass border-none border-t border-white/20 text-white overflow-hidden flex items-center">
          {/* Static Label */}
          <div className="relative z-20 bg-primary-dark/95 text-gold font-bold px-4 md:px-8 py-3 shrink-0 flex items-center gap-2 shadow-[10px_0_20px_-5px_rgba(0,0,0,0.5)]">
            <Megaphone size={18} /> <span className="hidden md:inline">INFO DESA</span>
          </div>
          
          {/* Animated Container */}
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap animate-[ticker_25s_linear_infinite] inline-block font-medium pl-[100%] hover:[animation-play-state:paused] cursor-default">
              {runningText}
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Cepat Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-dark font-heading mb-4">Layanan Digital</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Akses berbagai layanan administrasi desa secara online tanpa harus antre di balai desa.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<FileText size={32} className="text-blue" />}
              title="e-Surat"
              desc="Pengajuan Surat Keterangan Usaha, Domisili, dan lainnya secara online."
              href="/layanan/surat"
            />
            <ServiceCard 
              icon={<ShieldCheck size={32} className="text-primary" />}
              title="Pengaduan Warga"
              desc="Sampaikan aspirasi dan keluhan Anda langsung kepada Pemerintah Desa."
              href="/pengaduan"
            />
            <ServiceCard 
              icon={<Users size={32} className="text-gold" />}
              title="UMKM & BUMDes"
              desc="Eksplorasi produk lokal dan dukung pertumbuhan ekonomi desa."
              href="/umkm"
            />
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-20 bg-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number={stats.total_penduduk.toLocaleString('id-ID')} label="Penduduk" />
            <StatCard number={stats.total_kk.toLocaleString('id-ID')} label="Kepala Keluarga" />
            <StatCard number={stats.target_sdgs.toString()} label="Target SDGs" />
            <StatCard number={stats.total_umkm.toString()} label="UMKM Aktif" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ icon, title, desc, href }: { icon: React.ReactNode, title: string, desc: string, href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="w-16 h-16 rounded-xl bg-blue-50 flex-center mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{title}</h3>
        <p className="text-gray-600 line-clamp-3">{desc}</p>
      </div>
    </Link>
  );
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-gold mb-2 font-heading">{number}</div>
      <div className="text-sm md:text-base text-gray-300 font-medium">{label}</div>
    </div>
  );
}
