"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search, Edit, Trash2, Plus, Save, Image as ImageIcon, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

const KATEGORI_OPTIONS = ["Edukasi", "Kesehatan", "Pertanian", "Hukum", "Teknologi", "Lainnya"];

export default function AdminArtikel() {
  const [artikelList, setArtikelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({
    id: null as number | null,
    judul: "",
    kategori: "Edukasi",
    isi_artikel: "",
    penulis: "",
    status: "Published",
    gambar_url: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArtikel = async () => {
    try {
      const res = await api.get("/artikel");
      setArtikelList(res.data.data || []);
    } catch {
      toast.error("Gagal memuat data artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArtikel(); }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData({ id: data.id, judul: data.judul, kategori: data.kategori, isi_artikel: data.isi_artikel, penulis: data.penulis || "", status: data.status, gambar_url: null });
    } else {
      setFormData({ id: null, judul: "", kategori: "Edukasi", isi_artikel: "", penulis: "", status: "Published", gambar_url: null });
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
      data.append("isi_artikel", formData.isi_artikel);
      data.append("penulis", formData.penulis || "Admin Desa Budur");
      data.append("status", formData.status);
      if (formData.gambar_url) data.append("gambar_url", formData.gambar_url);

      if (modalMode === "create") {
        await api.post("/artikel", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Artikel berhasil ditambahkan.");
      } else {
        data.append("_method", "PUT");
        await api.post(`/artikel/${formData.id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Artikel berhasil diperbarui.");
      }
      setIsModalOpen(false);
      fetchArtikel();
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan artikel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({ title: "Hapus Artikel?", text: "Data tidak dapat dikembalikan!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Ya, Hapus!", cancelButtonText: "Batal" })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete(`/artikel/${id}`);
            toast.success("Artikel berhasil dihapus.");
            fetchArtikel();
          } catch { toast.error("Gagal menghapus artikel."); }
        }
      });
  };

  const filteredData = artikelList.filter(a =>
    a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.kategori || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Artikel</h2>
          <p className="text-gray-500 text-sm mt-1">Publikasikan artikel edukasi dan informasi bermanfaat untuk masyarakat desa.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Cari judul artikel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none" />
          </div>
          <button onClick={() => handleOpenModal("create")}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2">
            <Plus size={16} /> Tulis Artikel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Judul Artikel</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Penulis</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                  <BookOpen size={36} className="mx-auto text-gray-300 mb-3" />
                  Belum ada artikel. Klik tombol "Tulis Artikel" untuk memulai.
                </td></tr>
              ) : (
                filteredData.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {a.gambar_url ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img src={a.gambar_url.startsWith("http") ? a.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${a.gambar_url}`} alt={a.judul} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 shrink-0">
                            <BookOpen size={20} />
                          </div>
                        )}
                        <span className="font-bold text-gray-900 line-clamp-1 max-w-xs">{a.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{a.kategori}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{a.penulis || "Admin Desa"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${a.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal("edit", a)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {loading ? (
              <div className="p-4"><SkeletonTable rows={3} /></div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen size={36} className="mx-auto text-gray-300 mb-3" />
                Belum ada artikel. Klik tombol "Tulis Artikel" untuk memulai.
              </div>
            ) : (
              filteredData.map((a) => (
                <div key={a.id} className="p-4 bg-white hover:bg-gray-50 transition-colors space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${a.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {a.status}
                    </span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleOpenModal("edit", a)} className="p-2 bg-amber-50 text-amber-600 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 bg-red-50 text-red-600 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    {a.gambar_url ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img src={a.gambar_url.startsWith("http") ? a.gambar_url : `${process.env.NEXT_PUBLIC_BASE_URL}${a.gambar_url}`} alt={a.judul} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 shrink-0">
                        <BookOpen size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{a.judul}</h3>
                      <p className="text-sm text-gray-500">{a.kategori} · {new Date(a.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Tulis Artikel Baru" : "Edit Artikel"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel *</label>
            <input type="text" required value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Tips Menanam Padi di Musim Kemarau"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none">
                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
            <input type="text" value={formData.penulis} onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              placeholder="Admin Desa Budur"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto / Ilustrasi</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file && file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran gambar maksimal 2MB!");
                e.target.value = "";
                return;
              }
              setFormData({ ...formData, gambar_url: file });
            }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Artikel *</label>
            <textarea required rows={6} value={formData.isi_artikel} onChange={(e) => setFormData({ ...formData, isi_artikel: e.target.value })}
              placeholder="Tuliskan isi artikel di sini..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none resize-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors font-bold flex items-center gap-2">
              {isSubmitting ? "Menyimpan..." : <><Save size={16} /> Simpan</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
