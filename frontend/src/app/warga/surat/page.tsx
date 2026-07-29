"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function WargaSurat() {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat`);
        const nik = localStorage.getItem("user_nik");
        // Filter surat hanya milik user yang login
        const mySurat = res.data.data.filter((s: any) => s.penduduk_id === nik);
        setSuratList(mySurat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurat();
  }, []);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Riwayat Surat Saya</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau status persetujuan surat keterangan Anda.</p>
        </div>
        <Link href="/layanan/surat" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors">
          + Buat Surat
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Keperluan</th>
                <th className="px-6 py-4">Tanggal Diajukan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10">Memuat...</td></tr>
              ) : suratList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Anda belum pernah membuat surat.</td></tr>
              ) : (
                suratList.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{surat.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{surat.jenis_surat}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{surat.keperluan}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(surat.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        surat.status === 'Menunggu' ? 'bg-orange-100 text-orange-700' :
                        surat.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {surat.status === 'Menunggu' && <Clock size={12} />}
                        {surat.status === 'Disetujui' && <Check size={12} />}
                        {surat.status === 'Ditolak' && <X size={12} />}
                        {surat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {surat.status === 'Disetujui' ? (
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2">
                          <FileText size={16} /> Unduh PDF
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum tersedia</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
