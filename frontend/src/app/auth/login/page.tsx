"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LogIn, ArrowLeft, XCircle, X } from "lucide-react";
import api from "@/lib/axios";

import { Suspense } from "react";

function LoginForm() {
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Panggil API Laravel via interceptor
      const res = await api.post("/login", {
        email: nik, // For login, controller expects email parameter (which maps to NIK for Warga)
        password: password
      });

        if (res.data.status === 'success') {
        const { role, user, token } = res.data.data;
        
        // Simpan data user ke localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("user_role", role);
        localStorage.setItem("user_nik", user.email); // NIK tersimpan di kolom email

        // Redirect sesuai role
        const adminRoles = ['Admin', 'Super Admin', 'Perangkat Desa', 'Staff'];
        if (adminRoles.includes(role)) {
          router.push('/admin');
        } else if (role === 'Kepala Desa') {
          router.push('/kepaladesa');
        } else if (role === 'Warga') {
          router.push(searchParams.get("redirect") || '/warga');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      setErrorModal({ 
        show: true, 
        message: error.response?.data?.message || 'Login gagal, periksa NIK dan Password Anda.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
        <div className="flex justify-center">
          <div className="w-20 h-24 mb-4">
            <img src="/logo-cirebon.png" alt="Logo Cirebon" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 font-heading">
          Portal Layanan Warga
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Silakan masuk menggunakan NIK dan Password Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-primary/5 sm:rounded-3xl sm:px-10 border border-gray-100">
          
          {searchParams.get("redirect") === "/layanan/surat" && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
              Anda harus masuk terlebih dahulu untuk menggunakan fitur pengajuan e-Surat.
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor Induk Kependudukan (NIK)</label>
              <div className="mt-1">
                <input 
                  type="text" 
                  required 
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary transition-all"
                  placeholder="Masukkan 16 digit NIK"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input 
                  type="password" 
                  required 
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ingat saya</label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary-dark">Lupa password?</Link>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Masuk <LogIn size={18} /></>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Belum memiliki akun? <Link href="/auth/register" className="text-primary font-bold hover:underline">Daftar Sekarang</Link>
          </div>
        </div>
      </div>

      {/* Custom Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-red-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex-center flex-shrink-0">
                <XCircle size={24} />
              </div>
              <button 
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">Login Gagal</h3>
            <p className="text-gray-600 text-sm mb-6">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ show: false, message: "" })}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all"
            >
              Tutup & Coba Lagi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

      <Suspense fallback={<div className="text-center relative z-10">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
