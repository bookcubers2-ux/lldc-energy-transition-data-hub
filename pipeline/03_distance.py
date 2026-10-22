"""Distance from each settlement to the nearest existing power line, plus terrain stats."""
import sys, numpy as np, geopandas as gpd
from shapely.strtree import STRtree
from rasterstats import zonal_stats, point_query
from common import load_country, raw, processed

country = load_country(sys.argv[1])
epsg = country["utm_epsg"]

st = gpd.read_file(processed(country, "settlements.gpkg")).to_crs(epsg)
grid = gpd.read_file(raw(country, "grid.gpkg")).to_crs(epsg)
tree = STRtree(grid.geometry.values)
nearest = tree.nearest(st.geometry.values)
st["dist_to_grid_km"] = st.geometry.distance(grid.geometry.values[nearest]) / 1000

# Straight corridor settlement→grid for terrain sampling
from shapely.geometry import LineString
from shapely.ops import nearest_points
corridors = []
for g, idx in zip(st.geometry, nearest):
    p_grid = nearest_points(g, grid.geometry.values[idx])[1]
    corridors.append(LineString([g, p_grid]).buffer(300))
corr = gpd.GeoSeries(corridors, crs=epsg).to_crs("EPSG:4326")

dem = str(raw(country, "dem.vrt"))
forest = str(raw(country, "forest.tif"))
st["elevation_m"] = [v or 0 for v in point_query(st.to_crs("EPSG:4326").geometry, dem)]
st["corridor_elev_mean"] = [z["mean"] or 0 for z in zonal_stats(corr, dem, stats="mean")]
st["corridor_elev_std"] = [z["std"] or 0 for z in zonal_stats(corr, dem, stats="std")]
st["forest_pct"] = [z["mean"] or 0 for z in zonal_stats(corr, forest, stats="mean")]
# proxy for mean slope (degrees) from elevation variability over a 600 m corridor
st["slope_deg"] = np.degrees(np.arctan(st["corridor_elev_std"] / 300)).clip(0, 45)

ghi = str(raw(country, "ghi.tif"))
st["ghi_kwh_m2_day"] = [v or 0 for v in point_query(st.to_crs("EPSG:4326").geometry, ghi)]

st.to_crs("EPSG:4326").to_file(processed(country, "settlements_dist.gpkg"), driver="GPKG")
print("done")
