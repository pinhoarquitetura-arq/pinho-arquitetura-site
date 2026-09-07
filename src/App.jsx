import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "../../pinho-arquitetura-concept/src/components/Layout";
import Home from "../../pinho-arquitetura-concept/src/pages/Home";
import Projects from "../../pinho-arquitetura-concept/src/pages/Projects";
import ProjectDetail from "../../pinho-arquitetura-concept/src/pages/ProjectDetail";
import About from "../../pinho-arquitetura-concept/src/pages/About";
import Contact from "../../pinho-arquitetura-concept/src/pages/Contact";
import Admin from "../../pinho-arquitetura-concept/src/pages/Admin";
import Services from "./pages/Services";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/projetos"
          element={<Projects />}
        />

        <Route
          path="/projetos/:id"
          element={<ProjectDetail />}
        />
        <Route path="/servicos" element={<Services />} />

        <Route
          path="/sobre-nos"
          element={<About />}
        />

        {/* Links antigos passam para a página nova */}
        <Route
          path="/estudio"
          element={
            <Navigate
              to="/sobre-nos"
              replace
            />
          }
        />

        <Route
          path="/contactos"
          element={<Contact />}
        />
      </Route>
    </Routes>
  );
}