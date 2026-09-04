import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ProjectCard } from "../components/ProjectCard";
import { useContent } from "../hooks/useContent";

export default function Home() {
  const { content, loading } = useContent();
  const featured = content.projects
    .filter((project) => project.featured)
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          AVEIRO · PORTUGAL
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Espaços pensados
          <br />
          com clareza, matéria
          <br />e <em>tempo.</em>
        </motion.h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <p>{content.settings.tagline}</p>
          <a href="#selecionados" className="circle-action">
            <ArrowDown size={18} />
          </a>
        </motion.div>
      </section>

      {!loading && featured[0] && (
        <section className="hero-project" id="selecionados">
          <Link to={`/projetos/${featured[0].id}`}>
            <motion.img
              src={featured[0].cover}
              alt={featured[0].title}
              initial={{ scale: 1.03 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="hero-project-caption">
              <div>
                <b>{featured[0].title}</b>
                <span>{featured[0].location}</span>
              </div>
              <span>{featured[0].year}</span>
            </div>
          </Link>
        </section>
      )}

      <section className="manifesto-grid section-pad">
        <span className="section-index">01 — SOBRE NÓS</span>
        <div>
          <p className="big-copy">{content.settings.intro}</p>
          <Link className="text-link" to="/sobre-nos">
            Saber mais <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="selected-projects section-pad">
        <div className="section-heading-row">
          <span className="section-index">02 — PROJETOS SELECCIONADOS</span>
          <Link to="/projetos" className="text-link">
            Ver todos <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="home-project-grid">
          {featured.slice(1).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              large={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="contact-cta section-pad">
        <span className="section-index">03 — CONTACTO</span>
        <div>
          <h2>
            Um projecto começa
            <br />
            com uma conversa.
          </h2>
          <Link to="/contactos" className="cta-pill">
            Falar connosco <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
