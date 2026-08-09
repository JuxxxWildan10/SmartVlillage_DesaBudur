"use client";

import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-6">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Terakhir diperbarui: 1 Agustus 2026</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Pengantar</h2>
            <p>
              Pemerintah Desa Budur ("kami", "milik kami", atau "kita") menghormati privasi Anda dan berkomitmen untuk melindunginya melalui kepatuhan kami terhadap kebijakan ini. Kebijakan ini menjelaskan jenis informasi yang mungkin kami kumpulkan dari Anda atau yang mungkin Anda berikan saat Anda mengunjungi situs web Smart Village Desa Budur.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan beberapa jenis informasi dari dan tentang pengguna situs web kami, termasuk informasi:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Yang dapat digunakan untuk mengidentifikasi Anda secara pribadi, seperti nama, alamat pos, alamat email, nomor telepon, atau NIK (untuk keperluan layanan administrasi desa).</li>
              <li>Tentang koneksi internet Anda, peralatan yang Anda gunakan untuk mengakses situs web kami, dan detail penggunaan.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>
              Kami menggunakan informasi yang kami kumpulkan tentang Anda atau yang Anda berikan kepada kami, termasuk informasi pribadi apa pun:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Untuk menampilkan situs web kami dan isinya kepada Anda.</li>
              <li>Untuk memberi Anda informasi, produk, atau layanan yang Anda minta dari kami (misalnya: pembuatan surat pengantar).</li>
              <li>Untuk memenuhi tujuan lain yang Anda berikan.</li>
              <li>Untuk menjalankan kewajiban dan menegakkan hak kami yang timbul dari kontrak apa pun yang disepakati antara Anda dan kami.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Keamanan Data</h2>
            <p>
              Kami telah menerapkan langkah-langkah yang dirancang untuk mengamankan informasi pribadi Anda dari kehilangan yang tidak disengaja dan dari akses, penggunaan, perubahan, dan pengungkapan yang tidak sah. Semua informasi yang Anda berikan kepada kami disimpan di server aman kami di balik firewall.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
