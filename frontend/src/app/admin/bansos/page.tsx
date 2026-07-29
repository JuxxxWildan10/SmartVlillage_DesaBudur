"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Edit, Trash2, Plus, Gift, Save, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminBansos() {
  const [bansosList, setBansosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ 
    id: null, nama_program: "", deskripsi: "", penyelenggara: "", tahun: new Date().getFullYear(), status: "Aktif" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBansos = async () => {
    try {
      const res = await api.get("/bansos");
      setBansosList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data bansos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBansos();
  }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData(data);
    } else {
      setFormData({ 
        id: null, nama_program: "", deskripsi: "", penyelenggara: "", tahun: new Date().getFullYear(), status: "Aktif" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/bansos", formData);
        toast.success("Program Bansos berhasil ditambahkan");
      } else {
        await api.put(`/bansos/${formData.id}`, formData);
        toast.success("Program Bansos berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchBansos();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Program?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/bansos/${id}`);
          toast.success("Program Bansos berhasil dihapus");
          fetchBansos();
        } catch (err) {
          toast.error("Gagal menghapus bansos");
        }
      }
    });
  };

  const filteredData = bansosList.filter(b => 
    b.nama_program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Data Bantuan Sosial (Bansos)</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola program bantuan untuk keluarga sejahtera.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari Program..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal("create")}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={16} /> Program Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Program</th>
                <th className="px-6 py-4">Tahun</th>
                <th className="px-6 py-4">Penyelenggara</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada program ditemukan.</td></tr>
              ) : (
                filteredData.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Gift size={20} />
                        </div>
                        <p className="font-bold text-gray-900">{b.nama_program}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{b.tahun}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.penyelenggara}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${b.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => router.push(`/admin/bansos/${b.id}`)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                        title="Kelola Penerima"
                      >
                        <Users size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal("edit", b)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === "create" ? "Tambah Program Bansos" : "Edit Program Bansos"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
            <input 
              type="text" required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.nama_program}
              onChange={(e) => setFormData({...formData, nama_program: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
              <input 
                type="text" required
                placeholder="Ex: Kemensos, Pemdes"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.penyelenggara}
                onChange={(e) => setFormData({...formData, penyelenggara: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input 
                type="number" required min="2000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.tahun}
                onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value) || new Date().getFullYear()})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              required rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none resize-none"
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
            ></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Batal
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors font-bold flex items-center gap-2"
            >
              {isSubmitting ? "Menyimpan..." : <><Save size={16} /> Simpan</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
