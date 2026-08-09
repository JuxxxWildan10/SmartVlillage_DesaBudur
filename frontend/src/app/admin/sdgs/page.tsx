"use client";

import { useState, useEffect } from "react";
import { Target, Pencil, X, Save, Info } from "lucide-react";
import axios from "axios";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const SDG_ICONS = ["🚫","🌾","🍎","❤️","🎓","💧","☀️","💼","🏗️","🔬","⚖️","🏙️","🔁","🌊","🌿","🕊️","🤝"];

export default function AdminSdgs() {
  const [goals, setGoals] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any>(null);
  const [newScore, setNewScore] = useState("");

  const fetch = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sdgs`);
      if (res.data.status === "success") {
        setScores(res.data.data || []);
      }
    } catch { toast.error("Gagal memuat data SDGs."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openEdit = (item: any) => { setEditItem(item); setNewScore(String(item.score)); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const scoreVal = parseFloat(newScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      toast.error("Skor harus antara 0-100.");
      return;
    }
    try {
      const response = await api.put(`/sdgs/${editItem.id}`, { score: scoreVal });
      if (response.data.status === "success") {
        toast.success(`Skor SDG ${editItem.goal_number} diperbarui menjadi ${scoreVal}.`);
        setScores(prev => prev.map(s => s.id === editItem.id ? {...s, score: scoreVal} : s));
        setEditItem(null);
      }
    } catch { toast.error("Gagal menyimpan skor."); }
  };

  const getColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-400";
    if (score >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-heading">SDGs Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Pantau dan perbarui capaian Tujuan Pembangunan Berkelanjutan (SDGs) Desa Budur.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-6">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Data skor SDGs diperbarui secara berkala. Untuk memperbarui, klik ikon pensil pada goal yang ingin diubah.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Belum ada data skor SDGs. Pastikan seeder SmartVillageSeeder sudah dijalankan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scores.map((item) => {
            const goalNum = item.goal_number;
            const icon = SDG_ICONS[goalNum] || "🎯";
            return (
              <div key={goalNum} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100" style={{ backgroundColor: item.color_hex + "20" }}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SDG {goalNum}</p>
                      <p className="font-bold text-gray-900 text-sm leading-snug max-w-[160px]">{item.title}</p>
                    </div>
                  </div>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0">
                    <Pencil size={15} />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Capaian</span>
                    <span className="font-black text-lg" style={{ color: item.color_hex }}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getColor(item.score)}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">SDG {editItem.goal_number}</p>
                <h3 className="text-lg font-bold text-gray-900">{editItem.title}</h3>
              </div>
              <button onClick={() => setEditItem(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skor Capaian (0–100)</label>
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={newScore}
                  onChange={e => setNewScore(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900 text-2xl font-bold"
                />
                <span className="text-2xl font-bold text-gray-400">%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getColor(parseFloat(newScore) || 0)}`}
                  style={{ width: `${Math.min(parseFloat(newScore) || 0, 100)}%` }}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditItem(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
