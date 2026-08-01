"use client";

import { TrendingUp, FileText, RefreshCw, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

export default function TransparansiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tahunList, setTahunList] = useState<number[]>([]);

  const fetchData = (selectedTahun: number) => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apbdes?tahun=${selectedTahun}`)
      .then(res => {
        if (res.data.status === "success") {
          setData(res.data.data);
          setTahunList(res.data.tahun_list || [selectedTahun]);
        }
      })
      .catch(err => console.error("Error fetching APBDes:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(tahun); }, [tahun]);

  const totalPendapatan = data?.Pendapatan?.reduce((s: number, i: any) => s + Number(i.anggaran), 0) ?? 0;
  const totalBelanja    = data?.Belanja?.reduce((s: number, i: any) => s + Number(i.anggaran), 0) ?? 0;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <TrendingUp size={16} /> Transparansi Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">
            Anggaran Pendapatan dan Belanja Desa
          </h1>
          <p className="text-gray-600 text-lg">
            Bentuk komitmen Desa Budur dalam mewujudkan tata kelola pemerintahan yang bersih, transparan, dan akuntabel.
          </p>
        </div>

        {/* Pilih Tahun */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <select
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3 pr-10 font-bold text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm"
            >
              {tahunList.length > 0 ? tahunList.map(t => (
                <option key={t} value={t}>Tahun Anggaran {t}</option>
              )) : (
                <option value={tahun}>Tahun Anggaran {tahun}</option>
              )}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-primary mb-3" />
            <p className="text-gray-500">Memuat data anggaran...</p>
          </div>
        ) : !data || (Object.keys(data).length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <TrendingUp size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Data APBDes untuk tahun {tahun} belum tersedia.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Tahun Anggaran {tahun}</h2>
              <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">Disahkan melalui Musdes</div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              {/* PENDAPATAN */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-gray-900">Pendapatan Desa</h3>
                </div>
                <div className="space-y-4">
                  {(data.Pendapatan || []).map((item: any) => {
                    const pct = totalPendapatan > 0 ? Math.round((item.anggaran / totalPendapatan) * 100) : 0;
                    return (
                      <div key={item.id} className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{item.uraian}</span>
                          <span className="font-bold text-gray-900">{formatRupiah(item.anggaran)}</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-500">Total Pendapatan</span>
                    <span className="text-2xl font-black text-blue-700">{formatRupiah(totalPendapatan)}</span>
                  </div>
                </div>
              </div>

              {/* BELANJA */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-gray-900">Belanja Desa</h3>
                </div>
                <div className="space-y-4">
                  {(data.Belanja || []).map((item: any) => {
                    const pct = totalBelanja > 0 ? Math.round((item.anggaran / totalBelanja) * 100) : 0;
                    return (
                      <div key={item.id} className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{item.uraian}</span>
                          <span className="font-bold text-gray-900">{formatRupiah(item.anggaran)}</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-500">Total Belanja</span>
                    <span className="text-2xl font-black text-orange-700">{formatRupiah(totalBelanja)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
