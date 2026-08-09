"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Calendar, Tag, ArrowLeft, Share2, Clock, User } from "lucide-react";

export default function ArtikelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artikel, setArtikel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artikel/${params.id}`)
      .then(res => {
        if (res.data.status === "success") {
          setArtikel(res.data.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: artikel?.judul, text: artikel?.isi_artikel?.substring(0, 100) + "...", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !artikel) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-700 mb-4">Artikel tidak ditemukan</p>
        <button onClick={() => router.push("/artikel")} className="text-primary font-medium hover:underline">
          ← Kembali ke daftar artikel
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => router.push("/artikel")}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Artikel
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-8">
          {/* Cover Image */}
          <div className="relative h-72 md:h-96 w-full">
            <Image
              src={artikel.gambar_url
                ? (artikel.gambar_url.startsWith("http") ? artikel.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${artikel.gambar_url}`)
                : "https://images.unsplash.com/photo-1592982537447-6f2334208f74?q=80&w=2070&auto=format&fit=crop"}
              alt={artikel.judul}
              fill className="object-cover" priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {artikel.kategori}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-heading leading-tight">
                {artikel.judul}
              </h1>
            </div>
          </div>

          {/* Meta Info */}
          <div className="px-8 py-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {new Date(artikel.created_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
              {artikel.penulis && (
                <span className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  {artikel.penulis}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Tag size={16} className="text-primary" />
                {artikel.kategori}
              </span>
            </div>
            <button onClick={handleShare}
              className="flex items-center gap-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <Share2 size={16} /> Bagikan
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {artikel.isi_artikel}
            </div>
          </div>

          {/* Footer Card */}
          <div className="px-8 pb-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                🏛️
              </div>
              <div>
                <p className="font-bold text-gray-900">Pemerintah Desa Budur</p>
                <p className="text-sm text-gray-500">Kecamatan Ciwaringin, Kabupaten Cirebon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => router.push("/artikel")}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors">
            <ArrowLeft size={18} /> Lihat Semua Artikel
          </button>
        </div>
      </article>
    </div>
  );
}
