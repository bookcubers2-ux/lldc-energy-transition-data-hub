import { useMemo, useState } from "react";
import MapView from "../components/MapView";
import Filters from "../components/Filters";
import NodeCard from "../components/NodeCard";
import { useNodes, filterNodes } from "../data";
import { DEFAULT_FILTERS, type FilterState, type NodeFeature } from "../types";

export default function Explore() {
  const { nodes } = useNodes();
  const [f, setF] = useState<FilterState>(DEFAULT_FILTERS);
  const [sel, setSel] = useState<NodeFeature | null>(null);
  const shown = useMemo(() => filterNodes(nodes, f), [nodes, f]);
  const selected = sel ? shown.find((n) => n.properties.node_id === sel.properties.node_id) ?? null : null;
  return (
    <div className="explore">
      <aside className="sidebar">
        <Filters f={f} set={setF} count={shown.length} />
        <NodeCard node={selected} />
      </aside>
      <MapView nodes={shown} selected={selected} onSelect={setSel} />
    </div>
  );
}
