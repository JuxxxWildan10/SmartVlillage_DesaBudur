"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, Pencil, Trash2, X, Save, Badge } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const emptyForm = { nama_lengkap: "", jabatan: "", niap: "", status: "Aktif" };

export default function AdminAparatur() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/aparatur");
      setList(res.data.data || []);
    } catch { toast.error("Gagal memuat data aparatur."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setModal(true); };
  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({ nama_lengkap: item.nama_lengkap, jabatan: item.jabatan, niap: item.niap || "", status: item.status });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/aparatur/${editId}`, form);
        toast.success("Data aparatur diperbarui.");
      } else {
        await api.post("/aparatur", form);
        toast.success("Aparatur berhasil ditambahkan.");
      }
      setModal(false);
      fetch();
    } catch { toast.error("Gagal menyimpan data."); }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({ title: "Hapus Aparatur?", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (!res.isConfirmed) return;
    try { await api.delete(`/aparatur/${id}`); toast.success("Aparatur dihapus."); fetch(); }
    catch { toast.error("Gagal menghapus."); }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Aparatur Desa</h2>
          <p className="text-gray-500 text-sm mt-1">Manajemen data perangkat dan aparatur Desa Budur.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
          <Plus size={18} /> Tambah Aparatur
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Jabatan</th>
                <th className="px-6 py-4">NIAP</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-500">Belum ada data. Klik tombol Tambah Aparatur.</td></tr>
              ) : list.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                        {item.nama_lengkap.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{item.nama_lengkap}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.jabatan}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{item.niap || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Aparatur" : "Tambah Aparatur"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input required type="text" value={form.nama_lengkap} onChange={e => setForm({...form, nama_lengkap: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan *</label>
                <input required type="text" value={form.jabatan} placeholder="Cth: Kepala Desa, Kasi Pelayanan" onChange={e => setForm({...form, jabatan: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIAP (opsional)</label>
                <input type="text" value={form.niap} placeholder="Nomor Induk Aparatur Pemdes" onChange={e => setForm({...form, niap: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900">
                  <option>Aktif</option>
                  <option>Non-Aktif</option>
                </select>
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
