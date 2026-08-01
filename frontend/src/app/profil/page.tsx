"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import axios from "axios";
import { Users, History, Target, ShieldCheck } from "lucide-react";


export default function ProfilDesa() {
  const [aparaturList, setAparaturList] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/aparatur`)
      .then(res => {
        if (res.data.status === 'success') setAparaturList(res.data.data);
      })
      .catch(() => {
        // Fallback: gunakan data placeholder agar halaman tetap tampil
        setAparaturList([
          { id: 1, nama_lengkap: 'Sandar Wiguna, S.E.', jabatan: 'Kuwu (Kepala Desa)', foto: null },
          { id: 2, nama_lengkap: 'Budi Santoso', jabatan: 'Sekretaris Desa', foto: null },
        ]);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-primary pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Profil Desa Budur</h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto">Mengenal lebih dekat sejarah, visi, dan misi desa kami menuju kesejahteraan dan kemandirian bersama.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100 relative z-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block px-4 py-2 bg-green-50 text-primary rounded-full text-sm font-bold mb-4">
                Sejarah Kami
              </div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Jejak Langkah Ki Brajanata</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Desa Budur, yang terletak di Kecamatan Ciwaringin, Kabupaten Cirebon, memiliki sejarah yang sangat lekat dengan legenda pewayangan dan penyebaran agama Islam di Jawa Barat. Sejarah desa ini bermula dari kisah <strong>Ki Brajanata</strong>, seorang tokoh sakti mandraguna pada masa Prabu Siliwangi hingga Sunan Gunung Jati.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Konon, Ki Brajanata yang sering mengembara akhirnya memutuskan untuk menetap di sebuah hutan pada bulan Sura (Muharram). Hutan tersebut kemudian dinamakan <strong>Hutan Sura</strong>, yang menjadi cikal bakal wilayah Desa Budur. Interaksi beliau dengan Sunan Gunung Jati juga menandai masa penyebaran Islam yang kuat di kawasan ini.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hingga kini, Desa Budur masih memelihara peninggalan sejarah dan legenda tersebut, salah satunya adalah keberadaan situs <strong>Sumur Kayu Walang</strong> yang dipercaya masyarakat sebagai tempat pemandian para bidadari, serta <strong>Sumur Mesni</strong>.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg border-4 border-white relative group">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500"></div>
                <img src="https://images.unsplash.com/photo-1596423735880-5c621434c9c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pemandangan Desa" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">Visi</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              "Terwujudnya Desa Budur yang Mandiri, Sejahtera, Cerdas, dan Berbudaya melalui Tata Kelola Pemerintahan yang Bersih dan Inovatif."
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
            <div className="w-14 h-14 bg-green-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">Misi</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <span>Meningkatkan kualitas pelayanan publik berbasis teknologi cerdas (Smart Village).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <span>Mendorong kemandirian ekonomi masyarakat melalui pemberdayaan UMKM dan BUMDes.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <span>Menjaga kelestarian lingkungan dan budaya gotong royong warga.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-500 rounded-full mb-4">
            <Users size={32} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900">Struktur Organisasi Desa</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Jajaran aparatur yang siap melayani dengan sepenuh hati.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {aparaturList.length === 0 ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded mx-auto w-1/2" />
              </div>
            ))
          ) : (
            aparaturList.map((person: any, idx: number) => (
              <div key={person.id || idx} className="bg-white p-6 rounded-2xl text-center shadow-sm border border-gray-100 hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={person.foto
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}${person.foto}`
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama_lengkap}`}
                    alt={person.nama_lengkap}
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </div>
                <h4 className="font-bold text-gray-900">{person.nama_lengkap}</h4>
                <p className="text-sm text-primary font-medium">{person.jabatan}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
