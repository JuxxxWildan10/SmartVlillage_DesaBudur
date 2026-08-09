"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, ArrowLeft, ChevronRight, Megaphone, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";

export default function BeritaPage() {
  const [berita, setBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBerita, setSelectedBerita] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKategori, setActiveKategori] = useState("Semua");
  const router = useRouter();

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/berita`)
      .then(res => {
        if (res.data.status === "success") {
          const published = res.data.data.filter((b: any) => b.status === "Published");
          setBerita(published);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const kategoriList = ["Semua", ...Array.from(new Set(berita.map((b: any) => b.kategori).filter(Boolean)))];
  const filteredBerita = activeKategori === "Semua" ? berita : berita.filter(b => b.kategori === activeKategori);

  const openBerita = (item: any) => { setSelectedBerita(item); setIsModalOpen(true); };

  const isUpcoming = (tgl: string | null) => tgl ? new Date(tgl) >= new Date() : false;

  const formatTanggal = (tgl: string | null, withTime = false) => {
    if (!tgl) return null;
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
    return new Date(tgl).toLocaleDateString("id-ID", opts);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Calendar size={16} /> Jadwal & Acara
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">Berita & Acara Desa</h1>
          <p className="text-gray-600 text-lg">
            Jadwal kegiatan, musyawarah, dan pengumuman resmi dari Pemerintah Desa Budur.
          </p>
        </div>

        {/* Filter Kategori */}
        {!loading && berita.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {kategoriList.map(k => (
              <button key={k} onClick={() => setActiveKategori(k)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeKategori === k ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"}`}>
                {k}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse h-72" />
            ))}
          </div>
        ) : filteredBerita.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Belum ada jadwal acara</h3>
            <p className="text-gray-500 mt-2">Nantikan pengumuman kegiatan desa berikutnya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBerita.map((item) => (
              <div key={item.id} onClick={() => openBerita(item)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full">
                {/* Image */}
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  {item.gambar_url ? (
                    <img src={item.gambar_url.startsWith("http") ? item.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${item.gambar_url}`}
                      alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <Calendar size={48} className="text-blue-200" />
                    </div>
                  )}
                  {/* Upcoming badge */}
                  {item.tanggal_acara && (
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${isUpcoming(item.tanggal_acara) ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                      {isUpcoming(item.tanggal_acara) ? "🟢 Akan Datang" : "✅ Selesai"}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary">
                    {item.kategori}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.judul}
                  </h3>
                  {item.tanggal_acara && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-2">
                      <Clock size={14} />
                      <span>{formatTanggal(item.tanggal_acara, true)} WIB</span>
                    </div>
                  )}
                  {item.lokasi_acara && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <span className="line-clamp-1">{item.lokasi_acara}</span>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1">{item.isi_berita}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{formatTanggal(item.created_at)}</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                      Detail <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Acara">
        {selectedBerita && (
          <div className="space-y-5">
            {selectedBerita.gambar_url && (
              <div className="w-full h-60 rounded-2xl overflow-hidden bg-gray-100">
                <img src={selectedBerita.gambar_url.startsWith("http") ? selectedBerita.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${selectedBerita.gambar_url}`}
                  alt={selectedBerita.judul} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-xs font-bold">{selectedBerita.kategori}</span>
              {selectedBerita.tanggal_acara && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUpcoming(selectedBerita.tanggal_acara) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {isUpcoming(selectedBerita.tanggal_acara) ? "🟢 Akan Datang" : "✅ Sudah Selesai"}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading leading-snug">{selectedBerita.judul}</h2>
            {selectedBerita.tanggal_acara && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-3 text-blue-700 font-semibold">
                  <Clock size={18} />
                  <span>{formatTanggal(selectedBerita.tanggal_acara, true)} WIB</span>
                </div>
                {selectedBerita.lokasi_acara && (
                  <div className="flex items-center gap-3 text-blue-700 font-semibold">
                    <MapPin size={18} />
                    <span>{selectedBerita.lokasi_acara}</span>
                  </div>
                )}
              </div>
            )}
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedBerita.isi_berita}
            </div>
            <p className="text-xs text-gray-400">Diposting: {new Date(selectedBerita.created_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
