import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../hooks/useContent";

const renderIntro = (intro) => {
  const parts = intro.split(/(matéria e forma)/gi);

  return parts.map((part, index) =>
    part.toLowerCase() === "matéria e forma" ? <em key={index}>{part}</em> : part,
  );
};

export default function Home() {
  const { content, loading } = useContent();

  const featured = content.projects
    .filter((project) => project.featured)
    .slice(0, 1);

  return (
    <>
      {!loading && featured[0] && (
        <section className="hero-project">
          <Link to={`/projetos/${featured[0].id}`}>
            <motion.img
              src={featured[0].cover}
              alt={featured[0].title}
              initial={{ scale: 1.03 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.3,
                ease: [0.22, 1, 0.36, 1],
              }}
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
        <span className="section-index">
          01 — SOBRE NÓS
        </span>

        <div>
          <p className="big-copy">
            {renderIntro(content.settings.intro)}
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

      <section className="contact-cta section-pad">
        <span className="section-index">
          02 — CONTACTO
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
