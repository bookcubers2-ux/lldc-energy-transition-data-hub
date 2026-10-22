import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Methodology from "./pages/Methodology";
import Data from "./pages/Data";
import About from "./pages/About";
import { LangProvider } from "./i18n";

export default function App() {
  return (
    <LangProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/method" element={<Methodology />} />
        <Route path="/data" element={<Data />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer className="footer">LLDC Energy Transition Data Hub · v1.2 · MIT</footer>
    </LangProvider>
  );
}
