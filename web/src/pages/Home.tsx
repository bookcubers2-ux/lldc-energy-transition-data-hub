import { Link } from "react-router-dom";
import { useNodes } from "../data";
import { useT } from "../i18n";

export default function Home() {
  const { t } = useT();
  const { nodes } = useNodes();
  const priority = nodes.filter((n) => n.properties.priority).length;
  const countries = new Set(nodes.map((n) => n.properties.country)).size;
  return (
    <section className="hero">
      <h1>{t("tagline")}</h1>
      <p>{t("sub")}</p>
      <div className="cta">
        <Link to="/explore" className="btn primary">{t("explore")}</Link>
        <Link to="/method" className="btn ghost">{t("method")}</Link>
      </div>
      <div className="stats">
        <div className="stat"><b>{priority}</b><span>{t("nodes")}</span></div>
        <div className="stat"><b>{countries}</b><span>{t("countries")}</span></div>
        <div className="stat"><b>32</b><span>{t("lldc")}</span></div>
      </div>
      <img className="lldc-map" src="logo.svg" alt="" style={{ maxWidth: 160, marginTop: 40 }} />
      <div className="guarani">Tatarendy térã ta'ýi: mba'épa oikotevẽ ne tetã?</div>
    </section>
  );
}
