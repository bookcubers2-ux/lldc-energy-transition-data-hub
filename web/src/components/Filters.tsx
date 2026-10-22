import type { FilterState } from "../types";
import { DEFAULT_FILTERS } from "../types";
import { useT } from "../i18n";

export default function Filters({ f, set, count }: { f: FilterState; set: (f: FilterState) => void; count: number }) {
  const { t } = useT();
  const u = (patch: Partial<FilterState>) => set({ ...f, ...patch });
  return (
    <div className="filters">
      <h3>{t("filters")}</h3>
      <label>{t("country")}</label>
      <select value={f.country} onChange={(e) => u({ country: e.target.value as FilterState["country"] })}>
        <option value="ALL">{t("all")}</option><option value="BOL">Bolivia</option><option value="PRY">Paraguay</option>
      </select>
      <label>{t("households")} <span className="val">{f.minHouseholds}</span></label>
      <input type="range" min={0} max={500} step={10} value={f.minHouseholds} onChange={(e) => u({ minHouseholds: +e.target.value })} />
      <label>{t("distance")} <span className="val">{f.minDistance}</span></label>
      <input type="range" min={0} max={150} step={5} value={f.minDistance} onChange={(e) => u({ minDistance: +e.target.value })} />
      <label>{t("ghi")} <span className="val">{f.minGhi.toFixed(1)}</span></label>
      <input type="range" min={3} max={7} step={0.1} value={f.minGhi} onChange={(e) => u({ minGhi: +e.target.value })} />
      <label>{t("costSlider")} <span className="val">{f.costPerKm === null ? "pipeline" : f.costPerKm.toLocaleString()}</span></label>
      <input type="range" min={5000} max={40000} step={500} value={f.costPerKm ?? 15000} onChange={(e) => u({ costPerKm: +e.target.value })} />
      <label><input type="checkbox" checked={f.onlyPriority} onChange={(e) => u({ onlyPriority: e.target.checked })} /> {t("priorityOnly")}</label>
      <button className="reset" onClick={() => set(DEFAULT_FILTERS)}>{t("reset")}</button>
      <div className="count">{count} {t("showing")}</div>
    </div>
  );
}
