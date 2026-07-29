"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Loader, CheckCircle2, MessageSquare, Image as ImageIcon } from "lucide-react";

export default function AdminPengaduan() {
  const [pengaduanList, setPengaduanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPengaduan = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pengaduan`);
      setPengaduanList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pengaduan/${id}`, { status: newStatus });
      fetchPengaduan(); // Refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Gagal memperbarui status");
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Pengaduan</h2>
          <p className="text-gray-500 text-sm mt-1">Tindak lanjut aspirasi dan keluhan warga.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">Memuat data...</div>
        ) : pengaduanList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Pengaduan</h3>
            <p className="text-gray-500 text-sm">Saat ini belum ada pengaduan atau aspirasi dari warga.</p>
          </div>
        ) : (
          pengaduanList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {item.foto ? (
                  <div className="w-20 h-20 rounded-xl relative overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img src={item.foto.startsWith('http') ? item.foto : `${process.env.NEXT_PUBLIC_BASE_URL}${ item.foto }`} alt={item.judul} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.judul}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'Menunggu' ? 'bg-orange-100 text-orange-700' :
                      item.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.isi_laporan}</p>
                  <div className="text-xs text-gray-400">
                    Pelapor ID: {item.penduduk_id} &bull; {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'Menunggu' && (
                  <button 
                    onClick={() => updateStatus(item.id, 'Diproses')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Loader size={16} /> Proses
                  </button>
                )}
                {item.status === 'Diproses' && (
                  <button 
                    onClick={() => updateStatus(item.id, 'Selesai')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors"
                  >
                    <CheckCircle2 size={16} /> Selesaikan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
