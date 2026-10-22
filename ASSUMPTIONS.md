# Cost assumptions (v1.2)

Every number below is read from `pipeline/config/costs.yaml`. Change the YAML, re-run the pipeline, and the map updates.

## Grid extension

| Parameter | Value | Source |
|---|---|---|
| Base cost, MV line, flat terrain | 12,000 USD/km | ENDE unit costs; World Bank ESMAP |
| Slope multiplier | +2.5% per degree of mean slope | ENDE terrain factors |
| Altitude multiplier | ×1.15 above 3,500 m; ×1.30 above 4,000 m | ENDE |
| Forest-cover multiplier | ×1.40 when canopy cover > 60% | World Bank |
| Landlocked logistics premium | ×1.12 on all materials | World Bank LLDC trade-cost studies |

## Solar + storage (BESS)

| Parameter | Value | Source |
|---|---|---|
| Daily demand per household | 2.0 kWh | field surveys, ENDE rural programme |
| Days of autonomy | 1.5 | design choice |
| Battery depth of discharge | 0.85 (LFP) | manufacturer data |
| Installed battery cost | 280 USD/kWh | BloombergNEF, Lazard LCOS (small-scale, installed) |
| Installed PV cost | 1,100 USD/kWp | Lazard LCOE; BNEF |
| PV sizing | household daily kWh / (GHI × 0.75 performance ratio) | standard |
| Balance of system + installation | 25% of equipment | Lazard |
| Battery replacement at year 10 | included in 20-year levelised cost | Lazard LCOS |
| O&M | 2% of CAPEX per year | Lazard |
| Discount rate (levelised cost) | 8% | IRENA renewable cost methodology |

## Thresholds (priority node)

| Criterion | Threshold |
|---|---|
| Distance to grid | > 20 km |
| Grid cost per km | > 15,000 USD |
| GHI | > 4.5 kWh/m²/day |
| Households | > 50 |
| Ratio grid / BESS | > 1 |
