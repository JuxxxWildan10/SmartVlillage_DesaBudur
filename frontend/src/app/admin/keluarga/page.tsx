"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Users, Search, Edit, Trash2, Plus, Save, Upload, Download } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminKeluarga() {
  const [keluargaList, setKeluargaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ 
    id: null, 
    no_kk: "", 
    kepala_keluarga: "", 
    alamat: "", 
    rt: "", 
    rw: "", 
    dusun: "",
    kode_pos: "45167"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchKeluarga = async () => {
    try {
      const res = await api.get("/keluarga");
      setKeluargaList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data keluarga");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeluarga();
  }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData(data);
    } else {
      setFormData({ 
        id: null, no_kk: "", kepala_keluarga: "", alamat: "", rt: "", rw: "", dusun: "", kode_pos: "45167"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/keluarga", formData);
        toast.success("Data Keluarga berhasil ditambahkan");
      } else {
        await api.put(`/keluarga/${formData.id}`, formData);
        toast.success("Data Keluarga berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchKeluarga();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data. Cek validasi No KK unik.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: "Data KK yang dihapus mungkin akan mempengaruhi data penduduk yang berelasi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/keluarga/${id}`);
          toast.success("Data Keluarga berhasil dihapus");
          fetchKeluarga();
        } catch (err) {
          toast.error("Gagal menghapus data keluarga");
        }
      }
    });
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Asumsi format kolom excel: No KK, Kepala Keluarga, Alamat, RT, RW, Dusun, Kode Pos
        const mappedData = data.map((row: any) => ({
          no_kk: String(row['No KK'] || row['no_kk'] || ''),
          kepala_keluarga: row['Kepala Keluarga'] || row['kepala_keluarga'] || '',
          alamat: row['Alamat'] || row['alamat'] || '-',
          rt: String(row['RT'] || row['rt'] || '000'),
          rw: String(row['RW'] || row['rw'] || '000'),
          dusun: row['Dusun'] || row['dusun'] || '-',
          kode_pos: String(row['Kode Pos'] || row['kode_pos'] || '45167')
        })).filter((row) => row.no_kk && row.kepala_keluarga);

        if (mappedData.length === 0) {
          toast.error("Data kosong atau format salah. Pastikan kolom No KK dan Kepala Keluarga terisi.");
          return;
        }

        toast.loading("Mengimpor data...", { id: "import" });
        const res = await api.post('/keluarga/import', { data: mappedData });
        toast.success(res.data.message || "Berhasil import data", { id: "import" });
        fetchKeluarga();
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengimpor file Excel", { id: "import" });
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "No KK": "3209123456789012", "Kepala Keluarga": "Budi Santoso", "Alamat": "Blok Manis", "RT": "001", "RW": "002", "Dusun": "Dusun I", "Kode Pos": "45167" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_KK");
    XLSX.writeFile(wb, "Template_Import_KK.xlsx");
  };

  const filteredData = keluargaList.filter(k => 
    k.kepala_keluarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.no_kk.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Data Kartu Keluarga</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data Kartu Keluarga (KK) warga.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari No KK atau Nama KK..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadTemplate}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2"
              title="Download Template Excel"
            >
              <Download size={16} /> <span className="hidden md:inline">Template</span>
            </button>
            <label className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer">
              <Upload size={16} /> <span className="hidden md:inline">Import Excel</span>
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleImportExcel} />
            </label>
            <button 
              onClick={() => handleOpenModal("create")}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={16} /> Tambah KK
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">No. KK</th>
                <th className="px-6 py-4">Kepala Keluarga</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">RT/RW</th>
                <th className="px-6 py-4">Jml Anggota</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredData.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-primary font-medium">{k.no_kk}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{k.kepala_keluarga}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{k.alamat}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{k.rt} / {k.rw} ({k.dusun})</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        {k.anggota_count || 0} Orang
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal("edit", k)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" 
                        title="Edit Data"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(k.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                        title="Hapus Data"
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
        title={modalMode === "create" ? "Tambah Data Kartu Keluarga" : "Edit Data Kartu Keluarga"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. KK</label>
              <input 
                type="text" required maxLength={16} minLength={16}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                value={formData.no_kk}
                onChange={(e) => setFormData({...formData, no_kk: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Keluarga</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.kepala_keluarga}
                onChange={(e) => setFormData({...formData, kepala_keluarga: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat (Jalan/Gang)</label>
            <input 
              type="text" required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RT</label>
              <input 
                type="text" required maxLength={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.rt}
                onChange={(e) => setFormData({...formData, rt: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RW</label>
              <input 
                type="text" required maxLength={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.rw}
                onChange={(e) => setFormData({...formData, rw: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dusun</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.dusun}
                onChange={(e) => setFormData({...formData, dusun: e.target.value})}
              />
            </div>
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
