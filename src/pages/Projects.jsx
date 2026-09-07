import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "../components/ProjectCard";
import { useContent } from "../hooks/useContent";

const sections = [
  {
    value: "own",
    label: "Projectos próprios",
    description: "Projectos desenvolvidos integralmente pela Pinho Arquitetura.",
  },
  {
    value: "collaboration",
    label: "Colaborações",
    description:
      "Projectos desenvolvidos em colaboração com outros ateliers e arquitectos.",
  },
];

const getProjectType = (project) =>
  project.projectType === "collaboration" ? "collaboration" : "own";

const getCategories = (content) => {
  if (Array.isArray(content.categories) && content.categories.length) {
    return content.categories.filter(Boolean);
  }
  return [
    ...new Set(
      content.projects.map((project) => project.category).filter(Boolean),
    ),
  ];
};

export default function Projects() {
  const { content, loading } = useContent();
  const [section, setSection] = useState("own");
  const [filter, setFilter] = useState("Todos");
  const allCategories = useMemo(() => getCategories(content), [content]);

  const sectionProjects = useMemo(
    () =>
      content.projects.filter(
        (project) => getProjectType(project) === section,
      ),
    [content.projects, section],
  );

  const availableCategories = useMemo(
    () =>
      allCategories.filter((category) =>
        sectionProjects.some((project) => project.category === category),
      ),
    [allCategories, sectionProjects],
  );

  const filters = ["Todos", ...availableCategories];
  const list = useMemo(
    () =>
      filter === "Todos"
        ? sectionProjects
        : sectionProjects.filter((project) => project.category === filter),
    [filter, sectionProjects],
  );

  const counts = useMemo(
    () => ({
      own: content.projects.filter(
        (project) => getProjectType(project) === "own",
      ).length,
      collaboration: content.projects.filter(
        (project) => getProjectType(project) === "collaboration",
      ).length,
    }),
    [content.projects],
  );

  const activeSection = sections.find((item) => item.value === section);

  useEffect(() => {
    if (filter !== "Todos" && !availableCategories.includes(filter)) {
      setFilter("Todos");
    }
  }, [availableCategories, filter]);

  const chooseSection = (value) => {
    setSection(value);
    setFilter("Todos");
  };

  return (
    <section className="projects-page section-pad page-top">
      <div className="page-title-row">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Projetos
        </motion.h1>
        <p>{content.projects.length.toString().padStart(2, "0")} projetos</p>
      </div>

      <div className="project-type-tabs" role="tablist" aria-label="Tipo de projecto">
        {sections.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={section === item.value}
            className={`project-type-tab ${section === item.value ? "active" : ""}`}
            onClick={() => chooseSection(item.value)}
          >
            <span>{item.label}</span>
            <small>{counts[item.value].toString().padStart(2, "0")}</small>
          </button>
        ))}
      </div>

      <motion.div
        className="project-group-heading"
        key={section}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h2>{activeSection.label}</h2>
        <p>{activeSection.description}</p>
      </motion.div>

      {filters.length > 1 && (
        <div className="filters">
          {filters.map((category) => (
            <button
              type="button"
              key={category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {!loading && list.length > 0 ? (
        <motion.div
          className="projects-grid"
          key={`${section}-${filter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {list.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      ) : !loading ? (
        <div className="projects-empty">
          <span>Sem projectos publicados nesta secção.</span>
        </div>
      ) : null}
    </section>
  );
}
