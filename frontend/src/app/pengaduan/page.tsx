"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ShieldCheck, Send, CheckCircle2, AlertCircle, Loader, ArrowLeft } from "lucide-react";

export default function PengaduanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ judul: "", isi_laporan: "", foto: null as File | null });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/login?redirect=/pengaduan");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const data = new FormData();
      data.append("judul", formData.judul);
      data.append("isi_laporan", formData.isi_laporan);
      if (formData.foto) {
        data.append("foto", formData.foto);
      }

      const res = await api.post("/pengaduan", data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.status === "success") {
        setStatus("success");
        setFormData({ judul: "", isi_laporan: "", foto: null });
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (isAuthChecking) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <Loader size={40} className="animate-spin text-primary" />
          <p>Memeriksa otentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <ShieldCheck size={16} /> Suara Warga
          </div>
          <h1 className="text-4xl font-bold text-primary-dark font-heading mb-4">Layanan Pengaduan</h1>
          <p className="text-gray-600">
            Sampaikan laporan, keluhan, maupun aspirasi Anda kepada Pemerintah Desa Budur. Laporan Anda dijamin kerahasiaannya.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Laporan Terkirim!</h3>
              <p className="text-gray-600 mb-8">
                Terima kasih atas partisipasi Anda. Laporan akan segera ditindaklanjuti oleh aparat terkait.
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Buat Laporan Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Laporan</label>
                <input 
                  type="text"
                  required
                  placeholder="Ketik judul laporan yang ringkas dan jelas..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detail Laporan</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Ceritakan kronologi atau deskripsikan laporan Anda selengkap mungkin..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  value={formData.isi_laporan}
                  onChange={(e) => setFormData({...formData, isi_laporan: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lampirkan Foto Bukti (Opsional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer outline-none transition-colors"
                  onChange={(e) => setFormData({...formData, foto: e.target.files ? e.target.files[0] : null})}
                />
              </div>

              {status === "error" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                  Terjadi kesalahan saat mengirim pengaduan. Pastikan koneksi internet stabil.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Kirim Laporan <Send size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
