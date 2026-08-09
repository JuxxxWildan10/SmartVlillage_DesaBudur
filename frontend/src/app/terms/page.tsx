"use client";

import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-6">
              <Scale size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">Terms of Service</h1>
            <p className="text-gray-500">Terakhir diperbarui: 1 Agustus 2026</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses atau menggunakan platform Smart Village Desa Budur, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan semua syarat dan ketentuan ini, maka Anda tidak diizinkan untuk menggunakan platform ini.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Penggunaan Layanan</h2>
            <p>
              Platform ini ditujukan khusus untuk warga dan masyarakat yang berkepentingan dengan Desa Budur. Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Anda tidak diperbolehkan memberikan informasi palsu atau menyesatkan saat menggunakan layanan administrasi.</li>
              <li>Anda tidak diperbolehkan menggunakan platform ini untuk menyebarkan konten yang melanggar hukum, menyinggung, atau berbahaya.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Akun Pengguna</h2>
            <p>
              Jika Anda membuat akun di platform kami, Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda serta membatasi akses ke komputer atau perangkat Anda. Pemerintah Desa Budur berhak menolak layanan, menghentikan akun, atau membatalkan permintaan layanan jika terbukti ada penyalahgunaan.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Perubahan Layanan</h2>
            <p>
              Kami berhak sewaktu-waktu mengubah atau menghentikan, sementara atau selamanya, layanan (atau bagiannya) dengan atau tanpa pemberitahuan. Anda setuju bahwa kami tidak akan bertanggung jawab kepada Anda atau pihak ketiga mana pun atas modifikasi, penangguhan, atau penghentian layanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
