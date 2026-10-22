import { useEffect, useState } from "react";
import type { NodeFeature, NodeProps, FilterState } from "./types";

export function useNodes() {
  const [nodes, setNodes] = useState<NodeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("./data/nodes.geojson")
      .then((r) => r.json())
      .then((fc) => setNodes(fc.features))
      .finally(() => setLoading(false));
  }, []);
  return { nodes, loading };
}

/** Recompute a node under a user-chosen cost per km (slider). */
export function applyCostOverride(p: NodeProps, costPerKm: number | null): NodeProps {
  if (costPerKm === null) return p;
  const grid_cost_usd = costPerKm * p.dist_to_grid_km;
  const ratio = grid_cost_usd / p.bess_cost_usd;
  return {
    ...p,
    grid_cost_per_km_usd: costPerKm,
    grid_cost_usd,
    grid_lifetime_usd: grid_cost_usd * (p.grid_lifetime_usd / p.grid_cost_usd),
    ratio_grid_over_bess: ratio,
    verdict: ratio > 1 ? "BATTERY" : "WIRE"
  };
}

export function filterNodes(nodes: NodeFeature[], f: FilterState): NodeFeature[] {
  return nodes
    .map((n) => ({ ...n, properties: applyCostOverride(n.properties, f.costPerKm) }))
    .filter(({ properties: p }) =>
      (f.country === "ALL" || p.country === f.country) &&
      p.households >= f.minHouseholds &&
      p.dist_to_grid_km >= f.minDistance &&
      p.ghi_kwh_m2_day >= f.minGhi &&
      (!f.onlyPriority || p.priority)
    );
}

export const usd = (v: number) => "USD " + Math.round(v).toLocaleString("en-US");

export function toCSV(nodes: NodeFeature[]): string {
  const keys = Object.keys(nodes[0]?.properties ?? {}) as (keyof NodeProps)[];
  const head = [...keys, "lon", "lat"].join(",");
  const rows = nodes.map((n) => [...keys.map((k) => JSON.stringify(n.properties[k] ?? "")), ...n.geometry.coordinates].join(","));
  return [head, ...rows].join("\n");
}

export function download(filename: string, content: string, type: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
}
