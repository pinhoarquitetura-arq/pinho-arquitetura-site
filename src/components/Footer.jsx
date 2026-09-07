import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link
          className="footer-logo-frame"
          to="/"
          aria-label="Pinho Arquitetura — Página inicial"
        >
          <img
            className="footer-logo-horizontal"
            src="/logos/logo_sem_fundo.png"
            alt="Pinho Arquitetura"
          />
        </Link>

        <p className="footer-services-line">
          Arquitetura · Interiores · Visualização 3D · BIM ·
          Acompanhamento de obra
        </p>
      </div>

      <nav
        className="footer-links"
        aria-label="Navegação do rodapé"
      >
        <Link to="/projetos">Projetos</Link>
        <Link to="/servicos">Serviços</Link>
        <Link to="/sobre-nos">Sobre nós</Link>
        <Link to="/contactos">Contactos</Link>

        <Link className="admin-link" to="/admin">
          Administração
        </Link>
      </nav>

      <span>
        © {new Date().getFullYear()} Pinho Arquitetura
      </span>
    </footer>
  );
}