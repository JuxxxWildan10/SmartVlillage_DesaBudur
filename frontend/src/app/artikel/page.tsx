"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";

export default function ArtikelPage() {
  const [artikel, setArtikel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from the berita API
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        if (res.data.status === "success") {
          // We can optionally filter if there are categories. For now, we show all.
          setArtikel(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Artikel & Edukasi Warga</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kumpulan artikel bermanfaat, panduan kesehatan, mitigasi bencana, dan informasi edukatif lainnya untuk membangun masyarakat yang cerdas.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-80 rounded-3xl border border-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : artikel.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">Belum ada artikel edukasi yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artikel.map(item => (
              <article key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-200 relative">
                  {item.gambar_url ? (
                    <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <BookOpen size={48} opacity={0.5} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                    {item.kategori || "Edukasi"}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-1 text-sm">
                    {item.isi_berita}
                  </p>
                  <button className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
