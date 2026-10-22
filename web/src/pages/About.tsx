export default function About() {
  return (
    <article className="prose">
      <h1>About</h1>
      <p>In a landlocked country a transmission line can cost more than the village it reaches. Every tower, conductor and transformer enters through someone else's port. Distributed solar with battery storage removes that penalty. The Hub turns a field intuition ("the grid is never coming here") into a number a planner can take to a regulator or a financier.</p>
      <h2>Who</h2>
      <p>Built by a two-person team: data architecture lead and a geospatial developer. Python (GeoPandas, rasterio) on the back end; React and Leaflet on the front end. Released under the MIT licence in August 2025; current version 1.2.</p>
      <h2>Context</h2>
      <ul>
        <li>Thesis presented as <i>Storage over Wires: The Economic Case for Batteries in Andean LLDCs</i>, IEEE Regional Power &amp; Energy Summit, Cochabamba, November 2025.</li>
        <li>Technical evidence for the Awaza Youth Declaration (LLDC3, Turkmenistan, 2025) clauses on technology transfer for decentralised storage.</li>
        <li>Field counterpart: the Youth Grid Innovators Network (YGIN), whose engineers install and maintain the systems the Hub prioritises.</li>
      </ul>
      <h2>Roadmap</h2>
      <ul>
        <li>2027: risk APIs (climate, access, payment) and investment-ready node sheets, so that mapped nodes become built batteries.</li>
        <li>Expansion to the remaining 30 LLDCs, starting with Zambia, Uganda, Malawi and Central Asia.</li>
      </ul>
      <h2>Cite</h2>
      <pre>{`LLDC Energy Transition Data Hub (2026). Version 1.2. MIT licence.`}</pre>
    </article>
  );
}
