"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Plus, Pencil, Trash2, X, Save, ChevronDown } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const emptyForm = { tahun: new Date().getFullYear(), jenis: "Pendapatan" as "Pendapatan"|"Belanja"|"Pembiayaan", bidang: "", uraian: "", anggaran: "", realisasi: "0" };

const formatRp = (v: number | string) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(v));

export default function AdminApbdes() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tahunList, setTahunList] = useState<number[]>([]);

  const fetch = async (t: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/apbdes?tahun=${t}`);
      setData(res.data.data || {});
      setTahunList(res.data.tahun_list || [t]);
    } catch { toast.error("Gagal memuat data APBDes."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(tahun); }, [tahun]);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm, tahun }); setModal(true); };
  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({ tahun: item.tahun, jenis: item.jenis, bidang: item.bidang, uraian: item.uraian, anggaran: item.anggaran, realisasi: item.realisasi });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/apbdes/${editId}`, form); toast.success("APBDes diperbarui."); }
      else { await api.post("/apbdes", form); toast.success("Item APBDes ditambahkan."); }
      setModal(false);
      fetch(tahun);
    } catch { toast.error("Gagal menyimpan."); }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({ title: "Hapus item ini?", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (!res.isConfirmed) return;
    try { await api.delete(`/apbdes/${id}`); toast.success("Item dihapus."); fetch(tahun); }
    catch { toast.error("Gagal menghapus."); }
  };

  const jenisColors: Record<string, string> = {
    Pendapatan: "bg-blue-100 text-blue-700",
    Belanja: "bg-orange-100 text-orange-700",
    Pembiayaan: "bg-purple-100 text-purple-700",
  };

  const allItems = data ? Object.values(data).flat() as any[] : [];
  const total = (jenis: string) => allItems.filter(i => i.jenis === jenis).reduce((s, i) => s + Number(i.anggaran), 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">APBDes</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola Anggaran Pendapatan dan Belanja Desa per tahun.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <select value={tahun} onChange={e => setTahun(Number(e.target.value))} className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-primary outline-none bg-white">
              {tahunList.length > 0 ? tahunList.map(t => <option key={t} value={t}>{t}</option>) : <option value={tahun}>{tahun}</option>}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
            <Plus size={18} /> Tambah Item
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Pendapatan", "Belanja", "Pembiayaan"].map(jenis => (
          <div key={jenis} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total {jenis}</p>
            <p className="text-xl font-bold text-gray-900">{formatRp(total(jenis))}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Bidang</th>
                <th className="px-6 py-4">Uraian</th>
                <th className="px-6 py-4">Anggaran</th>
                <th className="px-6 py-4">Realisasi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allItems.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-500">Belum ada data APBDes untuk tahun {tahun}.</td></tr>
              ) : allItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${jenisColors[item.jenis]}`}>{item.jenis}</span></td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.bidang}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.uraian}>{item.uraian}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatRp(item.anggaran)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatRp(item.realisasi)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Item APBDes" : "Tambah Item APBDes"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
                  <input required type="number" value={form.tahun} onChange={e => setForm({...form, tahun: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis *</label>
                  <select required value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900">
                    <option>Pendapatan</option><option>Belanja</option><option>Pembiayaan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bidang *</label>
                <input required type="text" placeholder="Cth: Dana Desa, Pembangunan" value={form.bidang} onChange={e => setForm({...form, bidang: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uraian *</label>
                <input required type="text" placeholder="Deskripsi singkat anggaran" value={form.uraian} onChange={e => setForm({...form, uraian: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anggaran (Rp) *</label>
                  <input required type="number" min="0" value={form.anggaran} onChange={e => setForm({...form, anggaran: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Realisasi (Rp)</label>
                  <input type="number" min="0" value={form.realisasi} onChange={e => setForm({...form, realisasi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
