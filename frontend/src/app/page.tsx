"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Activity, ShieldCheck, Users, Megaphone, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState({
    total_penduduk: 0, total_kk: 0, target_sdgs: 0, total_umkm: 0
  });
  const [runningText, setRunningText] = useState("Memuat Info Desa...");
  const [latestBerita, setLatestBerita] = useState<any[]>([]);
  const [latestArtikel, setLatestArtikel] = useState<any[]>([]);

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
      .then(res => { if (res.data.status === "success") setRunningText(res.data.data.text); })
      .catch(err => console.error("Error fetching running text", err));

    // Fetch latest berita
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((b: any) => b.status === "Published");
          setLatestBerita(published.slice(0, 3));
        }
      })
      .catch(() => {});

    // Fetch latest artikel
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artikel`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((a: any) => a.status === "Published");
          setLatestArtikel(published.slice(0, 3));
        }
      })
      .catch(() => {});
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

      {/* Berita & Acara Desa */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
                <Calendar size={14} /> Jadwal & Acara
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-heading">Berita & Acara Desa</h2>
            </div>
            <Link href="/berita" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors text-sm">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          {latestBerita.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-400">Belum ada jadwal acara yang dipublikasikan.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {latestBerita.map((item) => (
                <div key={item.id} onClick={() => window.location.href = "/berita"}
                  className="group cursor-pointer bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
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
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link href="/berita" className="inline-flex items-center gap-2 text-primary font-bold text-sm">Lihat Semua Acara <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Artikel Edukasi */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
                <BookOpen size={14} /> Edukasi Warga
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-heading">Artikel & Edukasi</h2>
            </div>
            <Link href="/artikel" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors text-sm">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          {latestArtikel.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl text-gray-400">Belum ada artikel yang dipublikasikan.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {latestArtikel.map((item) => (
                <Link key={item.id} href={`/artikel/${item.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="h-40 overflow-hidden bg-orange-50">
                    {item.gambar_url ? (
                      <img src={item.gambar_url.startsWith("http") ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${item.gambar_url}`}
                        alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BookOpen size={40} className="text-orange-200" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">{item.kategori}</span>
                    <h3 className="mt-3 font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-base">{item.judul}</h3>
                    <p className="text-xs text-gray-400 mt-2">{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link href="/artikel" className="inline-flex items-center gap-2 text-primary font-bold text-sm">Lihat Semua Artikel <ArrowRight size={16} /></Link>
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
