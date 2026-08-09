"use client";

import { FileText, Download, Calendar, Search } from "lucide-react";
import { useState } from "react";

export default function PerdesPage() {
  const dummyPerdes = [
    { id: 1, nomor: "Perdes No. 01 Tahun 2026", tentang: "Rencana Kerja Pemerintah Desa (RKPDes) Tahun 2026", tanggal: "2026-01-10", link: "#" },
    { id: 2, nomor: "Perdes No. 02 Tahun 2025", tentang: "Anggaran Pendapatan dan Belanja Desa (APBDes) 2025", tanggal: "2024-12-25", link: "#" },
    { id: 3, nomor: "Perdes No. 03 Tahun 2024", tentang: "Pengelolaan Sampah Terpadu Skala Desa", tanggal: "2024-05-12", link: "#" },
    { id: 4, nomor: "Perdes No. 04 Tahun 2023", tentang: "Pendirian BUMDes 'Maju Bersama' Desa Budur", tanggal: "2023-08-20", link: "#" },
  ];

  const [search, setSearch] = useState("");

  const filtered = dummyPerdes.filter(p => 
    p.tentang.toLowerCase().includes(search.toLowerCase()) || 
    p.nomor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <FileText size={16} /> Dokumen Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">
            Peraturan Desa (Perdes)
          </h1>
          <p className="text-gray-600 text-lg">
            Kumpulan dokumen Peraturan Desa Budur yang dapat diakses oleh publik sebagai bentuk transparansi hukum.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-gray-900 text-xl">Daftar Perdes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari peraturan..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.length > 0 ? filtered.map((item) => (
              <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-primary">{item.nomor}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {item.tanggal}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.tentang}</h3>
                </div>
                <a href={item.link} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-xl text-sm font-medium transition-all shrink-0">
                  <Download size={16} /> Unduh PDF
                </a>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-500">
                Dokumen tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
