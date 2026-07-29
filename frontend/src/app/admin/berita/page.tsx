"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Edit, Trash2, Plus, Save, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ id: null, judul: "", kategori: "Pengumuman", isi_berita: "", status: "Published", gambar_url: null as File | null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBerita = async () => {
    try {
      const res = await api.get("/berita");
      setBeritaList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData({...data, gambar_url: null}); // reset file input on edit
    } else {
      setFormData({ id: null, judul: "", kategori: "Pengumuman", isi_berita: "", status: "Published", gambar_url: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("judul", formData.judul);
      data.append("kategori", formData.kategori);
      data.append("isi_berita", formData.isi_berita);
      data.append("status", formData.status);
      if (formData.gambar_url) {
        data.append("gambar_url", formData.gambar_url);
      }

      if (modalMode === "create") {
        await api.post("/berita", data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Berita berhasil ditambahkan");
      } else {
        data.append("_method", "PUT");
        await api.post(`/berita/${formData.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Berita berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchBerita();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Berita?',
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
          await api.delete(`/berita/${id}`);
          toast.success("Berita berhasil dihapus");
          fetchBerita();
        } catch (err) {
          toast.error("Gagal menghapus berita");
        }
      }
    });
  };

  const filteredData = beritaList.filter(b => 
    b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Berita & Pengumuman</h2>
          <p className="text-gray-500 text-sm mt-1">Publikasikan informasi terbaru kepada masyarakat desa.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari Judul..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal("create")}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={16} /> Buat Berita
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal Publikasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada berita ditemukan.</td></tr>
              ) : (
                filteredData.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.gambar_url ? (
                          <div className="w-12 h-12 rounded-lg relative overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={b.gambar_url.startsWith('http') ? b.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${ b.gambar_url }`} alt={b.judul} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <span className="font-bold text-gray-900 line-clamp-1 max-w-xs">{b.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{b.kategori}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${b.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
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
        title={modalMode === "create" ? "Buat Berita Baru" : "Edit Berita"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
            <input 
              type="text" required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.judul}
              onChange={(e) => setFormData({...formData, judul: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Berita</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer outline-none transition-colors"
              onChange={(e) => setFormData({...formData, gambar_url: e.target.files ? e.target.files[0] : null})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              >
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Berita</label>
            <textarea 
              required rows={5}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none resize-none"
              value={formData.isi_berita}
              onChange={(e) => setFormData({...formData, isi_berita: e.target.value})}
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
