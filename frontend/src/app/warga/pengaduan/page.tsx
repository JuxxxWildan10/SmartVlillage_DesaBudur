"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, CheckCircle2, Loader } from "lucide-react";
import Link from "next/link";

export default function WargaPengaduan() {
  const [pengaduanList, setPengaduanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pengaduan`);
        const nik = localStorage.getItem("user_nik");
        // Filter pengaduan hanya milik user yang login
        const myAduan = res.data.data.filter((p: any) => p.penduduk_id === nik);
        setPengaduanList(myAduan);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPengaduan();
  }, []);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Riwayat Pengaduan Saya</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau progres laporan dan keluhan yang Anda kirimkan.</p>
        </div>
        <Link href="/pengaduan" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-orange-600 transition-colors">
          + Buat Laporan Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">Memuat data...</div>
        ) : pengaduanList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">Anda belum pernah membuat pengaduan.</div>
        ) : (
          pengaduanList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-xs">#{item.id}</span>
                  <span className="text-xs text-gray-400">&bull; {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Menunggu' ? 'bg-orange-100 text-orange-700' :
                  item.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.status === 'Menunggu' && <Clock size={12} />}
                  {item.status === 'Diproses' && <Loader size={12} />}
                  {item.status === 'Selesai' && <CheckCircle2 size={12} />}
                  {item.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.judul}</h3>
              <p className="text-gray-600 mb-4">{item.isi_laporan}</p>

              {item.status === 'Menunggu' && (
                <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm">
                  Laporan Anda sedang menunggu antrean untuk ditinjau oleh staf perangkat desa.
                </div>
              )}
              {item.status === 'Diproses' && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm">
                  Laporan Anda sedang ditindaklanjuti. Staf kami sedang terjun ke lapangan atau menghubungi pihak terkait.
                </div>
              )}
              {item.status === 'Selesai' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm">
                  Tindak lanjut selesai. Terima kasih atas kepedulian Anda terhadap Desa Budur!
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
