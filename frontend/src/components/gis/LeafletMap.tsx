"use client";

import { MapContainer as LeafletContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ gisData }: { gisData: any[] }) {
  // Center of Budur, Ciwaringin (Actual coordinate)
  const center: [number, number] = [-6.6779, 108.3571];

  return (
    <LeafletContainer center={center} zoom={14} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {gisData.map((feature, index) => {
        if (feature.geojson_data?.geometry?.type === "Polygon") {
          // Leaflet expects [lat, lng], GeoJSON is [lng, lat]
          const positions = feature.geojson_data.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
          return (
            <Polygon 
              key={index} 
              positions={positions} 
              pathOptions={{ color: feature.color, fillColor: feature.color, fillOpacity: 0.6, weight: 4 }}
            >
              <Popup>
                <div className="font-bold text-primary">{feature.name}</div>
                <div className="text-sm">{feature.type}</div>
              </Popup>
            </Polygon>
          );
        }
        return null;
      })}
    </LeafletContainer>
  );
}
