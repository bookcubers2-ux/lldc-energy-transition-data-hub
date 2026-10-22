"""Grid-extension cost vs solar+BESS cost, CAPEX and 20-year levelised."""
import sys, numpy as np, geopandas as gpd
from common import load_country, load_costs, processed

country, C = load_country(sys.argv[1]), load_costs()
G, B = C["grid"], C["bess"]
st = gpd.read_file(processed(country, "settlements_dist.gpkg"))


def grid_cost_per_km(row):
    cost = G["base_usd_per_km"] * (1 + G["slope_pct_per_degree"] / 100 * row.slope_deg)
    for m in G["altitude_multipliers"]:
        if row.corridor_elev_mean > m["above_m"]:
            cost *= m["factor"]
    if row.forest_pct > G["forest_threshold_pct"]:
        cost *= G["forest_multiplier"]
    return cost * G["landlocked_premium"]


def npv_factor(rate, years):
    return sum(1 / (1 + rate) ** t for t in range(1, years + 1))


st["grid_cost_per_km_usd"] = st.apply(grid_cost_per_km, axis=1)
st["grid_cost_usd"] = st["grid_cost_per_km_usd"] * st["dist_to_grid_km"]

daily = st["households"] * B["demand_kwh_per_household_day"]
st["battery_kwh"] = daily * B["autonomy_days"] / B["depth_of_discharge"]
st["pv_kwp"] = daily / (st["ghi_kwh_m2_day"].clip(lower=3.0) * B["performance_ratio"])
equip = st["battery_kwh"] * B["battery_usd_per_kwh"] + st["pv_kwp"] * B["pv_usd_per_kwp"]
st["bess_cost_usd"] = equip * (1 + B["bos_fraction"])

# Levelised 20-year cost (CAPEX + O&M + battery replacement), same discount rate for both
r, H = B["discount_rate"], B["horizon_years"]
om_bess = st["bess_cost_usd"] * B["om_fraction_per_year"] * npv_factor(r, H)
repl = st["battery_kwh"] * B["battery_usd_per_kwh"] * B["battery_replacement_fraction"] / (1 + r) ** B["battery_replacement_year"]
st["bess_lifetime_usd"] = st["bess_cost_usd"] + om_bess + repl
st["grid_lifetime_usd"] = st["grid_cost_usd"] * (1 + 0.015 * npv_factor(r, H))

st["ratio_grid_over_bess"] = st["grid_cost_usd"] / st["bess_cost_usd"]
st["verdict"] = np.where(st["ratio_grid_over_bess"] > 1, "BATTERY", "WIRE")
st.to_file(processed(country, "settlements_costs.gpkg"), driver="GPKG")
print("done")
