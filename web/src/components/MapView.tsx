import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { NodeFeature } from "../types";

const COLORS = { BATTERY: "#8FD98A", WIRE: "#E4572E" };

function Legend() {
  const map = useMap();
  useEffect(() => {
    const ctl = new L.Control({ position: "bottomright" });
    ctl.onAdd = () => {
      const d = L.DomUtil.create("div", "legend");
      d.innerHTML = `<i style="background:${COLORS.BATTERY}"></i>Battery wins<br><i style="background:${COLORS.WIRE}"></i>Wire wins<br><i style="background:#fff;border:2px solid #F2A93B"></i>Priority node`;
      return d;
    };
    ctl.addTo(map);
    return () => { ctl.remove(); };
  }, [map]);
  return null;
}

function FitBounds({ nodes }: { nodes: NodeFeature[] }) {
  const map = useMap();
  useEffect(() => {
    if (!nodes.length) return;
    const b = L.latLngBounds(nodes.map((n) => [n.geometry.coordinates[1], n.geometry.coordinates[0]] as [number, number]));
    map.fitBounds(b.pad(0.3), { maxZoom: 7 });
  }, [nodes.length]);
  return null;
}

export default function MapView({ nodes, selected, onSelect }: { nodes: NodeFeature[]; selected: NodeFeature | null; onSelect: (n: NodeFeature) => void }) {
  return (
    <MapContainer className="map" center={[-19.5, -62]} zoom={5} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds nodes={nodes} />
      <Legend />
      {nodes.map((n) => {
        const p = n.properties;
        const r = Math.max(5, Math.min(22, Math.sqrt(p.households) * 0.9));
        const isSel = selected?.properties.node_id === p.node_id;
        return (
          <CircleMarker
            key={p.node_id}
            center={[n.geometry.coordinates[1], n.geometry.coordinates[0]]}
            radius={r}
            pathOptions={{ color: isSel ? "#101828" : p.priority ? "#F2A93B" : "#ffffff", weight: isSel ? 3 : p.priority ? 2.5 : 1, fillColor: COLORS[p.verdict], fillOpacity: 0.85 }}
            eventHandlers={{ click: () => onSelect(n) }}
          >
            <Tooltip>{p.name} · {p.households} hh · {p.ratio_grid_over_bess.toFixed(2)}×</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
