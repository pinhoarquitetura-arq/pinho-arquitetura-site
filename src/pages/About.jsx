import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    number: "01",
    title: "Arquitetura",
    text: "Do conceito ao projeto.",
  },
  {
    number: "02",
    title: "Interiores",
    text: "Espaços, materiais e detalhe.",
  },
  {
    number: "03",
    title: "Obra",
    text: "Acompanhamento da execução.",
  },
  {
    number: "04",
    title: "BIM + 3D",
    text: "Coordenação e visualização.",
  },
];

const process = [
  {
    number: "01",
    title: "Ouvir",
    text: "Contexto e objetivos",
  },
  {
    number: "02",
    title: "Pensar",
    text: "Conceito e estratégia",
  },
  {
    number: "03",
    title: "Desenvolver",
    text: "Projeto e detalhe",
  },
  {
    number: "04",
    title: "Construir",
    text: "Continuidade em obra",
  },
];

export default function About() {
  return (
    <article className="about-v2 page-top">
      <section className="about-v2-title section-pad">
        <div className="page-title-row">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Sobre nós
          </motion.h1>

          <p>Arquitetura, do conceito à obra.</p>
        </div>
      </section>

      <section className="about-v2-intro section-pad">
        <div className="about-v2-intro-copy">
          <span className="section-index">
            PINHO ARQUITETURA
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Cada projeto
            <br />
            começa por <em>ouvir.</em>
          </motion.h2>

          <p>
            Desenvolvimento de projetos de arquitetura e interiores
            pensados a partir do lugar, das pessoas e da forma
            como cada espaço será vivido.
          </p>

          <div className="about-v2-values">
            <span>Clareza</span>
            <span>Rigor</span>
            <span>Proximidade</span>
          </div>
        </div>

        <motion.figure
          className="about-v2-person"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2 }}
        >
          <div className="about-v2-image">
            <img
              src="/logos/diogo-pinho.png"
              alt="Diogo Pinho, arquiteto"
            />
          </div>

          <figcaption>
            <div>
              <strong>Diogo Pinho</strong>
              <span>Arquiteto</span>
            </div>

            <span>Aveiro · Portugal</span>
          </figcaption>
        </motion.figure>
      </section>

      <section className="about-v2-statement section-pad">
        <span className="section-index">A ABORDAGEM</span>

        <p>
          Espaços claros, funcionais e coerentes.
          <br />
          Uma linguagem contemporânea com
          <br />
          atenção ao <em>detalhe.</em>
        </p>
      </section>

      <section className="about-v2-services section-pad">
        <div className="about-v2-section-title">
          <span className="section-index">01 — SERVIÇOS</span>

          <h2>O que fazemos</h2>
        </div>

        <div className="about-v2-services-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
              }}
            >
              <div className="about-v2-service-top">
                <span>{service.number}</span>

                <div className="about-v2-service-symbol">
                  <i />
                  <i />
                </div>
              </div>

              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-v2-process section-pad">
        <div className="about-v2-section-title">
          <span className="section-index">
            02 — COMO TRABALHAMOS
          </span>

          <h2>Um processo claro</h2>
        </div>

        <div className="about-v2-process-line">
          {process.map((step, index) => (
            <motion.div
              className="about-v2-step"
              key={step.number}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <div className="about-v2-step-marker">
                <span>{step.number}</span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-v2-contact section-pad">
        <span className="section-index">03 — CONTACTO</span>

        <div>
          <h2>
            Tem um espaço
            <br />
            para <em>transformar?</em>
          </h2>

          <Link to="/contactos" className="cta-pill">
            Falar connosco
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </article>
  );
}