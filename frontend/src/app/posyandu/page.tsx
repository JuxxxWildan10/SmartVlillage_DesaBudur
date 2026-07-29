"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PosyanduPage() {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        // Because GET routes are public, we can use basic axios
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posyandu`);
        setJadwal(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJadwal();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-pink-500 rounded-full mb-4">
            <Calendar size={32} />
          </div>
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Jadwal Posyandu</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Layanan kesehatan balita dan ibu hamil. Pastikan Anda mencatat jadwal terdekat di lingkungan Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse h-48"></div>
            ))
          ) : jadwal.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500">Belum ada jadwal posyandu terdekat.</p>
            </div>
          ) : (
            jadwal.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-xs font-bold text-white
                  ${item.status === 'Terjadwal' ? 'bg-blue-500' : 
                    item.status === 'Selesai' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {item.status}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-4 group-hover:text-primary transition-colors">
                  {item.nama_kegiatan}
                </h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-primary shrink-0" />
                    <span>{new Date(item.tanggal_waktu).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary shrink-0" />
                    <span>{item.lokasi}</span>
                  </div>
                </div>

                {item.keterangan && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 italic">Catatan: {item.keterangan}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
