"use client";

import { useState } from "react";
import { AlertCircle, Phone, X, ShieldAlert, Ambulance, Flame } from "lucide-react";

export default function PanicButton() {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyContacts = [
    { name: "Ambulans Desa", number: "0812-3456-7890", icon: Ambulance, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Polisi / Bhabinkamtibmas", number: "0811-2233-4455", icon: ShieldAlert, color: "text-gray-800", bg: "bg-gray-200" },
    { name: "Pemadam Kebakaran", number: "113", icon: Flame, color: "text-red-500", bg: "bg-red-100" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 
          ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-red-600 text-white animate-pulse'}`}
      >
        {isOpen ? <X size={28} /> : <AlertCircle size={32} />}
      </button>

      {/* Popup Menu */}
      <div 
        className={`absolute bottom-20 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 transform transition-all origin-bottom-right 
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">Panggilan Darurat</h3>
            <p className="text-xs text-gray-500">Siaga 24 Jam Desa Budur</p>
          </div>
        </div>

        <div className="space-y-3">
          {emergencyContacts.map((contact, idx) => (
            <a 
              key={idx}
              href={`tel:${contact.number}`}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${contact.bg} ${contact.color}`}>
                  <contact.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{contact.name}</h4>
                  <p className="text-xs text-gray-500">{contact.number}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Phone size={14} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
