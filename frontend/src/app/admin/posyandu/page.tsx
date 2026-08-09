"use client";

import { useState, useEffect } from "react";
import { HeartPulse, Plus, Pencil, Trash2, X, Save, MapPin, Calendar, Users } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const emptyForm = { nama: "", lokasi: "", jadwal: "", ketua_kader: "" };

export default function AdminPosyandu() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch = async () => {
    try {
      const res = await api.get("/posyandu");
      setList(res.data.data || []);
    } catch { toast.error("Gagal memuat data posyandu."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setModal(true); };
  const openEdit = (item: any) => { setEditId(item.id); setForm({ nama: item.nama, lokasi: item.lokasi, jadwal: item.jadwal, ketua_kader: item.ketua_kader || "" }); setModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/posyandu/${editId}`, form);
        toast.success("Posyandu berhasil diperbarui.");
      } else {
        await api.post("/posyandu", form);
        toast.success("Posyandu berhasil ditambahkan.");
      }
      setModal(false);
      fetch();
    } catch { toast.error("Gagal menyimpan data."); }
  };

  const handleDelete = async (id: number) => {
    const res = await Swal.fire({ title: "Hapus Posyandu?", text: "Data akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Ya, Hapus", cancelButtonText: "Batal" });
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/posyandu/${id}`);
      toast.success("Posyandu dihapus.");
      fetch();
    } catch { toast.error("Gagal menghapus."); }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading">Kelola Posyandu</h2>
          <p className="text-gray-500 text-sm mt-1">Manajemen data posyandu dan kegiatan kesehatan desa.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
          <Plus size={18} /> Tambah Posyandu
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <HeartPulse size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada data posyandu. Tambahkan yang pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                  <HeartPulse size={22} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{item.nama}</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2"><MapPin size={14} /> {item.lokasi}</div>
                <div className="flex items-center gap-2"><Calendar size={14} /> {item.jadwal}</div>
                {item.ketua_kader && <div className="flex items-center gap-2"><Users size={14} /> Kader: {item.ketua_kader}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Posyandu" : "Tambah Posyandu Baru"}</h3>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[{ key: "nama", label: "Nama Posyandu", required: true, placeholder: "Cth: Posyandu Melati I" },
                { key: "lokasi", label: "Lokasi", required: true, placeholder: "Cth: RT 01 RW 02, Blok A" },
                { key: "jadwal", label: "Jadwal Rutin", required: true, placeholder: "Cth: Setiap Rabu, minggu ke-2, pukul 08.00 WIB" },
                { key: "ketua_kader", label: "Nama Ketua/Kader", required: false, placeholder: "Cth: Ibu Sari" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                  <input
                    type="text"
                    required={f.required}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                  <Save size={18} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
