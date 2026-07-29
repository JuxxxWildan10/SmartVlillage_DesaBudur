"use client";

import { useState, useEffect } from "react";
import { PieChart, BarChart } from "lucide-react";
import axios from "axios";

export default function StatistikPage() {
  const [statistik, setStatistik] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statistik`)
      .then(res => {
        if (res.data.status === "success") {
          setStatistik(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <PieChart size={16} /> Demografi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Statistik Kependudukan</h1>
          <p className="text-gray-600 text-lg">
            Transparansi data demografi warga Desa Budur berdasarkan sistem kependudukan terbaru.
          </p>
        </div>

        {loading ? (
          <div className="flex-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !statistik ? (
           <div className="text-center py-20 bg-white rounded-3xl">Gagal memuat data statistik.</div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <h3 className="text-lg text-gray-500 font-bold mb-2">Total Penduduk Terdaftar</h3>
              <div className="text-5xl font-heading font-extrabold text-primary">{statistik.total} <span className="text-xl text-gray-400 font-normal">Jiwa</span></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Gender */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <PieChart size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">Jenis Kelamin</h3>
                </div>
                <div className="space-y-4">
                  {statistik.jenis_kelamin.map((item: any, idx: number) => {
                    const percentage = Math.round((item.value / statistik.total) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                          <span>{item.label}</span>
                          <span>{item.value} Jiwa ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className={`h-3 rounded-full ${item.label === 'Laki-laki' ? 'bg-blue-500' : 'bg-pink-500'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pendidikan */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <BarChart size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">Tingkat Pendidikan</h3>
                </div>
                <div className="space-y-4">
                  {statistik.pendidikan.map((item: any, idx: number) => {
                    const percentage = Math.round((item.value / statistik.total) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                          <span>{item.label}</span>
                          <span>{item.value} Jiwa ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className="h-3 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pekerjaan */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <BarChart size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">Top 10 Pekerjaan Warga</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {statistik.pekerjaan.map((item: any, idx: number) => {
                    const percentage = Math.round((item.value / statistik.total) * 100);
                    return (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                          <span className="truncate pr-4">{item.label}</span>
                          <span className="shrink-0">{item.value} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-gold-dark" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
