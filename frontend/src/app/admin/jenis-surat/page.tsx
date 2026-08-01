"use client";

import { useState, useEffect } from "react";
import { ScrollText, Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const emptyForm = { kode_surat: "", nama_surat: "", persyaratan: "", is_active: true };

export default function AdminJenisSurat() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch = async () => {
    setLoading(true);
    try {
      // Fetch all including inactive for admin
      const res = await api.get("/master-surat");
      setList(res.data.data || []);
    } catch { toast.error("Gagal memuat data."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setModal(true); };
  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({ kode_surat: item.kode_surat, nama_surat: item.nama_surat, persyaratan: item.persyaratan || "", is_active: item.is_active });
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/master-surat/${editId}`, form); toast.success("Jenis surat diperbarui."); }
      else { await api.post("/master-surat", form); toast.success("Jenis surat ditambahkan."); }
      setModal(false);
      fetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan.");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({ title: "Hapus Jenis Surat?", text: "Ini akan memengaruhi form pengajuan surat.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (!res.isConfirmed) return;
    try { await api.delete(`/master-surat/${id}`); toast.success("Jenis surat dihapus."); fetch(); }
    catch { toast.error("Gagal menghapus."); }
  };

  const toggleActive = async (item: any) => {
    try {
      await api.put(`/master-surat/${item.id}`, { ...item, is_active: !item.is_active });
      toast.success(`Jenis surat ${!item.is_active ? "diaktifkan" : "dinonaktifkan"}.`);
      fetch();
    } catch { toast.error("Gagal mengubah status."); }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Master Jenis Surat</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar jenis surat dan persyaratannya. Jenis aktif akan tampil di form pengajuan warga.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
          <Plus size={18} /> Tambah Jenis Surat
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Kode</th>
                <th className="px-6 py-4">Nama Surat</th>
                <th className="px-6 py-4">Persyaratan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-500">Belum ada data. Tambahkan jenis surat pertama.</td></tr>
              ) : list.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><span className="font-mono font-bold text-xs bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">{item.kode_surat}</span></td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_surat}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.persyaratan || <span className="italic text-gray-300">Belum diisi</span>}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => toggleActive(item)} title={item.is_active ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}>
                      {item.is_active
                        ? <ToggleRight size={28} className="text-green-500 mx-auto" />
                        : <ToggleLeft size={28} className="text-gray-300 mx-auto" />}
                    </button>
                  </td>
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
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Jenis Surat" : "Tambah Jenis Surat"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Surat *</label>
                  <input required type="text" placeholder="Cth: SKTM" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900 uppercase" value={form.kode_surat} onChange={e => setForm({...form, kode_surat: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.is_active ? "1" : "0"} onChange={e => setForm({...form, is_active: e.target.value === "1"})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900">
                    <option value="1">Aktif (tampil di form)</option>
                    <option value="0">Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Surat *</label>
                <input required type="text" placeholder="Cth: Surat Keterangan Tidak Mampu" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900" value={form.nama_surat} onChange={e => setForm({...form, nama_surat: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Persyaratan</label>
                <textarea rows={4} placeholder="Tulis persyaratan yang dibutuhkan, satu baris per syarat..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-gray-900 resize-none" value={form.persyaratan} onChange={e => setForm({...form, persyaratan: e.target.value})} />
                <p className="text-xs text-gray-400 mt-1">Persyaratan akan tampil saat warga memilih jenis surat ini.</p>
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
