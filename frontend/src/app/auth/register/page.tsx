"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nik: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error saat user mengetik
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi client-side: password harus sama
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setError("NIK harus 16 digit angka.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/register", {
        name: formData.nik, // akan di-override oleh nama_lengkap dari tabel penduduk
        nik: formData.nik,
        password: formData.password,
      });

      const data = res.data.data;

      // Simpan token & data user
      localStorage.setItem("auth_token",  data.token);
      localStorage.setItem("user_role",   data.role);
      localStorage.setItem("user_name",   data.user?.name || data.user?.nama_lengkap || "");
      localStorage.setItem("user_nik",    data.user?.nik || formData.nik);

      setSuccess(`Registrasi berhasil! Selamat datang, ${data.user?.nama_lengkap || data.user?.name}.`);

      // Redirect ke dashboard warga setelah 1.5 detik
      setTimeout(() => router.push("/warga"), 1500);
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.errors) {
        const firstError = Object.values(errData.errors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(errData?.message || "Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 relative z-10">

        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-24 mx-auto mb-4">
            <img src="/logo-cirebon.png" alt="Logo Cirebon" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Daftar Akun Warga</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Gunakan NIK yang terdaftar di Desa Budur untuk membuat akun layanan digital.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
          <p className="font-bold mb-1">📋 Syarat Registrasi</p>
          <p>NIK Anda harus sudah terdaftar sebagai warga Desa Budur di sistem kependudukan. Hubungi kantor desa jika NIK belum terdaftar.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-4 border border-red-100 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm mb-4 border border-green-100 font-medium flex items-center gap-2">
            <CheckCircle size={18} className="shrink-0" />
            {success}
          </div>
        )}

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
              disabled={loading || !!success}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 tracking-widest text-lg disabled:bg-gray-50"
              placeholder="Masukkan 16 digit NIK"
            />
            <p className="text-xs text-gray-400 mt-1">Nama dan data Anda akan diambil otomatis dari data kependudukan desa.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Buat Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              disabled={loading || !!success}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 disabled:bg-gray-50"
              placeholder="Minimal 8 karakter (huruf + angka)"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading || !!success}
              className={`w-full px-4 py-3 rounded-xl border transition-all text-gray-900 focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 focus:border-primary"
              }`}
              placeholder="Ulangi password Anda"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Password tidak cocok.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memverifikasi NIK...
              </>
            ) : success ? (
              <>
                <CheckCircle size={18} />
                Berhasil! Mengalihkan...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-primary font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
