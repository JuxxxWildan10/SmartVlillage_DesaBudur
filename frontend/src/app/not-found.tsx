"use client";

import Link from "next/link";
import { Home, MapPinOff, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPinOff size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-8xl font-black text-gray-900 font-heading tracking-tighter mb-2">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-heading mb-4 leading-tight">
          Waduh! Sepertinya Anda nyasar dari balai desa.
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Halaman yang Anda cari di portal Smart Village Desa Budur mungkin telah dipindahkan, dihapus, atau memang tidak pernah ada.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-gray-700 font-bold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} /> Beranda Desa
          </Link>
        </div>
      </div>
    </div>
  );
}
