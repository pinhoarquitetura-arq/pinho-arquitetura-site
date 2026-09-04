import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { to: "/projetos", label: "Projetos" },
  { to: "/sobre-nos", label: "Sobre nós" },
  { to: "/contactos", label: "Contactos" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <Link
          className="wordmark"
          to="/"
          onClick={closeMenu}
          aria-label="Pinho Arquitetura — Página inicial"
        >
          <span className="header-logo-crop">
            <img
              className="header-logo"
              src="/logos/monograma-transparente.png"
              alt="Pinho Arquitetura"
            />
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="Navegação móvel">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
