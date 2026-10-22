import { createContext, useContext, useState, ReactNode, createElement } from "react";

type Lang = "en" | "es";
const dict = {
  en: {
    tagline: "Wire, or battery?",
    sub: "An open-source map that compares the cost of extending the grid against solar + storage, settlement by settlement, across the 32 landlocked developing countries.",
    explore: "Explore the map", method: "Read the method", nodes: "priority storage nodes",
    countries: "countries mapped", lldc: "landlocked developing countries",
    filters: "Filters", country: "Country", all: "All", households: "Min. households",
    distance: "Min. distance to grid (km)", ghi: "Min. irradiation (kWh/m²/day)",
    priorityOnly: "Priority nodes only", costSlider: "Grid cost per km (USD)", reset: "Reset",
    verdictB: "Battery wins", verdictW: "Wire wins", gridCost: "Grid extension", bessCost: "Solar + storage",
    capex: "Initial CAPEX", lifetime: "20-year levelised", system: "Proposed system",
    downloadNode: "Download node (GeoJSON)", downloadAll: "Download all (CSV)", downloadGeo: "Download all (GeoJSON)",
    pickNode: "Select a node on the map", showing: "nodes shown"
  },
  es: {
    tagline: "¿Cable o batería?",
    sub: "Un mapa de código abierto que compara el costo de extender la red frente a solar + almacenamiento, asentamiento por asentamiento, en los 32 países en desarrollo sin litoral.",
    explore: "Explorar el mapa", method: "Leer la metodología", nodes: "nodos prioritarios de almacenamiento",
    countries: "países mapeados", lldc: "países en desarrollo sin litoral",
    filters: "Filtros", country: "País", all: "Todos", households: "Hogares mínimos",
    distance: "Distancia mínima a la red (km)", ghi: "Irradiación mínima (kWh/m²/día)",
    priorityOnly: "Solo nodos prioritarios", costSlider: "Costo de red por km (USD)", reset: "Reiniciar",
    verdictB: "Gana la batería", verdictW: "Gana el cable", gridCost: "Extensión de red", bessCost: "Solar + almacenamiento",
    capex: "CAPEX inicial", lifetime: "Costo nivelado a 20 años", system: "Sistema propuesto",
    downloadNode: "Descargar nodo (GeoJSON)", downloadAll: "Descargar todo (CSV)", downloadGeo: "Descargar todo (GeoJSON)",
    pickNode: "Selecciona un nodo en el mapa", showing: "nodos mostrados"
  }
};
export type Key = keyof typeof dict.en;

const Ctx = createContext<{ lang: Lang; t: (k: Key) => string; setLang: (l: Lang) => void }>(null!);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(navigator.language.startsWith("es") ? "es" : "en");
  const t = (k: Key) => dict[lang][k];
  return createElement(Ctx.Provider, { value: { lang, t, setLang } }, children);
}
export const useT = () => useContext(Ctx);
