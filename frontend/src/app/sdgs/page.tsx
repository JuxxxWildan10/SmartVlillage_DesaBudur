"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Target } from "lucide-react";

export default function SdgsPage() {
  const [sdgsScores, setSdgsScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then(res => {
        if (res.data.status === "success") {
          setSdgsScores(res.data.data.sdgs_scores);
        }
      })
      .catch(err => console.error("Error fetching SDGs", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Activity size={16} /> Data Terbuka
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-heading mb-4">Capaian SDGs Desa</h1>
          <p className="text-gray-600 text-lg">
            Sustainable Development Goals (SDGs) Desa adalah upaya terpadu mewujudkan Desa tanpa kemiskinan dan kelaparan, Desa ekonomi tumbuh merata, Desa peduli kesehatan, lingkungan, pendidikan, dan tanggap budaya.
          </p>
        </div>

        {loading ? (
          <div className="flex-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdgsScores.map((sdg) => (
              <div key={sdg.goal_number} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex-center text-white font-bold text-xl shadow-inner"
                      style={{ backgroundColor: sdg.color_hex }}
                    >
                      {sdg.goal_number}
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 leading-tight">
                      {sdg.title}
                    </h3>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-500">Skor Capaian</span>
                    <span style={{ color: sdg.color_hex }}>{sdg.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${sdg.score}%`, backgroundColor: sdg.color_hex }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
