"""Cluster WorldPop population into settlements and estimate households."""
import sys, numpy as np, rasterio
import geopandas as gpd
from shapely.geometry import Point
from scipy.cluster.hierarchy import fcluster, linkage
from common import load_country, load_costs, raw, processed

country, costs = load_country(sys.argv[1]), load_costs()
S = costs["settlements"]

with rasterio.open(raw(country, "population.tif")) as src:
    pop = src.read(1); tr = src.transform; nodata = src.nodata
mask = (pop > S["min_population_cell"]) & (pop != nodata)
rows, cols = np.where(mask)
xs, ys = rasterio.transform.xy(tr, rows, cols)
pts = gpd.GeoDataFrame({"pop": pop[rows, cols]},
                       geometry=[Point(x, y) for x, y in zip(xs, ys)], crs="EPSG:4326")
pts = pts.to_crs(country["utm_epsg"])

# Chunked single-linkage clustering (cells within cluster_radius_m form one settlement)
coords = np.c_[pts.geometry.x, pts.geometry.y]
labels = np.zeros(len(pts), dtype=int); offset = 0
CH = 20000
for i in range(0, len(pts), CH):
    sub = coords[i:i+CH]
    if len(sub) == 1:
        labels[i:i+CH] = offset + 1; offset += 1; continue
    Z = linkage(sub, method="single")
    l = fcluster(Z, t=S["cluster_radius_m"], criterion="distance")
    labels[i:i+CH] = l + offset; offset += l.max()
pts["cluster"] = labels

agg = pts.dissolve(by="cluster", aggfunc={"pop": "sum"})
agg["geometry"] = agg.geometry.centroid
agg["households"] = (agg["pop"] / S["persons_per_household"]).round().astype(int)
agg = agg[agg["households"] >= 10].reset_index(drop=True)
agg["settlement_id"] = [f"{country['country']}-{i:05d}" for i in range(len(agg))]
agg.to_crs("EPSG:4326").to_file(processed(country, "settlements.gpkg"), driver="GPKG")
print(len(agg), "settlements")
