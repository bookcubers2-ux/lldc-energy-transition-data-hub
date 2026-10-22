"""Indicative seed nodes (placeholder inputs) run through the same cost model as 04/05.

Inputs per settlement are approximate and meant to be replaced by pipeline output.
Usage: python indicative_nodes.py   -> data/processed/seed_nodes.geojson + web/public/data/nodes.geojson
"""
import json
from common import load_costs, PROCESSED, WEB_DATA

C = load_costs(); G, B, T = C["grid"], C["bess"], C["thresholds"]

# name, country, region, lon, lat, households, elevation_m, dist_km, slope_deg, forest_pct, corridor_elev, ghi
SITES = [
    ("San Antonio de Esmoruco", "BOL", "Potosí", -66.52, -21.95, 70, 4200, 46, 9, 0, 4100, 6.5),
    ("Quetena Chico", "BOL", "Potosí", -67.40, -22.18, 55, 4150, 62, 8, 0, 4200, 6.6),
    ("Colcha K", "BOL", "Potosí", -67.66, -20.74, 120, 3780, 25, 4, 0, 3750, 6.3),
    ("Llica", "BOL", "Potosí", -68.13, -19.85, 180, 3660, 34, 3, 0, 3680, 6.2),
    ("Charaña", "BOL", "La Paz", -69.45, -17.59, 150, 4060, 30, 6, 0, 4050, 6.1),
    ("Curahuara de Carangas", "BOL", "Oruro", -68.40, -17.84, 140, 3900, 16, 7, 0, 3950, 6.0),
    ("Apolo", "BOL", "La Paz", -68.41, -14.72, 320, 1400, 42, 14, 70, 1800, 4.6),
    ("Ixiamas", "BOL", "La Paz", -68.13, -13.76, 400, 260, 95, 1, 75, 280, 4.8),
    ("Baures", "BOL", "Beni", -63.58, -13.66, 250, 180, 120, 0.5, 65, 190, 4.9),
    ("San Matías", "BOL", "Santa Cruz", -58.40, -16.36, 1200, 130, 180, 1, 55, 200, 5.3),
    ("Ibibobo", "BOL", "Tarija", -63.00, -21.55, 70, 290, 12, 2, 40, 300, 5.4),
    ("Bahía Negra", "PRY", "Alto Paraguay", -58.17, -20.23, 200, 100, 140, 0.5, 30, 110, 5.3),
    ("Fuerte Olimpo", "PRY", "Alto Paraguay", -57.88, -21.04, 300, 110, 60, 1, 45, 120, 5.2),
    ("Puerto Casado", "PRY", "Alto Paraguay", -57.94, -22.29, 650, 100, 15, 0.5, 40, 100, 5.1),
    ("Mayor Pablo Lagerenza", "PRY", "Alto Paraguay", -60.79, -19.93, 60, 260, 210, 0.5, 50, 250, 5.5),
    ("Campo Loro", "PRY", "Boquerón", -60.30, -22.07, 140, 160, 22, 0.5, 35, 160, 5.4),
    ("Infante Rivarola", "PRY", "Boquerón", -62.20, -21.70, 55, 300, 160, 0.5, 45, 300, 5.6),
    ("Pozo Hondo", "PRY", "Boquerón", -62.55, -22.33, 60, 260, 130, 0.5, 50, 260, 5.6),
    ("Filadelfia", "PRY", "Boquerón", -60.03, -22.35, 3000, 130, 0.5, 0.5, 20, 130, 5.4),
]


def npv(r, n):
    return sum(1 / (1 + r) ** t for t in range(1, n + 1))


def cost_per_km(slope, corr_elev, forest):
    c = G["base_usd_per_km"] * (1 + G["slope_pct_per_degree"] / 100 * slope)
    for m in G["altitude_multipliers"]:
        if corr_elev > m["above_m"]:
            c *= m["factor"]
    if forest > G["forest_threshold_pct"]:
        c *= G["forest_multiplier"]
    return c * G["landlocked_premium"]


r, H = B["discount_rate"], B["horizon_years"]
features = []
for i, (name, cc, region, lon, lat, hh, elev, dist, slope, forest, corr, ghi) in enumerate(SITES):
    ckm = cost_per_km(slope, corr, forest)
    grid = ckm * dist
    daily = hh * B["demand_kwh_per_household_day"]
    bat = daily * B["autonomy_days"] / B["depth_of_discharge"]
    pv = daily / (max(ghi, 3.0) * B["performance_ratio"])
    bess = (bat * B["battery_usd_per_kwh"] + pv * B["pv_usd_per_kwp"]) * (1 + B["bos_fraction"])
    bess_life = bess + bess * B["om_fraction_per_year"] * npv(r, H) + \
        bat * B["battery_usd_per_kwh"] * B["battery_replacement_fraction"] / (1 + r) ** B["battery_replacement_year"]
    ratio = grid / bess
    priority = (dist > T["min_distance_km"] and ckm > T["min_grid_cost_per_km"] and ghi > T["min_ghi"]
                and hh > T["min_households"] and ratio > T["min_ratio"])
    features.append({"type": "Feature", "geometry": {"type": "Point", "coordinates": [lon, lat]}, "properties": {
        "node_id": f"{cc}-IND-{i + 1:03d}", "name": name, "country": cc, "region": region, "households": hh,
        "elevation_m": elev, "dist_to_grid_km": dist, "grid_cost_per_km_usd": round(ckm, 2),
        "grid_cost_usd": round(grid, 2), "bess_cost_usd": round(bess, 2),
        "grid_lifetime_usd": round(grid * (1 + 0.015 * npv(r, H)), 2), "bess_lifetime_usd": round(bess_life, 2),
        "ghi_kwh_m2_day": ghi, "battery_kwh": round(bat, 2), "pv_kwp": round(pv, 2),
        "ratio_grid_over_bess": round(ratio, 2), "verdict": "BATTERY" if ratio > 1 else "WIRE",
        "priority": bool(priority), "data_version": "1.2-indicative"}})

seed_path = PROCESSED / "seed_nodes.geojson"
seed = json.loads(seed_path.read_text(encoding="utf-8"))
keep = [f for f in seed["features"] if "-IND-" not in f["properties"]["node_id"]]
fc = {"type": "FeatureCollection", "features": keep + features}
for p in (seed_path, WEB_DATA / "nodes.geojson"):
    p.write_text(json.dumps(fc, ensure_ascii=False, indent=1), encoding="utf-8")
print(sum(f["properties"]["priority"] for f in fc["features"]), "priority of", len(fc["features"]))
for f in fc["features"]:
    q = f["properties"]; print(f'{q["name"]:24} {q["verdict"]:7} {q["ratio_grid_over_bess"]:6} prio={q["priority"]} ckm={q["grid_cost_per_km_usd"]:.0f}')
