"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  ShieldCheck, Send, CheckCircle2, Loader, ArrowLeft,
  ImagePlus, X, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const KATEGORI_OPTIONS = [
  "Infrastruktur & Jalan",
  "Kebersihan & Sampah",
  "Keamanan & Ketertiban",
  "Pelayanan Publik",
  "Sosial & Kemasyarakatan",
  "Lainnya",
];

const MAX_JUDUL = 100;
const MAX_ISI = 1000;

export default function PengaduanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    isi_laporan: "",
    foto: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (!role) {
      router.push("/auth/login?redirect=/pengaduan");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, foto: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, foto: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = new FormData();
      data.append("judul", formData.judul);
      data.append("isi_laporan", formData.isi_laporan);
      if (formData.kategori) data.append("kategori", formData.kategori);
      if (formData.foto) data.append("foto", formData.foto);

      const res = await api.post("/pengaduan", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        setStatus("success");
        setFormData({ judul: "", kategori: "", isi_laporan: "", foto: null });
        setPhotoPreview(null);
      } else {
        setStatus("error");
        setErrorMessage("Server mengembalikan respons tidak valid. Coba lagi.");
      }
    } catch (err: any) {
      setStatus("error");
      const msg = err?.response?.data?.message;
      setErrorMessage(msg || "Gagal mengirim pengaduan. Pastikan koneksi internet stabil dan coba lagi.");
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
    <div className="pt-28 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <ShieldCheck size={16} /> Suara Warga
          </div>
          <h1 className="text-4xl font-bold text-primary-dark font-heading mb-4">Layanan Pengaduan</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Sampaikan laporan, keluhan, maupun aspirasi Anda kepada Pemerintah Desa Budur. Laporan Anda dijamin kerahasiaannya.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Laporan Terkirim! 🎉</h3>
                <p className="text-gray-600 mb-8">
                  Terima kasih atas partisipasi Anda. Laporan akan segera ditindaklanjuti oleh aparat terkait dalam 1–3 hari kerja.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  Buat Laporan Baru
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Judul */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Judul Laporan <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs font-medium ${formData.judul.length > MAX_JUDUL * 0.9 ? "text-red-500" : "text-gray-400"}`}>
                      {formData.judul.length}/{MAX_JUDUL}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={MAX_JUDUL}
                    placeholder="Ketik judul laporan yang ringkas dan jelas..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori Laporan <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {KATEGORI_OPTIONS.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Isi Laporan */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Detail Laporan <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs font-medium ${formData.isi_laporan.length > MAX_ISI * 0.9 ? "text-red-500" : "text-gray-400"}`}>
                      {formData.isi_laporan.length}/{MAX_ISI}
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    maxLength={MAX_ISI}
                    placeholder="Ceritakan kronologi atau deskripsikan laporan Anda selengkap mungkin. Semakin detail, semakin cepat laporan ditangani."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                    value={formData.isi_laporan}
                    onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
                  />
                </div>

                {/* Foto Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Foto Bukti <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>

                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                      <img
                        src={photoPreview}
                        alt="Preview foto"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm hover:bg-red-600 transition-colors"
                        >
                          <X size={16} /> Hapus Foto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-xl py-8 flex flex-col items-center gap-3 text-gray-400 hover:text-primary transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center transition-colors">
                        <ImagePlus size={22} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">Klik untuk unggah foto</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP (Maks. 5 MB)</p>
                      </div>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm"
                    >
                      ⚠️ {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim Laporan...
                    </>
                  ) : (
                    <>Kirim Laporan <Send size={18} /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
