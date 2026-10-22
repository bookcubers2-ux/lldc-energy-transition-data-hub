"""Apply the four criteria, merge seed nodes, export GeoJSON + CSV for the web app."""
import sys, json, geopandas as gpd, pandas as pd
from common import load_country, load_costs, processed, PROCESSED, WEB_DATA

country, C = load_country(sys.argv[1]), load_costs()
T = C["thresholds"]
st = gpd.read_file(processed(country, "settlements_costs.gpkg"))

st["priority"] = (
    (st.dist_to_grid_km > T["min_distance_km"]) &
    (st.grid_cost_per_km_usd > T["min_grid_cost_per_km"]) &
    (st.ghi_kwh_m2_day > T["min_ghi"]) &
    (st.households > T["min_households"]) &
    (st.ratio_grid_over_bess > T["min_ratio"])
)
st["country"] = country["country"]
st["data_version"] = "1.2"
st["node_id"] = st["settlement_id"]
st["name"] = st.get("name", st["settlement_id"])
st["region"] = st.get("region", "")

cols = ["node_id", "name", "country", "region", "households", "elevation_m", "dist_to_grid_km",
        "grid_cost_per_km_usd", "grid_cost_usd", "bess_cost_usd", "grid_lifetime_usd",
        "bess_lifetime_usd", "ghi_kwh_m2_day", "battery_kwh", "pv_kwp",
        "ratio_grid_over_bess", "verdict", "priority", "data_version", "geometry"]
out = st[cols].round(2)
out.to_file(processed(country, "nodes.geojson"), driver="GeoJSON")

# Merge all countries + seed nodes into the master files the web app reads
frames = [gpd.read_file(p) for p in PROCESSED.glob("*_nodes.geojson")]
seed = PROCESSED / "seed_nodes.geojson"
if seed.exists():
    frames.append(gpd.read_file(seed))
allnodes = gpd.GeoDataFrame(pd.concat(frames, ignore_index=True), crs="EPSG:4326")
allnodes = allnodes.drop_duplicates(subset="node_id", keep="last")
allnodes.to_file(WEB_DATA / "nodes.geojson", driver="GeoJSON")
allnodes.drop(columns="geometry").assign(
    lon=allnodes.geometry.x, lat=allnodes.geometry.y).to_csv(PROCESSED / "nodes.csv", index=False)
print(int(allnodes.priority.sum()), "priority nodes of", len(allnodes))
