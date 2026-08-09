"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Eye, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForumPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [newTopic, setNewTopic] = useState({ judul: "", isi: "" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role) setIsAuth(true);

    const fetchTopics = async () => {
      try {
        // Forum adalah public endpoint — gunakan axios biasa, bukan authenticated api client
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/forum`);
        setTopics(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat topik forum.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error("Harap login terlebih dahulu untuk memposting di forum!");
      router.push("/auth/login");
      return;
    }
    setPosting(true);
    try {
      const res = await api.post("/forum", newTopic);
      setTopics([res.data.data, ...topics]);
      setNewTopic({ judul: "", isi: "" });
      toast.success("Topik berhasil diposting!");
    } catch (err) {
      toast.error("Gagal memposting topik. Coba lagi.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Forum Warga</h1>
          <p className="text-xl text-gray-600">
            Ruang diskusi terbuka untuk seluruh warga Desa Budur. Sampaikan gagasan, pertanyaan, atau informasi Anda di sini.
          </p>
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Topik Baru</h2>
          {isAuth ? (
            <form onSubmit={handlePost}>
              <input 
                type="text" 
                required
                value={newTopic.judul}
                onChange={(e) => setNewTopic({...newTopic, judul: e.target.value})}
                placeholder="Judul Diskusi" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 mb-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              />
              <textarea 
                required
                value={newTopic.isi}
                onChange={(e) => setNewTopic({...newTopic, isi: e.target.value})}
                placeholder="Apa yang ingin Anda diskusikan?" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 mb-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all h-24 resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={posting} className="bg-primary hover:bg-primary-dark disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
                  {posting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />} {posting ? "Memposting..." : "Posting Topik"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 mb-4">Anda harus masuk (login) untuk membuat topik diskusi baru.</p>
              <button 
                onClick={() => router.push("/auth/login")}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
              >
                Login Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Memuat diskusi...</div>
          ) : topics.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-3xl">Belum ada topik diskusi. Jadilah yang pertama!</div>
          ) : (
            topics.map(topic => (
              <div key={topic.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3
                    onClick={() => router.push(`/forum/${topic.id}`)}
                    className="text-xl font-bold text-gray-900 cursor-pointer hover:text-primary transition-colors"
                  >                    {topic.judul}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${topic.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {topic.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{topic.isi}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{topic.user_nik ? topic.user_nik.substring(0, 4) + "****" + topic.user_nik.substring(12) : "Anonim"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{topic.views} dilihat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>{topic.replies_count || 0} balasan</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
