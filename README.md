# LLDC Energy Transition Data Hub

**Wire, or battery?** An open-source map for the 32 landlocked developing countries (LLDCs) that compares, settlement by settlement, the cost of extending the transmission grid against the cost of installing solar + battery storage on site.

Version 1.2 · MIT licence · Lead: Carlos (data architecture)

## What it does

For every remote settlement the Hub computes two numbers:

- `grid_cost_usd` — cost of extending the existing network to the settlement, scaled by terrain (slope, altitude, forest cover).
- `bess_cost_usd` — cost of a solar + battery (BESS) system sized for the settlement's households.

A settlement is a **priority storage node** when all four criteria hold:

1. More than **20 km** from the existing grid.
2. Grid extension costs more than **USD 15,000 per km** because of topography.
3. Solar irradiation above **4.5 kWh/m²/day**.
4. More than **50 households**.

and `grid_cost_usd / bess_cost_usd > 1`.

## Data layers

| Layer | Source |
|---|---|
| Grid-extension cost per km | ENDE (Bolivia), World Bank |
| Storage CAPEX | BloombergNEF, Lazard |
| Solar irradiation (GHI) | Global Solar Atlas |
| Population / households | WorldPop |
| Existing grid | OpenStreetMap `power=line`, `power=minor_line` |
| Elevation | Copernicus DEM GLO-30 |

All cost assumptions, with source and year, are in [`ASSUMPTIONS.md`](ASSUMPTIONS.md) and `pipeline/config/costs.yaml`.

## Run the pipeline

```bash
cd pipeline
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
bash run_all.sh bolivia
bash run_all.sh paraguay
```

Outputs land in `data/processed/` and are copied to `web/public/data/`.

## Run the web app

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in web/dist
```

Deploy `web/dist` to GitHub Pages, Vercel or any static host.

## Cite

See `CITATION.cff`.
