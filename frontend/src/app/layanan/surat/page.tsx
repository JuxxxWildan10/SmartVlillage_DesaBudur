"use client";

import { useState, useEffect } from "react";
import { FileText, Send, CheckCircle2, Search, Clock, FileCheck, FileX, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

export default function SuratPage() {
  const [activeTab, setActiveTab] = useState<"lacak" | "pengajuan">("pengajuan");
  const [formData, setFormData] = useState({ jenis_surat: "", keperluan: "", nomor_wa: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trackingCode, setTrackingCode] = useState("");

  // Jenis surat dari database
  const [jenisSuratList, setJenisSuratList] = useState<any[]>([]);

  // Tracking state
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role) setIsAuth(true);

    // Fetch jenis surat dari database
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/master-surat`)
      .then(res => {
        if (res.data.status === "success") setJenisSuratList(res.data.data);
      })
      .catch(() => {
        // Fallback jika API gagal
        setJenisSuratList([
          { id: 1, nama_surat: "Surat Keterangan Usaha (SKU)" },
          { id: 2, nama_surat: "Surat Keterangan Tidak Mampu (SKTM)" },
          { id: 3, nama_surat: "Surat Keterangan Domisili" },
          { id: 4, nama_surat: "Surat Pengantar Nikah" },
          { id: 5, nama_surat: "Surat Keterangan Kematian" },
        ]);
      });
  }, []);

  const handleTabSwitch = (tab: "lacak" | "pengajuan") => {
    if (tab === "pengajuan" && !isAuth) {
      router.push("/auth/login?redirect=/layanan/surat");
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuth) {
      router.push("/auth/login?redirect=/layanan/surat");
      return;
    }
    setStatus("loading");
    try {
      const res = await api.post("/surat", formData);
      if (res.data.status === "success") {
        setStatus("success");
        setTrackingCode(res.data.data.tracking_code);
        setFormData({ jenis_surat: "", keperluan: "", nomor_wa: "" });
        toast.success("Pengajuan berhasil dikirim!");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Gagal mengirim pengajuan surat.");
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat/track/${trackInput}`);
      if (res.data.status === "success") setTrackResult(res.data.data);
    } catch (err: any) {
      setTrackError(err.response?.data?.message || "Terjadi kesalahan saat melacak surat.");
    } finally {
      setTrackLoading(false);
    }
  };

  const getStatusIcon = (st: string) => {
    switch(st) {
      case "Menunggu": return <Clock className="text-yellow-500" size={24} />;
      case "Diproses": return <FileText className="text-blue-500" size={24} />;
      case "Selesai":  return <FileCheck className="text-green-500" size={24} />;
      case "Ditolak":  return <FileX className="text-red-500" size={24} />;
      default:         return <Clock className="text-gray-500" size={24} />;
    }
  };

  // Ambil info persyaratan jenis surat yang dipilih
  const selectedJenis = jenisSuratList.find(j => j.nama_surat === formData.jenis_surat);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <FileText size={16} /> Layanan Mandiri
          </div>
          <h1 className="text-4xl font-bold text-primary-dark font-heading mb-4">Layanan e-Surat</h1>
          <p className="text-gray-600">
            Ajukan surat secara online atau lacak status pengajuan Anda secara realtime.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-2 shadow-sm mb-8 border border-gray-100">
          <button
            onClick={() => handleTabSwitch("pengajuan")}
            className={`flex-1 py-3 text-center rounded-xl font-bold transition-all ${activeTab === "pengajuan" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Pengajuan Baru
          </button>
          <button
            onClick={() => handleTabSwitch("lacak")}
            className={`flex-1 py-3 text-center rounded-xl font-bold transition-all ${activeTab === "lacak" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Lacak Surat
          </button>
        </div>

        {activeTab === "pengajuan" ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {status === "success" ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Berhasil Diajukan!</h3>
                <p className="text-gray-600 mb-6">Permohonan surat Anda sedang diproses oleh staf desa.</p>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 inline-block text-left">
                  <span className="block text-sm text-gray-500 mb-1">Kode Pelacakan Anda:</span>
                  <div className="text-3xl font-mono font-bold text-primary tracking-wider bg-white px-6 py-2 rounded-xl shadow-sm border border-gray-100">
                    {trackingCode}
                  </div>
                  <span className="block text-xs text-red-500 mt-2 font-medium">*Simpan kode ini untuk melacak status surat.</span>
                </div>
                <br/>
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Ajukan Surat Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Surat</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={formData.jenis_surat}
                    onChange={(e) => setFormData({...formData, jenis_surat: e.target.value})}
                  >
                    <option value="">-- Pilih Jenis Surat --</option>
                    {jenisSuratList.map(j => (
                      <option key={j.id} value={j.nama_surat}>{j.nama_surat}</option>
                    ))}
                  </select>
                </div>

                {/* Tampilkan persyaratan jika ada */}
                {selectedJenis?.persyaratan && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-amber-800 mb-2">📋 Persyaratan yang perlu disiapkan:</p>
                    <p className="text-sm text-amber-700 whitespace-pre-line">{selectedJenis.persyaratan}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    pattern="^08[0-9]{8,11}$"
                    title="Nomor WhatsApp harus diawali 08 dan berisi 10-13 digit angka"
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={formData.nomor_wa}
                    onChange={(e) => setFormData({...formData, nomor_wa: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Kami akan memberitahu Anda via WhatsApp jika surat selesai.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keperluan</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Jelaskan keperluan pembuatan surat secara detail..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    value={formData.keperluan}
                    onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                  />
                </div>

                {status === "error" && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    Terjadi kesalahan saat mengirim pengajuan. Pastikan koneksi internet stabil atau hubungi admin.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Kirim Pengajuan <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-heading">Lacak Status Pengajuan</h2>
            <form onSubmit={handleTrack} className="flex gap-3 mb-8">
              <input
                type="text"
                required
                placeholder="Masukkan Kode Pelacakan (Contoh: TRK-XXXXXX)"
                className="flex-1 px-5 py-4 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono uppercase"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {trackLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Search size={18} /> Cari</>
                )}
              </button>
            </form>

            {trackError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center font-medium">
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Kode Pelacakan</p>
                    <p className="text-xl font-mono font-bold text-gray-900">{trackResult.tracking_code}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2
                    ${trackResult.status === "Selesai" ? "bg-green-100 text-green-700" :
                      trackResult.status === "Diproses" ? "bg-blue-100 text-blue-700" :
                      trackResult.status === "Ditolak" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"}`}>
                    {getStatusIcon(trackResult.status)} {trackResult.status}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Jenis Surat</p>
                    <p className="font-bold text-gray-900">{trackResult.jenis_surat}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Tanggal Pengajuan</p>
                      <p className="font-medium text-gray-900">{trackResult.tanggal_pengajuan}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Terakhir Diperbarui</p>
                      <p className="font-medium text-gray-900">{trackResult.terakhir_diperbarui}</p>
                    </div>
                  </div>
                  {trackResult.status === "Selesai" && (
                    <div className="mt-6">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/surat/${trackResult.tracking_code}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <FileCheck size={20} /> Unduh Dokumen Surat (PDF)
                      </a>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Dokumen PDF ini dilengkapi dengan QR Code sebagai Tanda Tangan Elektronik (TTE) Kepala Desa.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
