"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, MessageSquare, Plus, Bell } from "lucide-react";
import Link from "next/link";

export default function WargaDashboard() {
  const [stats, setStats] = useState({ surat: 0, pengaduan: 0 });
  const userName = typeof window !== 'undefined' ? localStorage.getItem("user_name") : "";

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-heading">Halo, {userName}!</h2>
        <p className="text-gray-500">Selamat datang di Panel Layanan Mandiri Desa Budur.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Surat Saya</p>
              <p className="text-2xl font-bold text-gray-900">Lihat Riwayat</p>
            </div>
          </div>
          <Link href="/warga/surat" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold transition-colors">
            Buka
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Pengaduan Saya</p>
              <p className="text-2xl font-bold text-gray-900">Pantau Aduan</p>
            </div>
          </div>
          <Link href="/warga/pengaduan" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold transition-colors">
            Buka
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-primary" /> Layanan Cepat
          </h3>
          <div className="space-y-3">
            <Link href="/layanan/surat" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-primary">Buat Surat Baru</span>
              <span className="text-gray-400 group-hover:text-primary">→</span>
            </Link>
            <Link href="/pengaduan" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-orange-600">Buat Laporan Baru</span>
              <span className="text-gray-400 group-hover:text-orange-600">→</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Bell size={100} /></div>
          <h3 className="font-bold text-xl mb-2 relative z-10">Pusat Informasi</h3>
          <p className="text-primary-100 text-sm mb-4 relative z-10 opacity-90 max-w-[80%]">
            Selalu pantau informasi terbaru dan pencairan Bansos melalui menu Pengumuman di beranda utama.
          </p>
          <Link href="/pengumuman" className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors relative z-10">
            Lihat Berita
          </Link>
        </div>
      </div>
    </div>
  );
}
