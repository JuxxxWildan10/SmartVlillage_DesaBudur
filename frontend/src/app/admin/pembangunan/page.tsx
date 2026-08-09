"use client";

import { useState, useEffect } from "react";
import { Building, Plus, Pencil, Trash2, X, Save, Search, Image as ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SkeletonTable from "@/components/shared/SkeletonTable";

const formatRp = (v: number | string) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(v));

export default function AdminPembangunan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  
  const [form, setForm] = useState({
    nama_proyek: "",
    lokasi: "",
    anggaran: "",
    realisasi: "",
    sumber_dana: "",
    tahun: new Date().getFullYear(),
    persentase_progres: 0,
    status: "Direncanakan",
    keterangan: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPembangunan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pembangunan");
      setData(res.data.data || []);
    } catch {
      toast.error("Gagal memuat data pembangunan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPembangunan(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ 
      nama_proyek: "", lokasi: "", anggaran: "", realisasi: "", 
      sumber_dana: "", tahun: new Date().getFullYear(), 
      persentase_progres: 0, status: "Direncanakan", keterangan: "" 
    });
    setFile(null);
    setModal(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      nama_proyek: item.nama_proyek,
      lokasi: item.lokasi,
      anggaran: item.anggaran,
      realisasi: item.realisasi || "0",
      sumber_dana: item.sumber_dana,
      tahun: item.tahun,
      persentase_progres: item.persentase_progres || 0,
      status: item.status,
      keterangan: item.keterangan || ""
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
        formData.append("foto", file);
      }

      if (editId) {
        formData.append("_method", "PUT");
        await api.post(`/pembangunan/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Proyek berhasil diperbarui.");
      } else {
        await api.post("/pembangunan", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Proyek berhasil ditambahkan.");
      }
      setModal(false);
      fetchPembangunan();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan proyek.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({
      title: "Hapus Proyek?",
      text: "Data dan foto akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/pembangunan/${id}`);
      toast.success("Proyek dihapus.");
      fetchPembangunan();
    } catch {
      toast.error("Gagal menghapus.");
    }
  };

  const filteredData = data.filter(d => 
    d.nama_proyek.toLowerCase().includes(search.toLowerCase()) || 
    d.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Direncanakan": return "bg-gray-100 text-gray-700";
      case "Proses": return "bg-blue-100 text-blue-700";
      case "Selesai": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Proyek Pembangunan</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data proyek infrastruktur dan pembangunan fisik desa.</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama proyek..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors whitespace-nowrap">
            <Plus size={18} /> <span className="hidden sm:inline">Tambah Proyek</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Proyek & Lokasi</th>
                <th className="px-6 py-4">Anggaran & Realisasi</th>
                <th className="px-6 py-4">Progres</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Belum ada proyek pembangunan.</td></tr>
              ) : filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.foto ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/pembangunan/${item.foto}`} alt={item.nama_proyek} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="text-gray-400" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{item.nama_proyek}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.lokasi} — {item.sumber_dana}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{formatRp(item.anggaran)}</p>
                    <p className="text-xs text-emerald-600 font-medium">Real: {formatRp(item.realisasi)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.persentase_progres}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.persentase_progres}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
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
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Proyek" : "Tambah Proyek Pembangunan"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Proyek *</label>
                  <input required type="text" value={form.nama_proyek} onChange={e => setForm({...form, nama_proyek: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Contoh: Pembangunan Drainase RW 02" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
                  <input required type="text" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Dusun / RT / RW" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Dana *</label>
                  <input required type="text" value={form.sumber_dana} onChange={e => setForm({...form, sumber_dana: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Contoh: Dana Desa (DD)" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pagu Anggaran (Rp) *</label>
                  <input required type="number" value={form.anggaran} onChange={e => setForm({...form, anggaran: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Realisasi (Rp)</label>
                  <input type="number" value={form.realisasi} onChange={e => setForm({...form, realisasi: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Anggaran *</label>
                  <input required type="number" value={form.tahun} onChange={e => setForm({...form, tahun: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Proyek *</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none">
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progres (%)</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" value={form.persentase_progres} onChange={e => setForm({...form, persentase_progres: Number(e.target.value)})} className="w-full" />
                    <span className="text-sm font-bold w-12 text-center">{form.persentase_progres}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Dokumentasi</label>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan (Opsional)</label>
                <textarea rows={2} value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-70">
                  <Save size={18} /> {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
