"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Users, Search, Edit, Trash2, Plus, Save, Upload, Download, FileSpreadsheet, Key } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Modal from "@/components/shared/Modal";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminPenduduk() {
  const [pendudukList, setPendudukList] = useState<any[]>([]);
  const [keluargaList, setKeluargaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState({ 
    id: null, nik: "", keluarga_id: "", nama_lengkap: "", tempat_lahir: "", tanggal_lahir: "", 
    jenis_kelamin: "Laki-laki", agama: "Islam", pendidikan: "SMA/Sederajat", 
    pekerjaan: "", status_perkawinan: "Belum Kawin", status_hubungan_dalam_keluarga: "Lainnya",
    kewarganegaraan: "WNI", golongan_darah: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPenduduk = async () => {
    try {
      const res = await api.get("/penduduk");
      setPendudukList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data penduduk");
    }
  };

  const fetchKeluarga = async () => {
    try {
      const res = await api.get("/keluarga");
      setKeluargaList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchPenduduk(), fetchKeluarga()]).finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (mode: "create" | "edit", data: any = null) => {
    setModalMode(mode);
    if (mode === "edit" && data) {
      setFormData(data);
    } else {
      setFormData({ 
        id: null, nik: "", keluarga_id: "", nama_lengkap: "", tempat_lahir: "", tanggal_lahir: "", 
        jenis_kelamin: "Laki-laki", agama: "Islam", pendidikan: "SMA/Sederajat", 
        pekerjaan: "", status_perkawinan: "Belum Kawin", status_hubungan_dalam_keluarga: "Lainnya",
        kewarganegaraan: "WNI", golongan_darah: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.post("/penduduk", formData);
        toast.success("Data Penduduk berhasil ditambahkan");
      } else {
        await api.put(`/penduduk/${formData.id}`, formData);
        toast.success("Data Penduduk berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchPenduduk();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: "Data penduduk yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/penduduk/${id}`);
          toast.success("Data Penduduk berhasil dihapus");
          fetchPenduduk();
        } catch (err) {
          toast.error("Gagal menghapus data penduduk");
        }
      }
    });
  };

  const handleResetPassword = (id: number) => {
    Swal.fire({
      title: 'Reset Password?',
      text: "Password akun yang tertaut dengan NIK ini akan dikembalikan ke default (DesaBudur123!). Lanjutkan?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.post(`/penduduk/${id}/reset-password`);
          Swal.fire('Berhasil!', res.data.message, 'success');
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Gagal mereset password");
        }
      }
    });
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 
        "NIK": "3209123456789001", "Nama Lengkap": "Budi Santoso", "No KK": "3209123456789012",
        "Tempat Lahir": "Cirebon", "Tanggal Lahir": "1990-01-01", "Jenis Kelamin": "Laki-laki",
        "Agama": "Islam", "Pendidikan": "SMA/Sederajat", "Pekerjaan": "Wiraswasta",
        "Status Perkawinan": "Kawin", "Hubungan Keluarga": "Kepala Keluarga", 
        "Kewarganegaraan": "WNI", "Golongan Darah": "O"
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Penduduk");
    XLSX.writeFile(wb, "Template_Import_Penduduk.xlsx");
  };

  const handleExportExcel = () => {
    const dataToExport = pendudukList.map(p => ({
      "NIK": p.nik,
      "Nama Lengkap": p.nama_lengkap,
      "No KK": p.keluarga ? p.keluarga.no_kk : "",
      "Tempat Lahir": p.tempat_lahir,
      "Tanggal Lahir": p.tanggal_lahir,
      "Jenis Kelamin": p.jenis_kelamin,
      "Agama": p.agama,
      "Pendidikan": p.pendidikan,
      "Pekerjaan": p.pekerjaan,
      "Status Perkawinan": p.status_perkawinan,
      "Hubungan Keluarga": p.status_hubungan_dalam_keluarga,
      "Kewarganegaraan": p.kewarganegaraan,
      "Golongan Darah": p.golongan_darah || "-"
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Penduduk");
    XLSX.writeFile(wb, "Data_Penduduk_Desa_Budur.xlsx");
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
        
        const mappedData = data.map((row: any) => ({
          nik: String(row['NIK'] || row['nik'] || ''),
          no_kk: String(row['No KK'] || row['no_kk'] || ''),
          nama_lengkap: row['Nama Lengkap'] || row['nama_lengkap'] || '',
          tempat_lahir: row['Tempat Lahir'] || row['tempat_lahir'] || '-',
          tanggal_lahir: row['Tanggal Lahir'] || row['tanggal_lahir'] || '2000-01-01',
          jenis_kelamin: row['Jenis Kelamin'] || row['jenis_kelamin'] || 'Laki-laki',
          agama: row['Agama'] || row['agama'] || 'Islam',
          pendidikan: row['Pendidikan'] || row['pendidikan'] || '-',
          pekerjaan: row['Pekerjaan'] || row['pekerjaan'] || '-',
          status_perkawinan: row['Status Perkawinan'] || row['status_perkawinan'] || 'Belum Kawin',
          status_hubungan_dalam_keluarga: row['Hubungan Keluarga'] || row['status_hubungan_dalam_keluarga'] || 'Lainnya',
          kewarganegaraan: row['Kewarganegaraan'] || row['kewarganegaraan'] || 'WNI',
          golongan_darah: row['Golongan Darah'] || row['golongan_darah'] || null,
        })).filter((row) => row.nik && row.nama_lengkap);

        if (mappedData.length === 0) {
          toast.error("Data kosong atau format salah. Pastikan kolom NIK dan Nama Lengkap terisi.");
          return;
        }

        toast.loading("Mengimpor data penduduk...", { id: "import-penduduk" });
        const res = await api.post('/penduduk/import', { data: mappedData });
        toast.success(res.data.message || "Berhasil import data", { id: "import-penduduk" });
        fetchPenduduk();
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengimpor file Excel", { id: "import-penduduk" });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ""; // Reset input
  };

  const filteredData = pendudukList.filter(p => 
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nik.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Data Kependudukan</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data warga dan Kartu Keluarga (KK).</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari NIK atau Nama..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button 
              onClick={handleDownloadTemplate}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2"
              title="Download Template Excel"
            >
              <Download size={16} /> <span className="hidden lg:inline">Template</span>
            </button>
            <button 
              onClick={handleExportExcel}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2"
              title="Export ke Excel"
            >
              <FileSpreadsheet size={16} /> <span className="hidden lg:inline">Export</span>
            </button>
            <label className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer">
              <Upload size={16} /> <span className="hidden lg:inline">Import</span>
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleImportExcel} />
            </label>
            <button 
              onClick={() => handleOpenModal("create")}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Plus size={16} /> Tambah Warga
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">No. KK / NIK</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">L/P</th>
                <th className="px-6 py-4">Pekerjaan</th>
                <th className="px-6 py-4">Status Keluarga</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="text-gray-500 text-xs">KK: {p.keluarga ? p.keluarga.no_kk : '-'}</div>
                      <div className="text-primary font-mono">{p.nik}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{p.nama_lengkap}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.jenis_kelamin}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.pekerjaan}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        {p.status_hubungan_dalam_keluarga}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleResetPassword(p.id)}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" 
                        title="Reset Password Akun"
                      >
                        <Key size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal("edit", p)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" 
                        title="Edit Data"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
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
        title={modalMode === "create" ? "Tambah Data Penduduk" : "Edit Data Penduduk"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
              <input 
                type="text" required maxLength={16} minLength={16}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                value={formData.nik}
                onChange={(e) => setFormData({...formData, nik: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <input 
                type="date" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.tanggal_lahir}
                onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keluarga (No KK)</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.keluarga_id || ""}
                onChange={(e) => setFormData({...formData, keluarga_id: e.target.value})}
              >
                <option value="">-- Pilih Kartu Keluarga --</option>
                {keluargaList.map((k) => (
                  <option key={k.id} value={k.id}>{k.no_kk} - {k.kepala_keluarga}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Hubungan dlm Keluarga</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.status_hubungan_dalam_keluarga}
                onChange={(e) => setFormData({...formData, status_hubungan_dalam_keluarga: e.target.value})}
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Suami">Suami</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Menantu">Menantu</option>
                <option value="Cucu">Cucu</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Mertua">Mertua</option>
                <option value="Famili Lain">Famili Lain</option>
                <option value="Pembantu">Pembantu</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agama</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.agama}
                onChange={(e) => setFormData({...formData, agama: e.target.value})}
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Perkawinan</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.status_perkawinan}
                onChange={(e) => setFormData({...formData, status_perkawinan: e.target.value})}
              >
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Golongan Darah</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.golongan_darah || ""}
                onChange={(e) => setFormData({...formData, golongan_darah: e.target.value})}
              >
                <option value="">Tidak Tahu / -</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kewarganegaraan</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary outline-none"
                value={formData.kewarganegaraan}
                onChange={(e) => setFormData({...formData, kewarganegaraan: e.target.value})}
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
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
