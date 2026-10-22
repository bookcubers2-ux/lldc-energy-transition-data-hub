import { NavLink } from "react-router-dom";
import { useT } from "../i18n";

export default function Nav() {
  const { lang, setLang } = useT();
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");
  return (
    <nav className="nav">
      <img src="logo.svg" alt="" />
      <span className="brand">LLDC Energy Transition Data Hub</span>
      <div className="links">
        <NavLink to="/" className={cls} end>Home</NavLink>
        <NavLink to="/explore" className={cls}>Map</NavLink>
        <NavLink to="/method" className={cls}>Method</NavLink>
        <NavLink to="/data" className={cls}>Data</NavLink>
        <NavLink to="/about" className={cls}>About</NavLink>
      </div>
      <button className="lang" onClick={() => setLang(lang === "en" ? "es" : "en")}>{lang === "en" ? "ES" : "EN"}</button>
    </nav>
  );
}
