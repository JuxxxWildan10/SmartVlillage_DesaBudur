"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";

// Dynamically import Leaflet map to avoid SSR issues
const Map = dynamic(
  () => import("./LeafletMap"),
  { ssr: false, loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl flex-center">Memuat Peta...</div> }
);

export default function MapContainer() {
  const [gisData, setGisData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
      .then(res => {
        if (res.data.status === "success") {
          setGisData(res.data.data.gis_features);
        }
      })
      .catch(err => console.error("Error fetching GIS data", err));
  }, []);

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
      <Map gisData={gisData} />
    </div>
  );
}
