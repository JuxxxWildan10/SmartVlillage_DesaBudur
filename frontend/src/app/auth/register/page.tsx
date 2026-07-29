"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", nik: "", rt: "", rw: "", password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/register", formData);
      const data = res.data.data;
      
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_nik", formData.nik);
      
      router.push("/warga");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Daftar Akun</h1>
          <p className="text-gray-500 mt-2 text-sm">Lengkapi data diri Anda untuk mengakses layanan Smart Village Budur.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
              placeholder="Sesuai KTP"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Induk Kependudukan (NIK)</label>
            <input 
              type="text" 
              required
              maxLength={16}
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
              placeholder="16 digit NIK"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">RT</label>
              <input 
                type="text" 
                required
                maxLength={3}
                value={formData.rt}
                onChange={(e) => setFormData({...formData, rt: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="001"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">RW</label>
              <input 
                type="text" 
                required
                maxLength={3}
                value={formData.rw}
                onChange={(e) => setFormData({...formData, rw: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="001"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md mt-6"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun? <Link href="/auth/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
