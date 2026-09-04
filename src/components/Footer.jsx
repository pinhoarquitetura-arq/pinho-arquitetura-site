import { Link } from "react-router-dom";
import { useContent } from "../hooks/useContent";

export default function Footer() {
  const { content } = useContent();
  const settings = content.settings;

  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link to="/" aria-label="Pinho Arquitetura — Página inicial">
          <img
            className="footer-logo"
            src="/logos/monograma-transparente.png"
            alt="Pinho Arquitetura"
          />
        </Link>

        <div>
          <strong className="footer-brand-name">Pinho Arquitetura</strong>
          <p>
            {settings.footerNote ||
              settings.tagline ||
              "Arquitetura, do conceito à obra."}
          </p>
        </div>
      </div>

      <nav className="footer-links" aria-label="Navegação do rodapé">
        <Link to="/projetos">Projetos</Link>
        <Link to="/sobre-nos">Sobre nós</Link>
        <Link to="/contactos">Contactos</Link>
        <Link className="admin-link" to="/admin">
          Administração
        </Link>
      </nav>

      <span>© {new Date().getFullYear()} Pinho Arquitetura</span>
    </footer>
  );
}
