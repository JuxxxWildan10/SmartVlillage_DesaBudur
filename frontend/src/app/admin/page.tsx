"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, FileText, MessageSquare, TrendingUp, Printer, Save, Megaphone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    surat: 0,
    pengaduan: 0,
    penduduk: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [runningText, setRunningText] = useState("");
  const [savingText, setSavingText] = useState(false);

  useEffect(() => {
    // Fetch stats sequentially or via Promise.all. 
    // Since we don't have an aggregated admin stats endpoint, we'll fetch individually for prototype.
    const fetchStats = async () => {
      try {
        const [suratRes, pengaduanRes, dashRes, textRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surat`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pengaduan`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/running-text`)
        ]);

        const suratData = suratRes.data.data;
        setStats({
          surat: suratData.filter((s: any) => s.status === 'Menunggu').length,
          pengaduan: pengaduanRes.data.data.filter((p: any) => p.status === 'Menunggu').length,
          penduduk: dashRes.data.data.statistics.total_penduduk
        });
        
        if (textRes.data.status === 'success') {
          setRunningText(textRes.data.data.raw_admin || "");
        }

        // Calculate actual chart data from surat types
        const suratCounts: Record<string, number> = {};
        suratData.forEach((s: any) => {
          suratCounts[s.jenis_surat] = (suratCounts[s.jenis_surat] || 0) + 1;
        });
        
        const realChartData = Object.keys(suratCounts).map(key => ({
          name: key,
          total: suratCounts[key]
        }));
        setChartData(realChartData);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleSaveText = async () => {
    setSavingText(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/settings/running-text`, {
        text: runningText
      });
      toast.success("Info Desa berhasil diperbarui!");
    } catch (err) {
      toast.error("Gagal menyimpan Info Desa.");
    } finally {
      setSavingText(false);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Surat Menunggu</p>
            <p className="text-2xl font-bold text-gray-900">{stats.surat}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Laporan Masuk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pengaduan}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Penduduk</p>
            <p className="text-2xl font-bold text-gray-900">{stats.penduduk.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading flex items-center gap-2">
          <Megaphone className="text-gold" /> Kelola Info Desa (Running Text)
        </h3>
        <p className="text-gray-500 mb-4">Tambahkan pengumuman atau info penting yang akan tampil berjalan di halaman utama warga. Sistem juga akan otomatis menambahkan berita terbaru dan jadwal Posyandu terdekat.</p>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 font-heading flex items-center gap-2">
          <TrendingUp className="text-primary" /> Statistik Permohonan Surat (Bulan Ini)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.length > 0 ? chartData : [
                { name: 'Belum ada data', total: 0 }
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="total" fill="#0EA5E9" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
