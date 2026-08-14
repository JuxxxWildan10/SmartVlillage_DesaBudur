"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Calendar, ChevronRight, Search, Tag } from "lucide-react";
import Link from "next/link";

const KATEGORI_COLORS: Record<string, string> = {
  Edukasi: "bg-blue-100 text-blue-700",
  Kesehatan: "bg-green-100 text-green-700",
  Pertanian: "bg-yellow-100 text-yellow-800",
  Hukum: "bg-purple-100 text-purple-700",
  Teknologi: "bg-indigo-100 text-indigo-700",
  Lainnya: "bg-gray-100 text-gray-600",
};

export default function ArtikelPage() {
  const [artikel, setArtikel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeKategori, setActiveKategori] = useState("Semua");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artikel`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((a: any) => a.status === "Published");
          setArtikel(published);
        }
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const kategoriList = ["Semua", ...Array.from(new Set(artikel.map((a: any) => a.kategori).filter(Boolean)))];

  const filtered = artikel.filter(a => {
    const matchKat = activeKategori === "Semua" || a.kategori === activeKategori;
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase()) || (a.isi_artikel || "").toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Artikel & Edukasi Warga</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kumpulan artikel bermanfaat, panduan kesehatan, mitigasi bencana, dan informasi edukatif untuk membangun masyarakat yang cerdas.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-800" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {!loading && kategoriList.map(k => (
              <button key={k} onClick={() => setActiveKategori(k)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeKategori === k ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-[400px] rounded-3xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <BookOpen size={48} className="mx-auto text-red-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">Gagal memuat artikel. Silakan periksa koneksi Anda.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">
              Coba Lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada artikel yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(item => (
              <article key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {item.gambar_url ? (
                    <img src={item.gambar_url.startsWith("http") ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${item.gambar_url}`}
                      alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                      <BookOpen size={48} className="text-orange-200" />
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${KATEGORI_COLORS[item.kategori] || "bg-gray-100 text-gray-600"}`}>
                    {item.kategori || "Artikel"}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    {item.penulis && <><span>·</span><span className="font-medium">{item.penulis}</span></>}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-1 text-sm">
                    {item.isi_artikel}
                  </p>
                  <Link href={`/artikel/${item.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
