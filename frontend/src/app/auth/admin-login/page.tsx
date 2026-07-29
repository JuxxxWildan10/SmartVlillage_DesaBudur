"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, XCircle, X } from "lucide-react";
import api from "@/lib/axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorModal({ show: false, message: "" });

    try {
      const res = await api.post("/login", { email, password });
      const data = res.data.data;
      
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.role);
      
      if (data.role === "Admin" || data.role === "Perangkat Desa" || data.role === "Super Admin") {
        router.push("/admin");
      } else {
        setErrorModal({ show: true, message: "Akses ditolak. Halaman ini khusus Perangkat Desa." });
      }
    } catch (err: any) {
      setErrorModal({ show: true, message: "Email atau Password salah! Akses ditolak." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
            <Lock size={32} />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-white">System Access</h1>
          <p className="text-gray-400 mt-1 text-sm">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-white placeholder-gray-500"
              placeholder="Email Admin/Perangkat"
            />
          </div>
          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-white placeholder-gray-500"
              placeholder="Password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md mt-4"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>

      {/* Security Alert Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-red-500/30 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center flex-shrink-0 border border-red-500/50">
                <XCircle size={24} />
              </div>
              <button 
                onClick={() => setErrorModal({ show: false, message: "" })}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white font-heading mb-2">Security Alert</h3>
            <p className="text-gray-400 text-sm mb-6">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ show: false, message: "" })}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all border border-gray-600"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
