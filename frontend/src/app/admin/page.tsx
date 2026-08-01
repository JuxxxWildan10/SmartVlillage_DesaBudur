"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { Users, FileText, MessageSquare, TrendingUp, Printer, Save, Megaphone, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ surat: 0, pengaduan: 0, penduduk: 0 });
  const [allSuratData, setAllSuratData] = useState<any[]>([]);
  const [runningText, setRunningText] = useState("");
  const [savingText, setSavingText] = useState(false);
  const [filterBulan, setFilterBulan] = useState<number | "all">("all");
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [suratRes, pengaduanRes, dashRes, textRes] = await Promise.all([
          api.get("/surat"),
          api.get("/pengaduan"),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/running-text`)
        ]);

        const suratData = suratRes.data.data || [];
        setAllSuratData(suratData);
        setStats({
          surat: suratData.filter((s: any) => s.status === "Menunggu").length,
          pengaduan: (pengaduanRes.data.data || []).filter((p: any) => p.status === "Menunggu").length,
          penduduk: dashRes.data.data?.statistics?.total_penduduk || 0
        });

        if (textRes.data.status === "success") {
          setRunningText(textRes.data.data.raw_admin || "");
        }
      } catch (err) {
        console.warn("Failed to fetch admin stats, might be unauthorized or network issue.", err);
      }
    };
    fetchStats();
  }, []);

  // Chart data dengan filter bulan & tahun
  const chartData = useMemo(() => {
    const filtered = allSuratData.filter((s: any) => {
      const d = new Date(s.created_at);
      const tahunMatch = d.getFullYear() === filterTahun;
      const bulanMatch = filterBulan === "all" || d.getMonth() === filterBulan;
      return tahunMatch && bulanMatch;
    });

    const counts: Record<string, number> = {};
    filtered.forEach((s: any) => {
      // Singkatkan nama jenis surat agar muat di chart
      const key = s.jenis_surat?.replace("Surat Keterangan ", "SK ").replace("Surat Pengantar ", "SP ") || "Lainnya";
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [allSuratData, filterBulan, filterTahun]);

  const handleSaveText = async () => {
    setSavingText(true);
    try {
      await api.post("/settings/running-text", { text: runningText });
      toast.success("Info Desa berhasil diperbarui!");
    } catch {
      toast.error("Gagal menyimpan Info Desa.");
    } finally {
      setSavingText(false);
    }
  };

  const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="print-container">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 font-heading">Dashboard Admin</h2>
          <p className="text-gray-500">Ringkasan aktivitas sistem Pemerintahan Desa Budur.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm transition-colors"
        >
          <Printer size={18} /> Cetak Laporan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Surat Menunggu</p>
            <p className="text-2xl font-bold text-gray-900">{stats.surat}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><MessageSquare size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Laporan Masuk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pengaduan}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Penduduk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.penduduk.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* Info Desa */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading flex items-center gap-2">
          <Megaphone className="text-gold" /> Kelola Info Desa (Running Text)
        </h3>
        <p className="text-gray-500 mb-4">Tambahkan pengumuman atau info penting yang akan tampil berjalan di halaman utama warga.</p>
        <div className="flex gap-4">
          <input
            type="text"
            value={runningText}
            onChange={(e) => setRunningText(e.target.value)}
            placeholder="Contoh: Pendaftaran BLT dibuka hari ini..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <button
            onClick={handleSaveText}
            disabled={savingText}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save size={18} /> {savingText ? "Menyimpan..." : "Simpan Info"}
          </button>
        </div>
      </div>

      {/* Chart dengan Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-heading flex items-center gap-2">
            <TrendingUp className="text-primary" /> Statistik Permohonan Surat
          </h3>
          <div className="flex items-center gap-3 no-print">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterTahun}
              onChange={e => setFilterTahun(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              {tahunOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filterBulan}
              onChange={e => setFilterBulan(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="all">Semua Bulan</option>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {filterBulan === "all"
            ? `Seluruh tahun ${filterTahun} — ${chartData.reduce((s, d) => s + d.total, 0)} permohonan`
            : `${MONTHS[filterBulan as number]} ${filterTahun} — ${chartData.reduce((s, d) => s + d.total, 0)} permohonan`}
        </p>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.length > 0 ? chartData : [{ name: "Belum ada data", total: 0 }]}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} dy={10} angle={-15} textAnchor="end" interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#F3F4F6" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="total" name="Permohonan" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
