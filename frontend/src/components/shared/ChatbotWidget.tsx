"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Saya Asisten Pintar Desa Budur. Ada yang bisa saya bantu terkait layanan desa?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Mock bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { sender: "bot", text: "Terima kasih atas pesan Anda. Saat ini integrasi AI sedang dalam pengembangan tahap akhir. Silakan kunjungi menu Layanan untuk fitur e-Surat." }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gold hover:bg-gold-light text-primary-dark rounded-full flex-center shadow-2xl transition-transform hover:scale-110 z-50 ${isOpen ? "hidden" : "flex"}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-primary-dark text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-bold font-heading text-sm">Asisten Desa AI</h4>
                <p className="text-xs text-gold-light">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-white rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white w-10 h-10 rounded-full flex-center transition-colors shrink-0"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
