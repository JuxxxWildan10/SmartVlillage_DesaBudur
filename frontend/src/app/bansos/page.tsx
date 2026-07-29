"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { HeartHandshake, Calendar, Building, Info, Search, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/Modal";

export default function BansosPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cek Bansos State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nkkInput, setNkkInput] = useState("");
  const [cekResult, setCekResult] = useState<any>(null);
  const [cekLoading, setCekLoading] = useState(false);
  const [cekError, setCekError] = useState("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bansos`)
      .then(res => {
        if (res.data.status === "success") {
          setPrograms(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCekBansos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nkkInput.trim()) return;

    setCekLoading(true);
    setCekError("");
    setCekResult(null);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bansos/cek`, { nkk: nkkInput });
      setCekResult(res.data.data);
    } catch (err: any) {
      setCekError(err.response?.data?.message || "Terjadi kesalahan saat memeriksa data.");
    } finally {
      setCekLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <HeartHandshake size={16} /> Layanan Sosial
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Program Bantuan Sosial</h1>
          <p className="text-gray-600 text-lg mb-8">
            Transparansi penyaluran bantuan sosial bagi masyarakat Desa Budur. Anda dapat melihat program yang sedang berjalan.
          </p>

          <a 
            href="https://cekbansos.kemensos.go.id/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <Building size={20} />
            Cek Penerima Bansos PKH/BPNT (Kemensos RI)
          </a>
        </div>

        {loading ? (
          <div className="flex-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-gray-50 opacity-50">
                  <HeartHandshake size={150} />
                </div>
                
                <div className="relative z-10">
                  <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {prog.status}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 font-heading mb-3">{prog.nama_program}</h3>
                  <p className="text-gray-600 mb-6">{prog.deskripsi}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex-center">
                        <Building size={16} />
                      </div>
                      Penyelenggara: {prog.penyelenggara}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex-center">
                        <Calendar size={16} />
                      </div>
                      Tahun Anggaran: {prog.tahun}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Info size={14} /> Terakhir diperbarui: {new Date(prog.updated_at).toLocaleDateString('id-ID')}
                    </span>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-primary font-bold text-sm hover:underline"
                    >
                      Cek Status Penerima →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setCekResult(null); setCekError(""); setNkkInput(""); }} title="Cek Penerima Bansos Desa">
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Masukkan Nomor Kartu Keluarga (NKK) Anda untuk memeriksa status kepesertaan dalam program Bantuan Sosial tingkat desa.
          </p>

          <form onSubmit={handleCekBansos} className="flex gap-3">
            <input 
              type="text" 
              required
              placeholder="Contoh: 3209180000000001"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              value={nkkInput}
              onChange={(e) => setNkkInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={cekLoading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-70"
            >
              {cekLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={20} />}
            </button>
          </form>

          {cekError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{cekError}</p>
            </div>
          )}

          {cekResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-4">
              <h4 className="font-bold text-gray-900 mb-1">Hasil Pencarian</h4>
              <p className="text-sm text-gray-600 mb-4">Kepala Keluarga: <span className="font-bold text-gray-900">{cekResult.kepala_keluarga}</span></p>
              
              {cekResult.bansos.length > 0 ? (
                <div className="space-y-3">
                  {cekResult.bansos.map((b: any) => (
                    <div key={b.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-900">{b.program?.nama_program || 'Program Tidak Diketahui'}</p>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold 
                          ${b.status_penerimaan === 'Tersalurkan' ? 'bg-green-100 text-green-700' : 
                            b.status_penerimaan === 'Layak' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {b.status_penerimaan}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Tahun Anggaran: {b.program?.tahun}</p>
                      {b.keterangan && <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2">Keterangan: {b.keterangan}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white rounded-lg border border-gray-100">
                  <CheckCircle2 size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Keluarga ini belum terdaftar di program bansos desa mana pun saat ini.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
