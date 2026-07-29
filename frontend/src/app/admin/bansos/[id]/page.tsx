"use client";

import { useState, useEffect, use } from "react";
import api from "@/lib/axios";
import { Search, Edit, Trash2, Plus, ArrowLeft, Save, UserCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function DetailBansos({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const programId = resolvedParams.id;
  
  const [program, setProgram] = useState<any>(null);
  const [penerimaList, setPenerimaList] = useState<any[]>([]);
  const [keluargaOptions, setKeluargaOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ id: null, keluarga_id: "", status_penerimaan: "Layak", keterangan: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progRes, penRes, kelRes] = await Promise.all([
        api.get('/bansos'), // we will just find it from list since we don't have show() yet
        api.get(`/bansos/${programId}/penerima`),
        api.get('/keluarga')
      ]);

      const found = progRes.data.data.find((p: any) => p.id.toString() === programId);
      if (found) setProgram(found);
      
      setPenerimaList(penRes.data.data);
      setKeluargaOptions(kelRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData({ 
        id: data.id, 
        keluarga_id: data.keluarga_id, 
        status_penerimaan: data.status_penerimaan, 
        keterangan: data.keterangan || "" 
      });
    } else {
      setFormData({ id: null, keluarga_id: "", status_penerimaan: "Layak", keterangan: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post(`/bansos/${programId}/penerima`, formData);
        toast.success("Keluarga berhasil ditambahkan ke program");
      } else {
        await api.put(`/bansos/penerima/${formData.id}`, formData);
        toast.success("Status penerima berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchData(); // refresh data
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Penerima?',
      text: "Keluarga ini akan dihapus dari daftar penerima program.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/bansos/penerima/${id}`);
          toast.success("Penerima berhasil dihapus");
          fetchData();
        } catch (err) {
          toast.error("Gagal menghapus penerima");
        }
      }
    });
  };

  const filteredData = penerimaList.filter(p => {
    const namaKK = p.keluarga?.kepala_keluarga || "";
    const nkk = p.keluarga?.no_kk || "";
    return namaKK.toLowerCase().includes(searchTerm.toLowerCase()) || nkk.includes(searchTerm);
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/bansos')}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-heading">
              Kelola Penerima: {program ? program.nama_program : 'Memuat...'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Daftar Keluarga Penerima Manfaat (KPM)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari NKK atau Nama KK..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal("create")}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={16} /> Tambah KPM
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nomor KK</th>
                <th className="px-6 py-4">Kepala Keluarga</th>
                <th className="px-6 py-4">Status Penerimaan</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center text-gray-400">
                      <AlertCircle size={48} className="mb-2" />
                      <p>Belum ada data penerima.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-700">{p.keluarga?.no_kk || '-'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{p.keluarga?.kepala_keluarga || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold 
                        ${p.status_penerimaan === 'Tersalurkan' ? 'bg-green-100 text-green-700' : 
                          p.status_penerimaan === 'Layak' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {p.status_penerimaan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.keterangan || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal("edit", p)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
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
        title={modalMode === "create" ? "Tambah KPM" : "Edit Status KPM"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode === "create" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Keluarga (Berdasarkan NKK)</label>
              <select 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.keluarga_id}
                onChange={(e) => setFormData({...formData, keluarga_id: e.target.value})}
              >
                <option value="">-- Pilih Keluarga --</option>
                {keluargaOptions.map(k => (
                  <option key={k.id} value={k.id}>{k.no_kk} - {k.kepala_keluarga || 'Tanpa Kepala'}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Penerimaan</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.status_penerimaan}
              onChange={(e) => setFormData({...formData, status_penerimaan: e.target.value})}
            >
              <option value="Layak">Layak (Diantrikan)</option>
              <option value="Tersalurkan">Tersalurkan (Selesai)</option>
              <option value="Tidak Layak">Tidak Layak</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none resize-none"
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
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
