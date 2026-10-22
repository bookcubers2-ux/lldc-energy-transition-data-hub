export default function Methodology() {
  return (
    <article className="prose">
      <h1>Method</h1>
      <p>Every settlement gets two costs and one verdict. A settlement becomes a <b>priority storage node</b> when all four criteria hold and the grid costs more than storage.</p>
      <div className="criteria">
        <div><b>&gt; 20 km</b>from the existing grid</div>
        <div><b>&gt; USD 15k</b>per km of extension</div>
        <div><b>&gt; 4.5</b>kWh/m²/day of irradiation</div>
        <div><b>&gt; 50</b>households</div>
      </div>
      <h2>Formulas</h2>
      <pre>{`grid_cost   = distance_km × cost_per_km(slope, altitude, forest, landlocked premium)
battery_kWh = households × 2.0 kWh/day × 1.5 days autonomy / 0.85 DoD
pv_kWp      = households × 2.0 kWh/day / (GHI × 0.75)
bess_cost   = (battery_kWh × 280 + pv_kWp × 1,100) × 1.25
ratio       = grid_cost / bess_cost
verdict     = BATTERY if ratio > 1 else WIRE
priority    = four criteria AND ratio > 1`}</pre>
      <p>Both costs are also shown as a 20-year levelised figure (8% discount rate, 2% O&amp;M, battery replacement at year 10) so that a financier and a planner read the same card.</p>
      <h2>Data layers</h2>
      <table>
        <thead><tr><th>Layer</th><th>Source</th><th>Resolution</th></tr></thead>
        <tbody>
          <tr><td>Grid-extension unit cost</td><td>ENDE, World Bank ESMAP</td><td>country tables</td></tr>
          <tr><td>Storage and PV CAPEX</td><td>BloombergNEF, Lazard</td><td>annual</td></tr>
          <tr><td>Solar irradiation (GHI)</td><td>Global Solar Atlas</td><td>~1 km</td></tr>
          <tr><td>Population → households</td><td>WorldPop 2020</td><td>100 m</td></tr>
          <tr><td>Existing grid</td><td>OpenStreetMap power=line / minor_line</td><td>vector</td></tr>
          <tr><td>Elevation and slope</td><td>Copernicus DEM GLO-30</td><td>30 m</td></tr>
          <tr><td>Canopy cover</td><td>GLAD tree cover</td><td>30 m</td></tr>
        </tbody>
      </table>
      <h2>Limitations</h2>
      <ul>
        <li>Distance to grid is Euclidean in UTM; routed corridors would raise grid costs further.</li>
        <li>OpenStreetMap under-maps rural distribution lines; utility shapefiles replace it where available.</li>
        <li>Household demand is a single national assumption; productive uses (pumps, mills, clinics) are not sized yet.</li>
        <li>Costs are in constant USD and exclude import duties beyond the landlocked premium.</li>
      </ul>
      <p>All parameters live in <code>pipeline/config/costs.yaml</code>. Change one, re-run, and every node updates.</p>
    </article>
  );
}
