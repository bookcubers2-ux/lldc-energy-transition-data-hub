import { useNodes, toCSV, download } from "../data";
import { useT } from "../i18n";

const FIELDS: [string, string][] = [
  ["node_id", "Stable identifier"], ["name", "Settlement name"], ["country", "ISO3"], ["region", "Department / region"],
  ["households", "Estimated households (WorldPop / 4.2)"], ["elevation_m", "Elevation, metres"],
  ["dist_to_grid_km", "Distance to nearest existing line"], ["grid_cost_per_km_usd", "Terrain-adjusted cost per km"],
  ["grid_cost_usd", "Grid extension CAPEX"], ["bess_cost_usd", "Solar + storage CAPEX"],
  ["grid_lifetime_usd", "Grid, 20-year levelised"], ["bess_lifetime_usd", "Storage, 20-year levelised"],
  ["ghi_kwh_m2_day", "Global horizontal irradiation"], ["battery_kwh", "Proposed battery size"], ["pv_kwp", "Proposed PV size"],
  ["ratio_grid_over_bess", "grid_cost / bess_cost"], ["verdict", "BATTERY or WIRE"], ["priority", "All four criteria met"],
  ["data_version", "Pipeline version"]
];

export default function Data() {
  const { nodes } = useNodes();
  const { t } = useT();
  return (
    <article className="prose">
      <h1>Open data</h1>
      <p>Every node, every field, MIT-licensed. Attribute as "LLDC Energy Transition Data Hub v1.2".</p>
      <p><i>Nodes marked <code>1.2-indicative</code> use approximate inputs run through the full cost model; they will be replaced by pipeline output.</i></p>
      <p>
        <button className="btn primary" onClick={() => download("lldc_nodes.csv", toCSV(nodes), "text/csv")}>{t("downloadAll")}</button>{" "}
        <button className="btn ghost" onClick={() => download("lldc_nodes.geojson", JSON.stringify({ type: "FeatureCollection", features: nodes }), "application/geo+json")}>{t("downloadGeo")}</button>
      </p>
      <h2>Data dictionary</h2>
      <table>
        <thead><tr><th>Field</th><th>Meaning</th></tr></thead>
        <tbody>{FIELDS.map(([k, v]) => <tr key={k}><td><code>{k}</code></td><td>{v}</td></tr>)}</tbody>
      </table>
    </article>
  );
}
