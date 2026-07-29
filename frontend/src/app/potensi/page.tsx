"use client";

import Image from "next/image";
import { MapPin, Image as ImageIcon, Sparkles } from "lucide-react";

export default function PotensiPage() {
  const potensiList = [
    {
      title: "Sentra Industri Genteng Budur",
      category: "Ekonomi UMKM",
      desc: "Tulang punggung ekonomi warga di sepanjang Blok Jembatan Merah. Perajin lokal menghasilkan genteng tanah liat berkualitas super yang bersaing dengan produk Jatiwangi.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Situs Sejarah Sumur Kayu Walang",
      category: "Wisata Sejarah",
      desc: "Peninggalan sejarah yang erat kaitannya dengan legenda Ki Brajanata. Konon dipercaya sebagai tempat pemandian bidadari, cocok untuk wisata budaya dan religi.",
      image: "https://images.unsplash.com/photo-1579760773954-473d574bb462?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Wanawisata Hutan Kayu Putih",
      category: "Wisata Alam",
      desc: "Kawasan ekowisata di Ciwaringin yang menawarkan pemandangan asri pohon kayu putih, area perkemahan, dan fasilitas pemancingan untuk wisata keluarga.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db8855?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Sparkles size={16} /> Potensi Unggulan
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Galeri Potensi Desa</h1>
          <p className="text-gray-600 text-lg">
            Menjelajahi pesona alam, budaya, dan kreativitas warga Desa Budur.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {potensiList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1">
                  <ImageIcon size={12} /> {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
                  <MapPin size={16} /> Lihat Lokasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
