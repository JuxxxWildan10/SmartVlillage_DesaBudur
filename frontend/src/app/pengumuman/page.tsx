"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PengumumanPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        // Filter out drafts on the public page
        const published = res.data.data.filter((n: any) => n.status === "Published");
        setNews(published);
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Megaphone size={16} /> Kabar Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Pengumuman & Berita</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Ikuti perkembangan informasi terbaru, kegiatan, dan pengumuman resmi dari Pemerintah Desa Budur.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-[400px] rounded-3xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Megaphone size={48} className="mx-auto text-red-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">Gagal memuat pengumuman. Silakan periksa koneksi Anda.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">Coba Lagi</button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada pengumuman yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image 
                    src={item.gambar_url ? (item.gambar_url.startsWith("http") ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${item.gambar_url}`) : "https://images.unsplash.com/photo-1592982537447-6f2334208f74?q=80&w=2070&auto=format&fit=crop"} 
                    alt={item.judul} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {item.kategori}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 font-heading mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {item.judul}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {item.isi_berita}
                  </p>
                  
                  <Link href={`/pengumuman/${item.id}`} className="inline-flex items-center gap-2 text-gold-dark font-bold text-sm hover:text-gold transition-colors">
                    Baca Selengkapnya <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
