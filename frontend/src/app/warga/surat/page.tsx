"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Check, X, Clock, FileText, FileCheck, Download } from "lucide-react";
import Link from "next/link";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function WargaSurat() {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        // Auth token di-inject otomatis oleh axios interceptor.
        // Backend sudah filter by user yang login.
        const res = await api.get("/surat");
        setSuratList(res.data.data || []);
      } catch (err) {
        console.error("Gagal memuat riwayat surat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurat();
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: React.ReactNode }> = {
      Menunggu:  { cls: "bg-orange-100 text-orange-700", icon: <Clock size={12} /> },
      Diproses:  { cls: "bg-blue-100 text-blue-700",    icon: <Clock size={12} /> },
      Selesai:   { cls: "bg-green-100 text-green-700",  icon: <Check size={12} /> },
      Ditolak:   { cls: "bg-red-100 text-red-700",      icon: <X size={12} /> },
    };
    const s = map[status] ?? { cls: "bg-gray-100 text-gray-600", icon: null };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.cls}`}>
        {s.icon} {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Riwayat Surat Saya</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau status persetujuan surat keterangan Anda.</p>
        </div>
        <Link
          href="/layanan/surat"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors"
        >
          + Buat Surat
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Keperluan</th>
                <th className="px-6 py-4">Kode Lacak</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-0"><SkeletonTable rows={4} /></td></tr>
              ) : suratList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                    <p>Anda belum pernah membuat surat.</p>
                    <Link href="/layanan/surat" className="text-primary font-bold hover:underline text-sm mt-2 inline-block">
                      Buat Surat Sekarang →
                    </Link>
                  </td>
                </tr>
              ) : (
                suratList.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{surat.jenis_surat}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={surat.keperluan}>{surat.keperluan}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 bg-gray-50 rounded">{surat.tracking_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(surat.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(surat.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {surat.status === "Selesai" ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/surat/${surat.tracking_code}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2"
                        >
                          <Download size={14} /> Unduh PDF
                        </a>
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
