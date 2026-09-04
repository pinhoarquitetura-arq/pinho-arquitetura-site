import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function ProjectCard({ project, index = 0, large = false }) {
  return (
    <motion.article
      className={`project-card ${large ? 'project-card--large' : ''}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: .65, delay: Math.min(index * .04, .18), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/projetos/${project.id}`} className="project-card-link">
        <div className="project-image-wrap">
          <img src={project.cover} alt={project.title} className="project-image" />
          <div className="project-image-overlay" />
          <span className="project-open">Ver projecto</span>
        </div>
        <div className="project-meta">
          <h2>{project.title}</h2>
          <div><span>{project.location}</span><span>{project.year}</span></div>
        </div>
      </Link>
    </motion.article>
  );
}
