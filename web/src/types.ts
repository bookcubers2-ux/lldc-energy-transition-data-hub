export interface NodeProps {
  node_id: string;
  name: string;
  country: "BOL" | "PRY" | string;
  region: string;
  households: number;
  elevation_m: number;
  dist_to_grid_km: number;
  grid_cost_per_km_usd: number;
  grid_cost_usd: number;
  bess_cost_usd: number;
  grid_lifetime_usd: number;
  bess_lifetime_usd: number;
  ghi_kwh_m2_day: number;
  battery_kwh: number;
  pv_kwp: number;
  ratio_grid_over_bess: number;
  verdict: "BATTERY" | "WIRE";
  priority: boolean;
  data_version: string;
}

export interface NodeFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: NodeProps;
}

export interface FilterState {
  country: "ALL" | "BOL" | "PRY";
  minHouseholds: number;
  minDistance: number;
  minGhi: number;
  onlyPriority: boolean;
  costPerKm: number | null; // slider override; null = pipeline value
}

export const DEFAULT_FILTERS: FilterState = {
  country: "ALL", minHouseholds: 0, minDistance: 0, minGhi: 0, onlyPriority: false, costPerKm: null
};
