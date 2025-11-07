"use client";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const catColor = {
  festival: "var(--pin-festival)",
  indoor: "var(--pin-indoor)",
  learn: "var(--pin-learn)",
  other: "var(--pin-other)",
};

// 円形カスタムマーカー
function circleIcon(color) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
      <circle cx='14' cy='14' r='10' fill='${color}' stroke='white' stroke-width='2'/>
    </svg>`
  );
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12]
  });
}

function FlyToSelected({ items, selectedId }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const it = items.find((i) => i.id === selectedId);
    if (it) map.flyTo([it.lat, it.lng], 14, { duration: 0.6 });
  }, [selectedId, items, map]);
  return null;
}

export default function MapView({ items, selectedId, onSelect }) {
  // 初期中心：札幌駅
  const center = [43.0687, 141.3508];

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        // 無料OSMタイル（商用・大量アクセスは自前/有料タイル推奨）
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {items.map((it) => (
        <Marker
          key={it.id}
          position={[it.lat, it.lng]}
          icon={circleIcon(catColor[it.category] || catColor.other)}
          eventHandlers={{ click: () => onSelect(it.id) }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong>{it.title}</strong><br />
              <small>{it.start_date}〜{it.end_date}</small><br />
              <small>{it.venue_name}</small><br />
              {it.url_official ? (
                <a href={it.url_official} target="_blank" rel="noreferrer">公式</a>
              ) : null}
            </div>
          </Popup>
        </Marker>
      ))}
      <FlyToSelected items={items} selectedId={selectedId} />
    </MapContainer>
  );
}
