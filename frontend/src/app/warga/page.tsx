"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { FileText, MessageSquare, Plus, Bell, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function WargaDashboard() {
  const [stats, setStats] = useState({ surat: 0, pengaduan: 0, suratSelesai: 0 });
  const [loading, setLoading] = useState(true);
  const userName = typeof window !== "undefined" ? localStorage.getItem("user_name") : "";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [suratRes, pengaduanRes] = await Promise.all([
          api.get("/surat"),
          api.get("/pengaduan"),
        ]);

        const suratData = suratRes.data.data || [];
        const pengaduanData = pengaduanRes.data.data || [];

        setStats({
          surat: suratData.length,
          pengaduan: pengaduanData.length,
          suratSelesai: suratData.filter((s: any) => s.status === "Selesai").length,
        });
      } catch (err) {
        console.error("Failed to fetch warga stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-heading">Halo, {userName}! 👋</h2>
        <p className="text-gray-500 mt-1">Selamat datang di Panel Layanan Mandiri Desa Budur.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Surat</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" /> : stats.surat}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Surat Selesai</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" /> : stats.suratSelesai}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Pengaduan</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" /> : stats.pengaduan}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Surat Saya</p>
              <p className="text-xl font-bold text-gray-900">Lihat Riwayat</p>
            </div>
          </div>
          <Link
            href="/warga/surat"
            className="px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-lg text-sm font-bold transition-all"
          >
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
              <p className="text-xl font-bold text-gray-900">Pantau Aduan</p>
            </div>
          </div>
          <Link
            href="/warga/pengaduan"
            className="px-4 py-2 bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-700 rounded-lg text-sm font-bold transition-all"
          >
            Buka
          </Link>
        </div>
      </div>

      {/* Layanan Cepat & Info */}
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
            <Link href="/forum" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-blue-600">Forum Warga</span>
              <span className="text-gray-400 group-hover:text-blue-600">→</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bell size={100} />
          </div>
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
