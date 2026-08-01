"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Clock, Loader, CheckCircle2, MessageSquare, Image as ImageIcon, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminPengaduan() {
  const [pengaduanList, setPengaduanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [tanggapan, setTanggapan] = useState<Record<number, string>>({});

  const fetchPengaduan = async () => {
    try {
      const res = await api.get("/pengaduan");
      setPengaduanList(res.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat data pengaduan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPengaduan(); }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/pengaduan/${id}`, { status: newStatus });
      toast.success(`Status diperbarui ke "${newStatus}".`);
      fetchPengaduan();
    } catch {
      toast.error("Gagal memperbarui status.");
    }
  };

  const kirimTanggapan = async (id: number) => {
    const text = tanggapan[id];
    if (!text?.trim()) { toast.error("Tulis tanggapan terlebih dahulu."); return; }
    try {
      await api.put(`/pengaduan/${id}`, { tanggapan_admin: text });
      toast.success("Tanggapan berhasil dikirim ke warga.");
      setTanggapan(prev => ({ ...prev, [id]: "" }));
      fetchPengaduan();
    } catch {
      toast.error("Gagal mengirim tanggapan.");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({ title: "Hapus Pengaduan?", text: "Data ini tidak dapat dikembalikan.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/pengaduan/${id}`);
      toast.success("Pengaduan dihapus.");
      fetchPengaduan();
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const toggleExpand = (id: number) => setExpandedId(prev => prev === id ? null : id);

  const statusColor: Record<string, string> = {
    Menunggu: "bg-orange-100 text-orange-700",
    Diterima: "bg-blue-100 text-blue-700",
    Diproses: "bg-indigo-100 text-indigo-700",
    Selesai: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Pengaduan</h2>
          <p className="text-gray-500 text-sm mt-1">Tindak lanjut aspirasi dan keluhan warga. Klik item untuk membalas.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
          Total: {pengaduanList.length} pengaduan
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-gray-500">Memuat data pengaduan...</p>
        </div>
      ) : pengaduanList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare size={32} /></div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Pengaduan</h3>
          <p className="text-gray-500 text-sm">Saat ini belum ada pengaduan atau aspirasi dari warga.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pengaduanList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header Row */}
              <div className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {item.foto ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.foto.startsWith("http") ? item.foto : `${process.env.NEXT_PUBLIC_BASE_URL}${item.foto}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0"><ImageIcon size={24} /></div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.judul}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor[item.status] || "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.isi_laporan}</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                      <span>Pelapor: <strong className="text-gray-600">{item.penduduk?.nama_lengkap || "—"}</strong> ({item.penduduk?.nik || "N/A"})</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "Menunggu" && (
                    <button onClick={() => updateStatus(item.id, "Diproses")} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors">
                      <Loader size={15} /> Proses
                    </button>
                  )}
                  {item.status === "Diproses" && (
                    <button onClick={() => updateStatus(item.id, "Selesai")} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors">
                      <CheckCircle2 size={15} /> Selesai
                    </button>
                  )}
                  <button onClick={() => toggleExpand(item.id)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors">
                    <MessageSquare size={15} /> Balas {expandedId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Detail & Tanggapan */}
              {expandedId === item.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-5 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Isi Laporan Lengkap:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-gray-100">{item.isi_laporan}</p>
                  </div>

                  {item.tanggapan_admin && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-sm font-bold text-blue-800 mb-1">✅ Tanggapan Terkirim ({new Date(item.tanggapan_at).toLocaleDateString("id-ID")}):</p>
                      <p className="text-sm text-blue-700">{item.tanggapan_admin}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      {item.tanggapan_admin ? "Perbarui Tanggapan:" : "Kirim Tanggapan ke Warga:"}
                    </p>
                    <div className="flex gap-3">
                      <textarea
                        rows={3}
                        placeholder="Tulis tanggapan resmi dari pemerintah desa..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-800 text-sm resize-none bg-white"
                        value={tanggapan[item.id] || ""}
                        onChange={e => setTanggapan(prev => ({ ...prev, [item.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => kirimTanggapan(item.id)}
                        className="self-end px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 transition-colors shrink-0"
                      >
                        <Send size={16} /> Kirim
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
