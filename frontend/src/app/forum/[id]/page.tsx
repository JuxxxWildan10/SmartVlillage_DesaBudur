"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, Send, Users, Clock, ArrowLeft, ChevronRight, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userNik, setUserNik] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const nik = localStorage.getItem("user_nik");
    if (token) setIsAuth(true);
    if (nik) setUserNik(nik);
  }, []);

  const fetchTopic = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/forum/${params.id}`);
      if (res.data.status === "success") {
        setTopic(res.data.data);
      }
    } catch {
      toast.error("Topik tidak ditemukan.");
      router.push("/forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchTopic();
  }, [params.id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isAuth) {
      toast.error("Harap login untuk membalas.");
      router.push("/auth/login");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/forum/${params.id}/reply`, { isi: replyText });
      setReplyText("");
      toast.success("Balasan berhasil dikirim!");
      fetchTopic(); // Refresh to show new reply
    } catch {
      toast.error("Gagal mengirim balasan.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => router.push("/forum")} className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Forum Warga
          </button>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium truncate max-w-xs">{topic.judul}</span>
        </div>

        {/* Main Topic Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading leading-tight">
              {topic.judul}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              topic.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {topic.status}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{topic.isi}</p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-2">
              <Users size={15} /> Oleh: <strong className="text-gray-600">{topic.user_nik}</strong>
            </span>
            <span className="flex items-center gap-2">
              <Clock size={15} /> {formatDate(topic.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare size={15} /> {topic.replies?.length || 0} Balasan
            </span>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            {topic.replies?.length || 0} Balasan
          </h2>

          {topic.replies && topic.replies.length > 0 ? (
            <div className="space-y-4">
              {topic.replies.map((reply: any, idx: number) => (
                <div
                  key={reply.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-4"
                >
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm">{reply.user_nik}</span>
                      <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{reply.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
              <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Belum ada balasan. Jadilah yang pertama!</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tulis Balasan</h3>
          {isAuth ? (
            <form onSubmit={handleReply}>
              <textarea
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan Anda di sini..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none mb-4 text-gray-800"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send size={18} /> Kirim Balasan</>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 mb-4">Anda harus <strong>login</strong> untuk membalas diskusi ini.</p>
              <button
                onClick={() => router.push(`/auth/login?redirect=/forum/${params.id}`)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                Login Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
