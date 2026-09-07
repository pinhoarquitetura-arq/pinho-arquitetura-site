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

  const mainProject = featured[0];

  return (
    <>
      <section
        className={`hero ${
          mainProject ? "hero--featured" : ""
        }`}
      >
        {!loading && mainProject && (
          <>
            <motion.img
              className="hero-background-image"
              src={mainProject.cover}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <div className="hero-background-overlay" />
          </>
        )}

        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          PINHO ARQUITETURA · AVEIRO
        </motion.div>

        <div className="hero-main">
          <motion.h1
            className="hero-conversation-title"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span>UM BOM PROJETO</span>
            <span>UMA BOA CONVERSA</span>
          </motion.h1>
        </div>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="hero-bottom-content">
            <p>{content.settings.tagline}</p>

            {!loading && mainProject && (
              <Link
                className="hero-featured-link"
                to={`/projetos/${mainProject.id}`}
              >
                <span>
                  <b>{mainProject.title}</b>

                  <small>
                    {mainProject.location}
                    {mainProject.year
                      ? ` · ${mainProject.year}`
                      : ""}
                  </small>
                </span>

                Ver projeto
                <ArrowUpRight size={17} />
              </Link>
            )}
          </div>

          <a
            href="#sobre-home"
            className="circle-action"
            aria-label="Continuar a explorar"
          >
            <ArrowDown size={18} />
          </a>
        </motion.div>
      </section>

      <section
        className="manifesto-grid section-pad"
        id="sobre-home"
      >
        <span className="section-index">
          01 — SOBRE NÓS
        </span>

        <div>
          <p className="big-copy">
            {content.settings.intro}
          </p>

          <Link
            className="text-link"
            to="/sobre-nos"
          >
            Saber mais
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="selected-projects section-pad">
        <div className="section-heading-row">
          <span className="section-index">
            02 — PROJETOS SELECIONADOS
          </span>

          <Link
            to="/projetos"
            className="text-link"
          >
            Ver todos
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="home-project-grid">
          {featured
            .slice(1)
            .map((project, index) => (
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
        <span className="section-index">
          03 — CONTACTO
        </span>

        <div>
          <h2>
            Um projeto começa
            <br />
            com uma conversa.
          </h2>

          <Link
            to="/contactos"
            className="cta-pill"
          >
            Fale connosco
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}