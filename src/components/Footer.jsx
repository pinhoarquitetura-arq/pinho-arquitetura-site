import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link
          className="footer-brand-text"
          to="/"
          aria-label="Pinho Arquitetura — Página inicial"
        >
          PINHO ARQUITETURA
        </Link>

        <p className="footer-services-line">
          Arquitetura e Interiores, do conceito à obra.
        </p>
      </div>

      <nav
        className="footer-links"
        aria-label="Navegação do rodapé"
      >
        <Link to="/">Início</Link>
        <Link to="/projetos">Projetos</Link>
        <Link to="/servicos">Serviços</Link>
        <Link to="/sobre-nos">Sobre nós</Link>
        <Link to="/contactos">Contactos</Link>

        <Link className="admin-link" to="/admin">
          Administração
        </Link>
      </nav>

      <span className="footer-copyright">
        © {new Date().getFullYear()} Pinho Arquitetura
      </span>
    </footer>
  );
}