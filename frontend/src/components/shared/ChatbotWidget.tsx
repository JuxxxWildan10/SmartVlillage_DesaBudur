"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  sender: "bot" | "user";
  text: string;
};

const QUICK_REPLIES = [
  "Cara buat surat online?",
  "Jam buka balai desa?",
  "Cara lapor pengaduan?",
  "Cek status bansos?",
];

const getBotReply = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("surat") || lower.includes("dokumen") || lower.includes("buat surat"))
    return "Untuk membuat surat online, silakan login ke portal, lalu pilih menu **e-Surat**. Tersedia berbagai jenis surat seperti Keterangan Usaha, Domisili, dan lainnya. Proses ±1–2 hari kerja.";
  if (lower.includes("ktp") || lower.includes("kk") || lower.includes("kartu keluarga"))
    return "Untuk pengurusan KTP atau KK, bawalah surat pengantar dari RT/RW ke Balai Desa. Admin akan meneruskan ke Disdukcapil.";
  if (lower.includes("pengaduan") || lower.includes("lapor") || lower.includes("masalah") || lower.includes("keluhan"))
    return "Anda bisa melapor melalui menu **Pengaduan** di portal. Login terlebih dahulu, lalu isi formulir laporan. Tim desa akan menindaklanjutinya.";
  if (lower.includes("jam") || lower.includes("buka") || lower.includes("operasional") || lower.includes("tutup"))
    return "Balai Desa Budur buka **Senin–Jumat, 08.00–15.00 WIB**. Sabtu & Minggu tutup. Namun portal online bisa diakses 24 jam!";
  if (lower.includes("bansos") || lower.includes("bantuan") || lower.includes("pkh") || lower.includes("blt"))
    return "Untuk cek status bantuan sosial, buka menu **Bansos** di portal. Masukkan NIK atau nomor KK untuk melihat status penerima.";
  if (lower.includes("halo") || lower.includes("hi") || lower.includes("pagi") || lower.includes("siang") || lower.includes("malam"))
    return "Halo! Selamat datang di portal Desa Budur 👋. Ada yang bisa saya bantu? Coba tanyakan tentang surat, pengaduan, atau jam buka balai desa.";
  if (lower.includes("terima kasih") || lower.includes("makasih") || lower.includes("thanks"))
    return "Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk tanya lagi ya.";
  if (lower.includes("umkm") || lower.includes("produk") || lower.includes("belanja"))
    return "Anda bisa melihat produk UMKM lokal Desa Budur melalui menu **Beli Produk Desa** di navigasi utama. Dukung ekonomi desa!";
  if (lower.includes("sdgs") || lower.includes("pembangunan") || lower.includes("program"))
    return "Informasi capaian program pembangunan dan SDGs Desa Budur bisa dilihat di menu **SDGs Desa** dan **Transparansi APBDes**.";
  return "Maaf, saya belum mengerti pertanyaan tersebut 🙏. Coba tanyakan tentang: 'surat', 'pengaduan', 'jam buka', 'bansos', atau 'UMKM'.";
};

export default function ChatbotWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Halo! Saya Asisten Pintar Desa Budur 🌿. Ada yang bisa saya bantu terkait layanan desa?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowQuickReplies(false);

    const newMessages: Message[] = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const reply = getBotReply(text);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
      if (!isOpen) setHasNewMessage(true);
    }, 900 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50 flex flex-col border border-gray-200"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark to-primary text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-sm">Asisten Desa AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <p className="text-xs text-green-300 font-medium">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Tutup chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 min-h-0" style={{ maxHeight: "320px" }}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mr-2 mt-auto">
                      <Sparkles size={12} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-primary" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </motion.div>
              )}

              {/* Quick Replies */}
              {showQuickReplies && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2 mt-1"
                >
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary hover:text-white transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Tulis pertanyaan Anda..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 hover:scale-105 disabled:scale-100"
              >
                <Send size={15} className="-ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
