"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Newspaper, Calendar, ArrowRight, X, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";

export default function BeritaPage() {
  const [berita, setBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBerita, setSelectedBerita] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        if (res.data.status === "success") {
          // Hanya tampilkan yang published
          const published = res.data.data.filter((b: any) => b.status === "Published");
          setBerita(published);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openBerita = (item: any) => {
    setSelectedBerita(item);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Newspaper size={16} /> Kabar Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black font-heading mb-4">Portal Berita Budur</h1>
          <p className="text-gray-800 text-lg">
            Ikuti informasi terkini, pengumuman penting, dan kabar pembangunan dari Pemerintah Desa Budur.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={`skel-${i}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse flex flex-col h-full">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Newspaper size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-black font-heading">Belum ada berita</h3>
            <p className="text-gray-800">Nantikan pembaruan informasi selanjutnya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map((item) => (
              <div 
                key={item.id} 
                onClick={() => openBerita(item)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {item.gambar_url ? (
                    <img src={item.gambar_url.startsWith('http') ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${ item.gambar_url }`} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-xs font-bold">
                      {item.kategori}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-black text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                    {item.isi_berita}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar size={14} /> 
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                      Baca <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Berita">
        {selectedBerita && (
          <div className="space-y-6">
            <div>
              {selectedBerita.gambar_url && (
                <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-gray-100 relative">
                  <img src={selectedBerita.gambar_url.startsWith('http') ? selectedBerita.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${ selectedBerita.gambar_url }`} alt={selectedBerita.judul} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-xs font-bold">
                  {selectedBerita.kategori}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                  <Calendar size={14} /> 
                  {new Date(selectedBerita.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6 leading-snug">
                {selectedBerita.judul}
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedBerita.isi_berita}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
