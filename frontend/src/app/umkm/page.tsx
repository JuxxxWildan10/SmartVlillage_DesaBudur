"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Store, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UmkmPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/umkm`)
      .then(res => {
        if (res.data.status === "success") {
          setProducts(res.data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-gold-light/20 text-yellow-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Store size={16} /> Ekonomi Desa
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black font-heading mb-4">Katalog BUMDes & UMKM</h1>
          <p className="text-gray-800 text-lg">
            Dukung pertumbuhan ekonomi lokal dengan berbelanja produk asli karya warga Desa Budur.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={`skel-${i}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <ShoppingBag size={64} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-bold text-black font-heading">Belum ada produk</h3>
                <p className="text-gray-800">Saat ini belum ada produk UMKM yang didaftarkan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {product.foto ? (
                        <img src={product.foto.startsWith('http') ? product.foto : `${process.env.NEXT_PUBLIC_BASE_URL}${ product.foto }`} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex-center text-gray-400 bg-gray-100">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                      {product.kategori && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-black border border-gray-200">
                          {product.kategori}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-black text-lg mb-1 truncate">{product.nama_produk}</h3>
                      <p className="text-gray-800 text-sm mb-2 line-clamp-2">{product.deskripsi}</p>
                      
                      {product.lokasi && (
                        <p className="text-xs text-gray-800 mb-4 flex items-start gap-1">
                          <span className="font-bold text-black">📍</span> {product.lokasi}
                        </p>
                      )}

                      <div className="flex flex-col gap-3 mt-auto">
                        <span className="font-bold text-black text-lg">Rp {Number(product.harga).toLocaleString('id-ID')}</span>
                        {product.nomor_wa ? (
                          <a 
                            href={`https://wa.me/${product.nomor_wa.replace(/^0/, '62')}?text=Halo, saya tertarik dengan produk ${product.nama_produk} yang ada di katalog Smart Village.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            Beli via WhatsApp
                          </a>
                        ) : (
                          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-70">
                            Nomor WA Belum Tersedia
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
