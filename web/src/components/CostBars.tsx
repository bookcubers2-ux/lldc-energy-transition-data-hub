import type { NodeProps } from "../types";
import { usd } from "../data";
import { useT } from "../i18n";

export default function CostBars({ p, lifetime }: { p: NodeProps; lifetime?: boolean }) {
  const { t } = useT();
  const g = lifetime ? p.grid_lifetime_usd : p.grid_cost_usd;
  const b = lifetime ? p.bess_lifetime_usd : p.bess_cost_usd;
  const max = Math.max(g, b);
  return (
    <div className="bars">
      <div className="bar grid">{t("gridCost")} · {usd(g)}<div className="track"><div className="fill" style={{ width: `${(g / max) * 100}%` }} /></div></div>
      <div className="bar bess">{t("bessCost")} · {usd(b)}<div className="track"><div className="fill" style={{ width: `${(b / max) * 100}%` }} /></div></div>
    </div>
  );
}
