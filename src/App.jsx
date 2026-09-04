import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

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