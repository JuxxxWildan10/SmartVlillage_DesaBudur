"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nik: "", wa: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      alert("NIK harus 16 digit angka.");
      return;
    }
    if (formData.wa.length < 9 || !/^\d+$/.test(formData.wa)) {
      alert("Masukkan nomor WhatsApp yang valid (contoh: 08123456789).");
      return;
    }

    // Nomor WA Admin Desa (Default placeholder, bisa diganti nanti)
    const adminWA = "6281234567890";
    
    // Format teks pesan WhatsApp
    const message = `Halo Admin Desa Budur,%0A%0ASaya ingin mengajukan reset password untuk akun Smart Village.%0A%0ANIK: ${formData.nik}%0ANo. WhatsApp Aktif: ${formData.wa}%0A%0AMohon bantuannya untuk mereset password akun saya. Terima kasih.`;
    
    // Buka WhatsApp di tab baru
    window.open(`https://wa.me/${adminWA}?text=${message}`, "_blank");
    
    // Kembali ke login setelah mengarahkan ke WA
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 relative z-10">

        <Link href="/auth/login" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-24 mx-auto mb-4">
            <img src="/logo-cirebon.png" alt="Logo Cirebon" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Lupa Password?</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Masukkan NIK dan Nomor WhatsApp Anda. Permintaan reset password akan dikirim ke Admin Desa melalui WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NIK */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nomor Induk Kependudukan (NIK)
            </label>
            <input
              type="text"
              name="nik"
              required
              maxLength={16}
              value={formData.nik}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 tracking-widest text-lg"
              placeholder="Masukkan 16 digit NIK"
            />
          </div>

          {/* Nomor WA */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp Aktif</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                +62
              </span>
              <input
                type="text"
                name="wa"
                required
                value={formData.wa}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="81234567890"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Gunakan awalan 8 (contoh: 81234567890)</p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
          >
            Hubungi Admin Desa <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
