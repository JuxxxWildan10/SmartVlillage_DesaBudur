import MapContainer from "@/components/gis/MapContainer";
import { Map, Info } from "lucide-react";

export const metadata = {
  title: "Peta Desa Budur - Smart Village",
  description: "Sistem Informasi Geografis (GIS) pemetaan wilayah Desa Budur.",
};

export default function GisPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Map size={16} /> GIS Terintegrasi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Peta Interaktif Desa</h1>
          <p className="text-gray-600 max-w-3xl text-lg">
            Jelajahi batas administrasi, infrastruktur, dan tata ruang Desa Budur secara real-time melalui integrasi Sistem Informasi Geografis (GIS).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <MapContainer />
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Info size={20} className="text-blue" /> Legenda Peta
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#1B5E20] border-2 border-[#1B5E20]"></div>
                  <span className="text-base font-semibold text-gray-900">Batas Desa Budur</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#D4AF37] border-2 border-[#D4AF37]"></div>
                  <span className="text-base font-semibold text-gray-900">Batas Dusun/RW</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span className="text-base font-semibold text-gray-900">Fasilitas Umum</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-dark text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Map size={120} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 relative z-10">Informasi Pemetaan</h3>
              <p className="text-base text-gray-100 relative z-10 leading-relaxed font-medium">
                Peta batas wilayah ini dibuat untuk mempermudah transparansi dan tata kelola desa. Pembaruan data dilakukan secara berkala oleh Pemerintah Desa Budur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
