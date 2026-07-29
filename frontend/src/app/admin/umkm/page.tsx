"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Edit, Trash2, Plus, Store, Save, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminUmkm() {
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ 
    id: null, nama_produk: "", pemilik: "", deskripsi: "", harga: 0, 
    kategori: "Makanan", is_active: true, lokasi: "" 
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUmkm = async () => {
    try {
      const res = await api.get("/umkm");
      setUmkmList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data UMKM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkm();
  }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    setFotoFile(null);
    if (mode === "edit" && data) {
      setFormData({
        ...data,
        pemilik: data.pemilik || "",
        lokasi: data.lokasi || "",
        deskripsi: data.deskripsi || ""
      });
    } else {
      setFormData({ 
        id: null, nama_produk: "", pemilik: "", deskripsi: "", harga: 0, 
        kategori: "Makanan", is_active: true, lokasi: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value.toString());
        }
      });
      if (fotoFile) {
        fd.append("foto", fotoFile);
      }

      if (modalMode === "create") {
        await api.post("/umkm", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Produk UMKM berhasil ditambahkan");
      } else {
        await api.post(`/umkm/${formData.id}?_method=PUT`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Produk UMKM berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchUmkm();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus UMKM?',
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
          await api.delete(`/umkm/${id}`);
          toast.success("Produk berhasil dihapus");
          fetchUmkm();
        } catch (err) {
          toast.error("Gagal menghapus UMKM");
        }
      }
    });
  };

  const filteredData = umkmList.filter(u => 
    u.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.pemilik && u.pemilik.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Produk UMKM</h2>
          <p className="text-gray-500 text-sm mt-1">Daftarkan dan promosikan produk unggulan desa.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari Produk atau Pemilik..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal("create")}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={16} /> Tambah UMKM
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Pemilik</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada produk ditemukan.</td></tr>
              ) : (
                filteredData.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.foto ? (
                          <div className="w-12 h-12 rounded-lg relative overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              src={u.foto.startsWith('http') ? u.foto : `${process.env.NEXT_PUBLIC_BASE_URL}${ u.foto }`} 
                              alt={u.nama_produk} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <Store size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{u.nama_produk}</p>
                          <p className="text-xs text-gray-500">{u.kategori}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{u.pemilik}</td>
                    <td className="px-6 py-4 font-bold text-primary">Rp {u.harga.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.is_active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal("edit", u)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
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
        title={modalMode === "create" ? "Tambah Produk UMKM" : "Edit Produk UMKM"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.nama_produk}
                onChange={(e) => setFormData({...formData, nama_produk: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.pemilik || ""}
                onChange={(e) => setFormData({...formData, pemilik: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Jasa">Jasa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input 
                type="number" required min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.harga}
                onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.is_active ? "true" : "false"}
              onChange={(e) => setFormData({...formData, is_active: e.target.value === "true"})}
            >
              <option value="true">Aktif</option>
              <option value="false">Non-aktif</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi UMKM</label>
              <input 
                type="text"
                placeholder="Contoh: Jl. Merdeka No 1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.lokasi || ""}
                onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Foto (Opsional)</label>
              <input 
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
              />
              {modalMode === "edit" && !fotoFile && (
                <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto.</p>
              )}
            </div>
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
