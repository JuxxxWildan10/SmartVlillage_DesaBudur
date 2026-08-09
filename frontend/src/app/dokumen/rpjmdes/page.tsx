"use client";

import { FileText, Download, Target } from "lucide-react";

export default function RpjmdesPage() {
  const documents = [
    {
      id: 1,
      title: "RPJMDes Desa Budur 2024-2030",
      description: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) untuk periode 6 tahun ke depan, memuat visi, misi, dan arah kebijakan pembangunan desa.",
      size: "4.2 MB",
      date: "15 Jan 2024",
      link: "#"
    },
    {
      id: 2,
      title: "RKPDes Tahun 2026",
      description: "Rencana Kerja Pemerintah Desa (RKPDes) penjabaran dari RPJMDes untuk jangka waktu 1 tahun berjalan.",
      size: "2.1 MB",
      date: "10 Jan 2026",
      link: "#"
    },
    {
      id: 3,
      title: "RKPDes Tahun 2025",
      description: "Rencana Kerja Pemerintah Desa (RKPDes) penjabaran dari RPJMDes untuk tahun 2025.",
      size: "1.9 MB",
      date: "12 Jan 2025",
      link: "#"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Target size={16} /> Perencanaan Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">
            RPJMDes & RKPDes
          </h1>
          <p className="text-gray-600 text-lg">
            Dokumen perencanaan strategis dan rencana kerja pembangunan Desa Budur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{doc.title}</h2>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                {doc.description}
              </p>
              
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Diperbarui:</span> {doc.date} <br/>
                  <span className="font-medium">Ukuran:</span> {doc.size}
                </div>
                <a href={doc.link} className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  <Download size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
