"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Check, X, Clock, FileText, MessageCircle, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SkeletonTable from "@/components/shared/SkeletonTable";

export default function AdminSurat() {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSurat = async () => {
    try {
      const res = await api.get("/surat");
      setSuratList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/surat/${id}`, { status: newStatus });
      toast.success(`Status berhasil diubah menjadi ${newStatus}`);
      fetchSurat(); // Refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Surat?',
      text: "Data surat yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/surat/${id}`);
          toast.success("Surat berhasil dihapus");
          fetchSurat();
        } catch (err) {
          toast.error("Gagal menghapus surat");
        }
      }
    });
  };

  const handleUpdateClick = (id: number, newStatus: string) => {
    if (newStatus === 'Ditolak') {
      Swal.fire({
        title: 'Tolak Permohonan?',
        text: "Anda yakin ingin menolak permohonan surat ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Tolak!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          updateStatus(id, newStatus);
        }
      });
    } else {
      updateStatus(id, newStatus);
    }
  };

  const filteredSurat = suratList.filter(s => 
    s.jenis_surat.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifyWhatsApp = (surat: any) => {
    if (!surat.nomor_wa) {
      alert("Warga ini tidak mencantumkan nomor WhatsApp.");
      return;
    }
    let phone = surat.nomor_wa;
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }
    const message = `*Pemdes Budur*\nHalo, permohonan surat Anda dengan Jenis: *${surat.jenis_surat}* (Tracking: ${surat.tracking_code}) telah *DISETUJUI*.\n\nSilakan datang ke Balai Desa Budur pada jam kerja untuk mengambil berkas fisik Anda. Terima kasih.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Surat Warga</h2>
          <p className="text-gray-500 text-sm mt-1">Persetujuan permohonan surat keterangan.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari jenis surat atau resi..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Penduduk ID</th>
                <th className="px-6 py-4">Jenis Surat</th>
                <th className="px-6 py-4">Keperluan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="p-0"><SkeletonTable rows={5} /></td></tr>
              ) : filteredSurat.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10">Tidak ada data surat</td></tr>
              ) : (
                filteredSurat.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{surat.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{surat.penduduk_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{surat.jenis_surat}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={surat.keperluan}>{surat.keperluan}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        surat.status === 'Menunggu' ? 'bg-orange-100 text-orange-700' :
                        surat.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {surat.status === 'Menunggu' && <Clock size={12} />}
                        {surat.status === 'Selesai' && <Check size={12} />}
                        {surat.status === 'Ditolak' && <X size={12} />}
                        {surat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(surat.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {surat.status === 'Menunggu' && (
                        <>
                          <button 
                            onClick={() => handleUpdateClick(surat.id, 'Selesai')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Setujui (Selesai)"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateClick(surat.id, 'Ditolak')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Tolak"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      {surat.status === 'Selesai' && (
                        <>
                          <button 
                            onClick={() => notifyWhatsApp(surat)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </button>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/surat/${surat.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-block" 
                            title="Cetak PDF"
                          >
                            <FileText size={18} />
                          </a>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(surat.id)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block ml-1" 
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
