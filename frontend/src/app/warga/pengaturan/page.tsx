"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { ShieldCheck, Lock, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function WargaPengaturanPage() {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.new_password !== formData.new_password_confirmation) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/change-password", formData);
      toast.success(res.data.message || "Password berhasil diubah!");
      
      // Reset form
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.errors) {
        const firstError = Object.values(errData.errors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(errData?.message || "Gagal mengubah password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold font-heading">Keamanan Akun</h2>
          </div>
          <p className="text-primary-100 opacity-90 max-w-xl text-sm leading-relaxed">
            Demi keamanan privasi Anda, kami sangat menyarankan untuk mengganti password default (bawaan) yang diberikan oleh Admin dengan password pribadi Anda sendiri.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <Lock size={160} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Ganti Password
          </h3>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                name="current_password"
                required
                value={formData.current_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="Masukkan password lama Anda"
              />
            </div>

            <hr className="border-gray-100 my-4" />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password Baru
              </label>
              <input
                type="password"
                name="new_password"
                required
                minLength={8}
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="Minimal 8 karakter (huruf + angka)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="new_password_confirmation"
                required
                value={formData.new_password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900"
                placeholder="Ulangi password baru Anda"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan Password Baru
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
