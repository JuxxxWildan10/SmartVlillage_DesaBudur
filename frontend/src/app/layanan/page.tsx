"use client";

import Link from "next/link";
import { FileText, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function LayananPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary-dark px-4 py-2 rounded-full font-medium text-sm mb-4">
            Layanan Digital Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black font-heading mb-4">Pusat Layanan Warga</h1>
          <p className="text-gray-800 text-lg">
            Akses berbagai layanan administrasi dan pelaporan secara cepat, mudah, dan transparan melalui portal Smart Village.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/layanan/surat" className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading mb-3">e-Surat</h3>
            <p className="text-gray-600 mb-6 line-clamp-3">
              Ajukan surat keterangan (SKU, SKTM, Pengantar) secara mandiri dari mana saja tanpa harus mengantre di balai desa.
            </p>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
              Mulai Pengajuan <ArrowRight size={18} />
            </div>
          </Link>

          <Link href="/pengaduan" className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading mb-3">Pengaduan</h3>
            <p className="text-gray-600 mb-6 line-clamp-3">
              Sampaikan laporan, keluhan, aspirasi, atau masukan untuk pembangunan desa yang lebih baik dengan identitas yang dilindungi.
            </p>
            <div className="flex items-center gap-2 text-red-600 font-bold group-hover:gap-3 transition-all">
              Buat Laporan <ArrowRight size={18} />
            </div>
          </Link>

          <Link href="/bansos" className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 group">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeartHandshake size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-heading mb-3">Bantuan Sosial</h3>
            <p className="text-gray-600 mb-6 line-clamp-3">
              Periksa status penerimaan program bantuan sosial secara mandiri dan transparan menggunakan Nomor Kartu Keluarga.
            </p>
            <div className="flex items-center gap-2 text-amber-600 font-bold group-hover:gap-3 transition-all">
              Cek Status Bansos <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
