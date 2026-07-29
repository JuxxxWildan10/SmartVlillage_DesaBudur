"use client";

import { TrendingUp, FileText } from "lucide-react";

export default function TransparansiPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <TrendingUp size={16} /> Transparansi Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Anggaran Pendapatan dan Belanja Desa (APBDes)</h1>
          <p className="text-gray-600 text-lg">
            Bentuk komitmen Desa Budur dalam mewujudkan tata kelola pemerintahan yang bersih, transparan, dan akuntabel.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Tahun Anggaran 2026</h2>
            <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">Disahkan melalui Musdes</div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {/* PENDAPATAN */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex-center">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900">Pendapatan Desa</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Pendapatan Asli Desa (PADes)</span>
                    <span className="font-bold text-gray-900">Rp 150.000.000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '15%'}}></div></div>
                </div>
                
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Dana Desa (Pusat)</span>
                    <span className="font-bold text-gray-900">Rp 850.000.000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div></div>
                </div>

                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Alokasi Dana Desa (Kabupaten)</span>
                    <span className="font-bold text-gray-900">Rp 350.000.000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div></div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-500">Total Pendapatan</span>
                  <span className="text-2xl font-black text-blue-700">Rp 1.350.000.000</span>
                </div>
              </div>
            </div>

            {/* BELANJA */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex-center">
                  <FileText size={24} />
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900">Belanja Desa</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bidang Penyelenggaraan Pemerintahan</span>
                    <span className="font-bold text-gray-900">Rp 400.000.000</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{width: '30%'}}></div></div>
                </div>
                
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bidang Pelaksanaan Pembangunan</span>
                    <span className="font-bold text-gray-900">Rp 600.000.000</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{width: '45%'}}></div></div>
                </div>

                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bidang Pembinaan Kemasyarakatan</span>
                    <span className="font-bold text-gray-900">Rp 150.000.000</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{width: '12%'}}></div></div>
                </div>
                
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Bidang Pemberdayaan Masyarakat (UMKM)</span>
                    <span className="font-bold text-gray-900">Rp 200.000.000</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full" style={{width: '13%'}}></div></div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-500">Total Belanja</span>
                  <span className="text-2xl font-black text-orange-700">Rp 1.350.000.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
