"""Download raw layers: WorldPop population, GHI, DEM, OSM power lines, forest cover."""
import sys, requests
import osmnx as ox
import geopandas as gpd
from common import load_country, raw

country = load_country(sys.argv[1])
(raw(country, "")).mkdir(parents=True, exist_ok=True)


def fetch(url: str, dest):
    if dest.exists():
        print("exists", dest.name); return
    print("downloading", url)
    r = requests.get(url, stream=True, timeout=600)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(1 << 20):
            f.write(chunk)


fetch(country["worldpop_url"], raw(country, "population.tif"))
fetch(country["gsa_ghi_url"], raw(country, "ghi.tif"))
fetch(country["forest_cover_url"], raw(country, "forest.tif"))

# Existing grid from OpenStreetMap
grid_path = raw(country, "grid.gpkg")
if not grid_path.exists():
    print("fetching OSM power lines")
    tags = {"power": ["line", "minor_line", "cable"]}
    g = ox.features_from_place(country["osm_place"], tags=tags)
    g = g[g.geometry.type.isin(["LineString", "MultiLineString"])]
    g[["geometry"]].to_file(grid_path, driver="GPKG")

# DEM: Copernicus GLO-30 tiles via AWS open data (one tile per 1° cell inside the bbox)
import math, subprocess
dem_dir = raw(country, "dem"); dem_dir.mkdir(exist_ok=True)
w, s, e, n = country["bbox"]
for lat in range(math.floor(s), math.ceil(n)):
    for lon in range(math.floor(w), math.ceil(e)):
        ns = f"N{lat:02d}" if lat >= 0 else f"S{abs(lat):02d}"
        ew = f"E{lon:03d}" if lon >= 0 else f"W{abs(lon):03d}"
        tile = f"Copernicus_DSM_COG_10_{ns}_00_{ew}_00_DEM"
        url = f"https://copernicus-dem-30m.s3.amazonaws.com/{tile}/{tile}.tif"
        dest = dem_dir / f"{tile}.tif"
        if not dest.exists():
            try: fetch(url, dest)
            except Exception: pass  # ocean/empty tile

vrt = raw(country, "dem.vrt")
subprocess.run(["gdalbuildvrt", str(vrt)] + [str(p) for p in dem_dir.glob("*.tif")], check=True)
print("done")
