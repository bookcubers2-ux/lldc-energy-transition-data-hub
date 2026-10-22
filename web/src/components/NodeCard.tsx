import type { NodeFeature } from "../types";
import { download } from "../data";
import { useT } from "../i18n";
import CostBars from "./CostBars";

export default function NodeCard({ node }: { node: NodeFeature | null }) {
  const { t } = useT();
  if (!node) return <div className="card"><h3>{t("pickNode")}</h3></div>;
  const p = node.properties;
  return (
    <div className="card">
      <h2>{p.name}</h2>
      <div className="meta">{p.node_id} · {p.region}, {p.country} · {p.elevation_m.toLocaleString()} m</div>
      <span className={`verdict ${p.verdict}`}>{p.verdict === "BATTERY" ? t("verdictB") : t("verdictW")}</span>
      <div className="ratio">{p.ratio_grid_over_bess.toFixed(2)}×</div>
      <div className="kv">
        <span>{t("households")}</span><b>{p.households}</b>
        <span>Distance to grid</span><b>{p.dist_to_grid_km.toFixed(1)} km</b>
        <span>GHI</span><b>{p.ghi_kwh_m2_day.toFixed(2)} kWh/m²/day</b>
        <span>Grid cost / km</span><b>USD {Math.round(p.grid_cost_per_km_usd).toLocaleString()}</b>
      </div>
      <h3>{t("capex")}</h3>
      <CostBars p={p} />
      <h3>{t("lifetime")}</h3>
      <CostBars p={p} lifetime />
      <h3>{t("system")}</h3>
      <div className="kv">
        <span>PV</span><b>{p.pv_kwp.toFixed(1)} kWp</b>
        <span>Battery</span><b>{p.battery_kwh.toFixed(0)} kWh</b>
      </div>
      <button onClick={() => download(`${p.node_id}.geojson`, JSON.stringify(node, null, 2), "application/geo+json")}>{t("downloadNode")}</button>
    </div>
  );
}
