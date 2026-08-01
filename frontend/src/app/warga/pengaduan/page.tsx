"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Clock, Loader, CheckCircle2, MessageSquare, Image as ImageIcon, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WargaPengaduan() {
  const [pengaduanList, setPengaduanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const res = await api.get("/pengaduan");
        setPengaduanList(res.data.data || []);
      } catch (err) {
        console.error("Gagal memuat riwayat pengaduan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPengaduan();
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Menunggu: "bg-orange-100 text-orange-700",
      Diterima: "bg-blue-100 text-blue-700",
      Diproses: "bg-indigo-100 text-indigo-700",
      Selesai: "bg-green-100 text-green-700",
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Riwayat Pengaduan Saya</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau status tindak lanjut laporan Anda.</p>
        </div>
        <Link
          href="/pengaduan"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-orange-600 transition-colors"
        >
          + Buat Laporan
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader size={32} className="animate-spin text-primary mx-auto" />
          <p className="text-gray-500 mt-3">Memuat data pengaduan...</p>
        </div>
      ) : pengaduanList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Anda belum pernah membuat laporan pengaduan.</p>
          <Link href="/pengaduan" className="text-primary font-bold hover:underline text-sm mt-2 inline-block">
            Buat Laporan Sekarang →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pengaduanList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex gap-5 items-start">
                {/* Foto bukti */}
                {item.foto ? (
                  <div className="w-20 h-20 rounded-xl relative overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img
                      src={item.foto.startsWith("http") ? item.foto : `${process.env.NEXT_PUBLIC_BASE_URL}${item.foto}`}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
                    <ImageIcon size={28} />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.judul}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.isi_laporan}</p>
                  <p className="text-xs text-gray-400">
                    Dilaporkan: {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* Tanggapan admin */}
              {item.tanggapan_admin && (
                <div className="mx-6 mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-blue-800">Tanggapan dari Pemerintah Desa</span>
                    {item.tanggapan_at && (
                      <span className="text-xs text-blue-400 ml-auto">
                        {new Date(item.tanggapan_at).toLocaleDateString("id-ID")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">{item.tanggapan_admin}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
