"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Pencil, Trash2, X, Save, Search, Download } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SkeletonTable from "@/components/shared/SkeletonTable";

const categories = ["RPJMDes", "RKPDes", "APBDes", "Perdes", "SK Kuwu", "Lainnya"];

export default function AdminDokumen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  
  const [form, setForm] = useState({
    judul: "",
    kategori: "Perdes",
    tahun: new Date().getFullYear(),
    deskripsi: "",
    is_public: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dokumen?all=true");
      setData(res.data.data || []);
    } catch {
      toast.error("Gagal memuat data dokumen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDokumen(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ judul: "", kategori: "Perdes", tahun: new Date().getFullYear(), deskripsi: "", is_public: true });
    setFile(null);
    setModal(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      judul: item.judul,
      kategori: item.kategori,
      tahun: item.tahun,
      deskripsi: item.deskripsi || "",
      is_public: item.is_public == 1
    });
    setFile(null);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, (form as any)[key]));
      
      if (file) {
        formData.append("file", file);
      }

      if (editId) {
        formData.append("_method", "PUT");
        await api.post(`/dokumen/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Dokumen berhasil diperbarui.");
      } else {
        if (!file) {
          toast.error("File PDF wajib diunggah untuk dokumen baru.");
          setIsSubmitting(false);
          return;
        }
        await api.post("/dokumen", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Dokumen berhasil ditambahkan.");
      }
      setModal(false);
      fetchDokumen();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan dokumen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Hapus Dokumen?",
      text: "Data dan file PDF akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/dokumen/${id}`);
      toast.success("Dokumen dihapus.");
      fetchDokumen();
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const filteredData = data.filter(d => d.judul.toLowerCase().includes(search.toLowerCase()));

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Perdes": return "bg-emerald-100 text-emerald-700";
      case "RPJMDes": return "bg-blue-100 text-blue-700";
      case "RKPDes": return "bg-indigo-100 text-indigo-700";
      case "APBDes": return "bg-orange-100 text-orange-700";
      case "SK Kuwu": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Regulasi & Dokumen Desa</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola Perdes, RPJMDes, dan dokumen publik lainnya.</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari dokumen..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors whitespace-nowrap">
            <Plus size={18} /> <span className="hidden sm:inline">Tambah Dokumen</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Judul Dokumen</th>
                <th className="px-6 py-4">Tahun</th>
                <th className="px-6 py-4">Visibilitas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Belum ada dokumen ditemukan.</td></tr>
              ) : filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getCategoryColor(item.kategori)}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{item.judul}</p>
                    {item.deskripsi && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.deskripsi}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.tahun}</td>
                  <td className="px-6 py-4">
                    {item.is_public ? (
                      <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold">Publik</span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-bold">Internal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/dokumen/${item.file_pdf}`}
                        target="_blank" rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                        title="Lihat PDF"
                      >
                        <Download size={16} />
                      </a>
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Dokumen" : "Tambah Dokumen"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Dokumen *</label>
                <input required type="text" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Contoh: Perdes No 5 Tahun 2024" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
                  <input required type="number" value={form.tahun} onChange={e => setForm({...form, tahun: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                <textarea rows={2} value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File PDF {editId ? "(Opsional)" : "*"}</label>
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors" />
                {editId && !file && <p className="text-xs text-amber-600 mt-1">Kosongkan jika tidak ingin mengubah file PDF saat ini.</p>}
              </div>

              <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <input type="checkbox" id="is_public" checked={form.is_public} onChange={e => setForm({...form, is_public: e.target.checked})} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                <label htmlFor="is_public" className="text-sm text-gray-700 font-medium cursor-pointer">Tampilkan untuk Publik (Transparansi)</label>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-70">
                  <Save size={18} /> {isSubmitting ? "Menyimpan..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
