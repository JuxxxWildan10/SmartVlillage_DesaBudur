"use client";

import { Construction, MapPin, Calendar, CheckCircle } from "lucide-react";

export default function PembangunanPage() {
  const dummyProyek = [
    {
      id: 1,
      nama: "Pembangunan Saluran Irigasi Blok A",
      lokasi: "Dusun 1, RT 02 / RW 01",
      anggaran: 150000000,
      sumber: "Dana Desa (DD)",
      status: "Selesai",
      progress: 100,
      tahun: 2026,
    },
    {
      id: 2,
      nama: "Pengaspalan Jalan Poros Desa",
      lokasi: "Dusun 2, RT 05 / RW 02",
      anggaran: 250000000,
      sumber: "Bantuan Provinsi (Banprov)",
      status: "Berjalan",
      progress: 65,
      tahun: 2026,
    },
    {
      id: 3,
      nama: "Rehabilitasi Gedung Posyandu Melati",
      lokasi: "Dusun 3, RT 08 / RW 03",
      anggaran: 75000000,
      sumber: "Dana Desa (DD)",
      status: "Perencanaan",
      progress: 0,
      tahun: 2026,
    }
  ];

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Construction size={16} /> Transparansi Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">
            Proyek Pembangunan Desa
          </h1>
          <p className="text-gray-600 text-lg">
            Informasi perkembangan dan rincian proyek pembangunan infrastruktur di Desa Budur.
          </p>
        </div>

        <div className="grid gap-6">
          {dummyProyek.map((proyek) => (
            <div key={proyek.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{proyek.nama}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {proyek.lokasi}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16} className="text-gray-400" /> Tahun {proyek.tahun}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    proyek.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    proyek.status === 'Berjalan' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {proyek.status === 'Selesai' && <CheckCircle size={14} />}
                    {proyek.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Anggaran</p>
                  <p className="font-bold text-gray-900 text-lg">{formatRupiah(proyek.anggaran)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sumber Dana</p>
                  <p className="font-medium text-gray-900">{proyek.sumber}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Progress Pembangunan</span>
                  <span className="font-bold text-primary">{proyek.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${proyek.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                    style={{ width: `${proyek.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
