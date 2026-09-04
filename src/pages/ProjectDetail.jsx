import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

function MediaBlock({ item, label }) {
  return (
    <div className="media-item">
      {item.image ? (
        <img src={item.image} alt={item.title} />
      ) : (
        <div className="media-placeholder">
          <span>{label}</span>
          <small>Imagem / documento adicionável no admin</small>
        </div>
      )}
      <div>
        <b>{item.title}</b>
        <span>{item.subtitle}</span>
      </div>
    </div>
  );
}

const normaliseGalleryItem = (item, index) =>
  typeof item === "string"
    ? {
        id: `foto-antiga-${index}`,
        src: item,
        size: index % 3 === 1 ? "narrow" : "wide",
      }
    : {
        id: item.id || `foto-${index}`,
        src: item.src || item.image || "",
        size: item.size || "wide",
      };

export default function ProjectDetail() {
  const { id } = useParams();
  const { content, loading } = useContent();

  const project = content.projects.find((item) => item.id === id);

  if (loading) {
    return <section className="section-pad page-top" aria-busy="true" />;
  }

  if (!project) {
    return (
      <section className="section-pad page-top">
        <h1>Projecto não encontrado.</h1>
        <Link to="/projetos">Voltar</Link>
      </section>
    );
  }

  const index = content.projects.findIndex((item) => item.id === project.id);
  const next = content.projects[(index + 1) % content.projects.length];
  const gallery = (project.gallery || []).map(normaliseGalleryItem);

  return (
    <article className="project-detail page-top">
      <section className="project-intro section-pad">
        <Link className="back-link" to="/projetos">
          <ArrowLeft size={17} /> Projetos
        </Link>
        <div className="project-title-grid">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {project.title}
          </motion.h1>
          <div className="project-title-facts">
            <span>{project.location}</span>
            <span>{project.year}</span>
            <span>{project.category}</span>
            <span>{project.status}</span>
            {project.projectType === "collaboration" && (
              <span className="project-collaboration">
                Colaboração
                {project.collaborationWith
                  ? ` com ${project.collaborationWith}`
                  : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      <motion.div
        className="detail-cover"
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={project.cover} alt={project.title} />
      </motion.div>

      <section className="project-story section-pad">
        <span className="section-index">SOBRE</span>
        <div>
          <p className="big-copy">{project.description}</p>
        </div>
      </section>

      <section className="facts-table section-pad">
        {project.facts.map(([label, value], factIndex) => (
          <div className="fact-row" key={factIndex}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </section>

      <section className="gallery section-pad">
        {gallery.map((item, photoIndex) => (
          <motion.figure
            key={item.id}
            className={`gallery-${item.size} ${item.size !== "wide" && photoIndex % 2 === 1 ? "gallery-align-right" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.65 }}
          >
            <img src={item.src} alt={`${project.title} ${photoIndex + 1}`} />
          </motion.figure>
        ))}
      </section>

      {project.drawings?.length > 0 && (
        <section className="detail-info-section section-pad">
          <h2>Drawings</h2>
          <div className="media-grid">
            {project.drawings.map((item, itemIndex) => (
              <MediaBlock key={itemIndex} item={item} label="DRAWING" />
            ))}
          </div>
        </section>
      )}

      {project.models?.length > 0 && (
        <section className="detail-info-section section-pad">
          <h2>Models</h2>
          <div className="media-grid">
            {project.models.map((item, itemIndex) => (
              <MediaBlock key={itemIndex} item={item} label="MODEL" />
            ))}
          </div>
        </section>
      )}

      {project.credits?.length > 0 && (
        <section className="detail-info-section section-pad">
          <h2>Credits</h2>
          <div className="credits-list">
            {project.credits.map(([label, value], creditIndex) => (
              <div key={creditIndex}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.featuredOn?.length > 0 && (
        <section className="detail-info-section section-pad">
          <h2>Featured on</h2>
          <div className="featured-list">
            {project.featuredOn.map((item, itemIndex) =>
              item.url ? (
                <a
                  key={itemIndex}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                  <ArrowUpRight size={18} />
                </a>
              ) : (
                <div key={itemIndex}>{item.name}</div>
              ),
            )}
          </div>
        </section>
      )}

      {next && (
        <section className="next-project section-pad">
          <span>Projecto seguinte</span>
          <Link to={`/projetos/${next.id}`}>
            <h2>{next.title}</h2>
            <ArrowUpRight size={34} />
          </Link>
        </section>
      )}
    </article>
  );
}
